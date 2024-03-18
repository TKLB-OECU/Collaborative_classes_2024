from transformers import (
    AutoModelForSeq2SeqLM, 
    AutoTokenizer,
)
from fastapi import FastAPI
import torch
import uvicorn
from setproctitle import setproctitle
from pydantic import BaseModel

app = FastAPI()

custom_headers = {"Access-Control-Allow-Origin": "*",}

model_path = "/src/models/nllb-200-distilled-600M/"

model = AutoModelForSeq2SeqLM.from_pretrained(model_path)


if torch.cuda.is_available():
    print("Using GPU")
    model = model.to("cuda")
else:
    print("Using CPU")
    model = model.to("cpu")


class MultipleElementsRequest(BaseModel):
    text: str
    input_code: str
    output_code: str
    max_length: int


@app.get("/translation/")
async def run_model(request: MultipleElementsRequest):
    text = request.text
    input_code = request.input_code
    output_code = request.output_code
    max_length = request.max_length

    tokenizer = AutoTokenizer.from_pretrained(model_path,src_lang=input_code)
    input = tokenizer(text.replace("\n",""), return_tensors="pt")
    with torch.no_grad():
        output_ids = model.generate(
            **input.to(model.device),
            forced_bos_token_id=tokenizer.lang_code_to_id[output_code],
            max_length=max_length
        )  
    result = tokenizer.decode(output_ids.tolist()[0]).replace(f"{output_code}", "").replace("</s>", "")
    print(f"\ntranslation result: {text}    --->    {result}\n")
    return result


if __name__ == "__main__":
    setproctitle("Collaborative_classes_2024 [nllb-200]")
    uvicorn.run(app, host="0.0.0.0", port=8010)