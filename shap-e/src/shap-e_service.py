import torch
import trimesh
import base64
import sys
import uvicorn
import fastapi
import time
import requests
import re
import os

from setproctitle import setproctitle
from fastapi.responses import JSONResponse
from os.path import dirname, abspath

# 現在のスクリプトの親ディレクトリの絶対パスを取得
current_dir = dirname(abspath(__file__))
parent_dir = dirname(current_dir)
# 親ディレクトリの絶対パスをsys.pathに追加
sys.path.append(parent_dir)

# shap_eパッケージのモジュールをインポート
from shap_e.diffusion.sample import sample_latents
from shap_e.diffusion.gaussian_diffusion import diffusion_from_config
from shap_e.models.download import load_model, load_config
#from shap_e.util.notebooks import create_pan_cameras, decode_latent_images, gif_widget
from shap_e.util.notebooks import decode_latent_mesh

#FastAPIのインスタンス化
app = fastapi.FastAPI()

#"アイテム"のエンドポイント
@app.get("/shape_generate/")
def items(prompt: str):
    try:
        while True:
            #VRAMの使用量を確認
            vram_check()

            #VRAMが9割以上使用されている場合は10秒待機
            if torch.cuda.memory_allocated() > 0.9 * torch.cuda.max_memory_allocated():
                print("### VRAM is almost full. Retry after 10 seconds ###")
                time.sleep(10)
                continue
            #VRAMが9割未満の場合は処理を続行
            else:
                #プロンプトのクリーニング
                prompt = prompt_cleaning(prompt)
                #プロンプトを翻訳
                prompt = pronmpt_translation(prompt)
                #モデル名称
                model_name = re.sub(" ","_",prompt)
                #翻訳済みプロンプトを受け取り、3Dモデルを生成
                shape_generate(prompt,os.path.join(save_path, f"{model_name}.ply"))
                #生成した3Dモデルをglb形式に変換した後base64へエンコード
                glb_base64 = glb_to_base64(os.path.join(save_path, f"{model_name}.ply"))
                #生成した3Dモデルのbase64を返す
                return JSONResponse(content=glb_base64, headers={"Access-Control-Allow-Origin": "*"})
        #エラーハンドリング
    except Exception as e:
        print(e)


def pronmpt_translation(prompt):

    #json形式でリクエストのひながあｔを作成
    payload = {
        "text" : prompt,
        "input_code" : "jpn_Jpan",    #翻訳元言語
        "output_code" : "eng_Latn",   #翻訳先言語
        "max_length" : 1000     #翻訳後の最大文字数
    }

    #nllb-200サーバーURL
    url = "http://133.89.44.20:8010/translation/"
    #リクエストを送信
    response = requests.get(url, json=payload)

    return response.text.replace("\"", "")


def prompt_cleaning(prompt):
    # アルファベット、数字、ピリオド、カンマ、日本語、空白以外の文字を削除する正規表現パターン
    clean_text = re.sub(r'[^\w.,\u3000-\u30FF\u3040-\u309F\u4E00-\u9FFF\s]', '', prompt)
    return clean_text



def vram_check():
    allocated_memory = torch.cuda.memory_allocated()
    max_memory = torch.cuda.max_memory_allocated()
    print(f"### Allocated Memory: {allocated_memory / 1024 / 1024} MB ###")
    print(f"### Max Memory Allocated: {max_memory / 1024 / 1024} MB ###")


def shape_generate(prompt,Generated_name):
    latents = sample_latents(
    batch_size=batch_size,
    model=model,
    diffusion=diffusion,
    guidance_scale=guidance_scale,
    model_kwargs=dict(texts=[prompt] * batch_size),
    progress=True,
    clip_denoised=True,
    use_fp16=True,
    use_karras=True,
    karras_steps=64,
    sigma_min=1e-3,
    sigma_max=160,
    s_churn=0,
    )
    for i, latent in enumerate(latents):
        t = decode_latent_mesh(xm, latent).tri_mesh()
        with open(Generated_name, 'wb') as f:
            t.write_ply(f)


def glb_to_base64(Generated_name):
    mesh = trimesh.load(Generated_name)

    #glb形式に変換
    glb_data = mesh.export(file_type='glb')
    #base64に変換
    return base64.b64encode(glb_data).decode('utf-8')


if __name__ == "__main__":
    #プロセス名称の指定
    setproctitle('Collaborative_classes_2024 [shap-e]')

    #モデル保存先の確認
    save_path = "./shap"
    if not os.path.exists(save_path):
        print("Create a directory to save the model.")
        os.makedirs(save_path)


    #使用するデバイスの設定
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    #モデル群のロード
    if device.type == "cuda":
        print('Models loading...')
        xm = load_model('transmitter', device=device)
        model = load_model('text300M', device=device)
        diffusion = diffusion_from_config(load_config('diffusion'))
        print('Models loaded')
    else:
        print('Models loading...')
        xm = load_model('transmitter', device=device)
        model = load_model('text300M', device=device)
        diffusion = diffusion_from_config(load_config('diffusion'))
        print('Models loaded')


    #バッチサイズとガイダンススケールの設定
    batch_size = 1
    guidance_scale = 20

    #サーバーを起動
    uvicorn.run(app, host="0.0.0.0", port=8000)
