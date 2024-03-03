import torch
import fastapi
import trimesh
import base64


from fastapi.responses import JSONResponse
from shap_e.diffusion.sample import sample_latents
from shap_e.diffusion.gaussian_diffusion import diffusion_from_config
from shap_e.models.download import load_model, load_config
from shap_e.util.notebooks import create_pan_cameras, decode_latent_images, gif_widget
from shap_e.util.notebooks import decode_latent_mesh

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

print('Loading models...')
xm = load_model('transmitter', device=device)
model = load_model('text300M', device=device)
diffusion = diffusion_from_config(load_config('diffusion'))
print('Models loaded.')

batch_size = 1
guidance_scale = 20

app = fastapi.FastAPI()

@app.get("/items/")
def run_model(prompt: str):
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
    render_mode = 'nerf' # you can change this to 'stf'
    size = 64 # this is the size of the renders; higher values take longer to render.


    for i, latent in enumerate(latents):
        t = decode_latent_mesh(xm, latent).tri_mesh()
        with open(f'tmp.ply', 'wb') as f:
            t.write_ply(f)
        break
    mesh = trimesh.load("tmp.ply")

    #glb形式に変換
    glb_data = mesh.export(file_type='glb')
    #base64に変換
    glb_base64 = base64.b64encode(glb_data).decode('utf-8')
    #print(glb_base64)

    custom_headers = {
        "Access-Control-Allow-Origin": "*",
    }
    return JSONResponse(content=glb_base64, headers=custom_headers)
