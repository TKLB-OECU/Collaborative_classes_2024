//##################################
//########  similarity側   #########
//##################################
var url = null;
document.getElementById('similarity').addEventListener('submit', function(event) {
    event.preventDefault(); // デフォルトのフォーム送信を防ぐ

    // フォームから入力値を取得
    var text = document.getElementById('text').value;

    // Web APIのエンドポイント
    var apiUrl = 'http://133.89.44.20:8020/similarity/'; // 実際のAPIのURLに置き換える

    // リクエストを送信
    console.log('リクエストを送信:', "「" + text + "」");


    fetch(apiUrl + "?text=" + text)
    .then(response => {
        if (!response.ok) {
            console.error('エラーレスポンス:', response);
        }
        return response.json();
    })
    .then(data => {
        // APIからのレスポンスを処理する
        document.getElementById("response-column").innerText = data.join("\n");;
        console.log('レスポンスを受信:', data);
    })
    .catch(error => {
        var errorContainer = document.getElementById('responseContainer');
        errorContainer.innerText = 'エラーが発生しました: ' + error.message;
        console.error('Error:', error);
    });
});






//##################################
//########  addition側   #########
//##################################
var url = null;
document.getElementById('addition').addEventListener('submit', function(event) {
    event.preventDefault(); // デフォルトのフォーム送信を防ぐ

    // フォームから入力値を取得
    var text_1 = document.getElementById('text_1').value;
    var text_2 = document.getElementById('text_2').value;

    // Web APIのエンドポイント
    var apiUrl = 'http://133.89.44.20:8020/addition/'; // 実際のAPIのURLに置き換える

    // リクエストを送信
    console.log('リクエストを送信:', "「" + text_1 + "」" , "「" + text_2 + "」");


    fetch(apiUrl + "?text_1=" + text_1 + "&text_2=" + text_2)
    .then(response => {
        if (!response.ok) {
            console.error('エラーレスポンス:', response);
        }
        return response.json();
    })
    .then(data => {
        // APIからのレスポンスを処理する
        document.getElementById("response-column").innerText = data.join("\n");;
        console.log('レスポンスを受信:', data);
    })
    .catch(error => {
        var errorContainer = document.getElementById('responseContainer');
        errorContainer.innerText = 'エラーが発生しました: ' + error.message;
        console.error('Error:', error);
    });
});