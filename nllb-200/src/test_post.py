import requests
import re

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

text = prompt_cleaning("%&'(こんにちは、世界！)")
text = pronmpt_translation(text)
print(text)
