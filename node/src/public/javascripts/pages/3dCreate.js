//###################################
//########　3Dモデル表示処理　########
//##################################

// キャンバスサイズ
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// ウィンドウのリサイズ時にキャンバスサイズを更新する関数
const resizeCanvas = () => {
    // ウィンドウサイズを取得
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // カメラのアスペクト比を更新
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // レンダラーのサイズを更新
    renderer.setSize(sizes.width, sizes.height);
};

// ウィンドウのリサイズイベントリスナーを追加
window.addEventListener('resize', resizeCanvas);

// シーン
const scene = new THREE.Scene();

// カメラの設定
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 5);
camera.lookAt(0, 0, 0);

// レンダラー
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('3dCreate_canvas')
});
renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor(0xffffff); // 背景色を白に設定

// 光源の追加(立体感を認識しやすいように一定方向から照らす)
const ambientLight = new THREE.AmbientLight(0xffffff, 4);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(0, 2, 2); // 光源の位置を微調整
scene.add(directionalLight);

// カメラと同じ位置に光源を配置
directionalLight.position.copy(camera.position);
// カメラの方向を取得して光源の方向に設定
directionalLight.target.position.copy(camera.getWorldDirection(new THREE.Vector3()).negate());
// シーンに追加
scene.add(directionalLight);

let model;

// モデルのロード関数
function loadModel(data) {
    const loader = new THREE.GLTFLoader();
    const dracoLoader = new THREE.DRACOLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(data, function (gltf) {
    if (model) {
        scene.remove(model);
    }
    model = gltf.scene;
    scene.add(model);
    animate(); // モデルが読み込まれた後にアニメーションを開始
    }, undefined, function (error) {
      console.error("モデルの読み込み中にエラーが発生しました。", error);
    });
  }
// アニメーション関数
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}






//#################################
//########　フォーム処理   #########
//#################################
var url = null;
document.getElementById('apiForm').addEventListener('submit', function(event) {
    event.preventDefault(); // デフォルトのフォーム送信を防ぐ

    // フォームから入力値を取得
    var inputData = document.getElementById('inputData').value;

    // Web APIのエンドポイント
    var apiUrl = 'http://133.89.44.20:8020/items/?prompt='; // 実際のAPIのURLに置き換える

    // ボタンを非活性化
    document.getElementById('apiForm').querySelector('button').disabled = true;

    // ダウンロードボタンを非活性化する
    document.getElementById('downloadButton').disabled = true;

    // リクエストを送信
    console.log('リクエストを送信:', "「" + inputData + "」");


    fetch(apiUrl + inputData)
    .then(response => {
        if (!response.ok) {
            console.error('エラーレスポンス:', response);
        }
        return response.json();
    })
    .then(data => {
        // APIからのレスポンスを処理する
        var responseContainer = document.getElementById('responseContainer');
        var base64EncodedData = data
        // base64データをデコードしてバイナリデータを取得
        var binaryData = atob(base64EncodedData);

        // バイナリデータを配列に変換
        var bytes = new Uint8Array(binaryData.length);
        for (var i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
        }

        // バイナリデータをBlobオブジェクトに変換
        var blob = new Blob([bytes], { type: 'application/octet-stream' });

        // ファイルとして保存するためのURLを生成
        url = URL.createObjectURL(blob);

        // ダウンロード用のリンクを作成
        // var link = document.createElement('a');
        // link.href = url;
        // link.download = 'model.glb'; // ファイル名を指定（.glbや.gltfなど）
        // link.click();

        // モデルをロード
        loadModel(url);

        // 不要になったURLを解放
        // URL.revokeObjectURL(url);

        // ダウンロードボタンを活性化する
        document.getElementById('downloadButton').disabled = false;

        // ボタンを有効化
        document.getElementById('apiForm').querySelector('button').disabled = false;
    })
    .catch(error => {
        var errorContainer = document.getElementById('responseContainer');
        errorContainer.innerText = 'エラーが発生しました: ' + error.message;
        // ダウンロードボタンを非活性化する
        document.getElementById('downloadButton').disabled = true;
        // ボタンを有効化
        document.getElementById('apiForm').querySelector('button').disabled = false;
        console.error('Error:', error);
    });
});
document.getElementById('downloadButton').addEventListener('click', function() {
// ダウンロード用のリンクを作成
var link = document.createElement('a');
link.href = url;
link.download = 'model.glb'; // ファイル名を指定（.glbや.gltfなど）
link.click();
});






//#################################
//########　マウス操作処理　########
//#################################

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

// マウスボタンが押されたときの処理
document.addEventListener('mousedown', function(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
});

// マウスボタンが離されたときの処理
document.addEventListener('mouseup', function() {
    mouseDown = false;
    lastMouseX = null;
    lastMouseY = null;
});

// マウスが移動したときの処理
document.addEventListener('mousemove', function(event) {
    if (!mouseDown) {
        return;
    }

    var deltaX = event.clientX - lastMouseX;
    var deltaY = event.clientY - lastMouseY;

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    // カメラの回転
    if (model) {
        model.rotation.x += deltaY * 0.01;
        model.rotation.y += deltaX * 0.01;
    }
});




