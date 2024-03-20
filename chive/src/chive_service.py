import gensim
import requests
import fastapi
import uvicorn
import re
from setproctitle import setproctitle
from fastapi.responses import JSONResponse

#FastAPIのインスタンス化
app = fastapi.FastAPI()

def text_cleaning(text):
    # アルファベット、数字、ピリオド、カンマ、日本語、空白以外の文字を削除する正規表現パターン
    clean_text = re.sub(r'[^\w.,\u3000-\u30FF\u3040-\u309F\u4E00-\u9FFF\s]', '', text)
    return clean_text



#2つのテキストの加算を行い、類似単語を返す
@app.get("/addition/")
def addition(text_1: str, text_2: str):
    text_1 = text_cleaning(text_1)
    text_2 = text_cleaning(text_2)
    result = chive.most_similar(positive=[text_1,text_2] ,topn=10)
    return JSONResponse(content=result, headers={"Access-Control-Allow-Origin": "*"})



#テキストに対する類似単語を返す
@app.get("/similarity/")
def similarity(text: str):
    text = text_cleaning(text)
    result = chive.most_similar(text, topn=10)
    return JSONResponse(content=result, headers={"Access-Control-Allow-Origin": "*"})



if __name__ == "__main__":
    #プロセス名称の指定
    setproctitle('Collaborative_classes_2024 [chive]')

    # chiVe (v1.2-mc90) の読み込み
    chive = gensim.models.KeyedVectors.load('/src/models/chive/chive-1.3-mc15_gensim/chive-1.3-mc15.kv')


    #サーバーを起動
    uvicorn.run(app, host="0.0.0.0", port=8020)
