import requests

def similarity(text):
    #nllb-200サーバーURL
    url = "http://133.89.44.20:8020/similarity/"
    #リクエストを送信
    response = requests.get(url + f"?text={text}")

    return response.text


def addition(text_1, text_2):
    #nllb-200サーバーURL
    url = "http://133.89.44.20:8020/addition/"

    response = requests.get(url + f"?text_1={text_1}&text_2={text_2}")
    return response.text

response = addition("父", "コーヒー")
print(response)

print("========================================")

response = similarity("父")
print(response)

