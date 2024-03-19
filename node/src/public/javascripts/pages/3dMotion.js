
//###################################
//########　3Dモデル表示処理　########
//##################################


// Three.js シーンやモデルを管理するオブジェクト
const sceneManager = {
  renderer: null,
  scene: null,
  camera: null,
  model: null,
};

// モデルの加速度を管理するオブジェクト
window.modelAcceleration = {
  x: 0,
  y: 0,
  z: 0,
};

//モデルサイズ格納するグローバル変数
window.scale = 200
window.changeSize = function changeSize(x) {
  var tmp_size = window.scale += x;  
  console.log(tmp_size);
  if (tmp_size < 50) {
    window.scale = 50;
  }
  else if(tmp_size > 500) {
    window.scale = 500;
  }
  else {
    window.scale = tmp_size;
  }
}

// キャンバスサイズ
const sizes = {
  width: document.body.clientWidth,
  height: window.innerHeight
}

// Three.js の初期化を行う関数
function initializeThreeJS() {
  // レンダラーを作成
  sceneManager.renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#CanvasArea')
  });

  // シーンを作成
  sceneManager.scene = new THREE.Scene();

  // カメラを作成
  sceneManager.camera = new THREE.PerspectiveCamera(45, document.body.clientWidth / window.innerHeight, 1, 3000);

  // 平行光源を作成
  const light = new THREE.DirectionalLight(0xFFFFFF, 1.5);
  light.position.set(-100, 0, 1000); // 光源の位置を設定
  light.target.position.set(0, 0, 0); // 光源のターゲットを設定
  sceneManager.scene.add(light);
  sceneManager.scene.add(light.target); // ターゲットをシーンに追加

  // グリッド状の平面を作成
  const gridGeometry = new THREE.PlaneGeometry(4000, 4000, 20, 20);
  const gridMaterial = new THREE.MeshBasicMaterial({ color: 0x666666, wireframe: true });
  const grid = new THREE.Mesh(gridGeometry, gridMaterial);
  grid.rotation.x = -Math.PI / 2; // X軸周りに90度回転して水平に配置
  grid.position.y = -300; // 箱の下に配置
  sceneManager.scene.add(grid);
}



// Three.js のリサイズ関連の処理をまとめた関数
function handleResize() {

  // ウィンドウサイズを取得
  sizes.width = document.body.clientWidth;
  sizes.height = window.innerHeight;

  // レンダラーのサイズを設定
  function setRendererSize() {
    sceneManager.renderer.setSize(sizes.width, sizes.height);
    sceneManager.renderer.setPixelRatio(window.devicePixelRatio);
  }
  setRendererSize(); // 初期設定

  // カメラの位置を設定
  function setCameraPosition() {
    sceneManager.camera.aspect = document.body.clientWidth / window.innerHeight;
    sceneManager.camera.updateProjectionMatrix();
    sceneManager.camera.position.set(0, 0, 1000);
    sceneManager.camera.lookAt(sceneManager.scene.position);
  }
  setCameraPosition(); // 初期設定
}


// モデルのロード関数
window.loadModel = function loadModel(contents) {
  const loader = new THREE.GLTFLoader();
  const dracoLoader = new THREE.DRACOLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.load(contents, function (gltf) {
    if (sceneManager.model) {
      sceneManager.scene.remove(sceneManager.model);
    }
    sceneManager.model = gltf.scene;

    // モデルのサイズを取得
    const box = new THREE.Box3().setFromObject(sceneManager.model);
    const size = new THREE.Vector3();
    box.getSize(size);

    // 適切な拡大率を計算
    const maxSize = Math.max(size.x, size.y, size.z);
    console.log(Math.max(size.x, size.y, size.z))
    //window.scale = 300 / maxSize; // 200 は適当な基準サイズ

    // モデルに拡大率を適用
    sceneManager.model.scale.set(window.scale, window.scale, window.scale);

    sceneManager.scene.add(sceneManager.model);
    animate(); // モデルが読み込まれた後にアニメーションを開始
  }, undefined, function (error) {
    console.error("モデルの読み込み中にエラーが発生しました。", error);
  });
}


// アニメーションループ
function animate() {
  requestAnimationFrame(animate);

  // 回転と移動
  if (sceneManager.model) {
    sceneManager.model.rotation.x += modelAcceleration.x * 0.001;
    sceneManager.model.rotation.y += modelAcceleration.y * 0.001;
    sceneManager.model.rotation.z += modelAcceleration.z * 0.001;
  }

  // 描画
  sceneManager.renderer.render(sceneManager.scene, sceneManager.camera);
}



// 初期化関数
function initialize() {
  initializeThreeJS(); // Three.js の初期化
  handleResize(); // リサイズ関連の処理

  // ファイル選択用のボタン
  document.getElementById('selectModelButton').addEventListener('click', function () {
    document.getElementById('modelFileInput').click();
  });

  // ファイルの読み込みとモデルのロード
  document.getElementById('modelFileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      window.contents = event.target.result;
      console.log("ファイルが正常に読み込まれました。");
      console.log("ファイル内容:", contents); // ファイルの内容をコンソールに出力

      // モデルをロード
      loadModel(contents);

    };
    reader.readAsDataURL(file);
  });

  // ウィンドウのリサイズイベントにリスナーを追加
  window.addEventListener('resize', handleResize);

  // アニメーションを開始
  animate();
}





//#################################
//########　マウス操作処理　########
//#################################

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

// マウスボタンが押されたときの処理
document.addEventListener('mousedown', function (event) {
  mouseDown = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
});

// マウスボタンが離されたときの処理
document.addEventListener('mouseup', function () {
  mouseDown = false;
  lastMouseX = null;
  lastMouseY = null;
});

// マウスが移動したときの処理
document.addEventListener('mousemove', function (event) {
  if (!mouseDown) {
    return;
  }

  var deltaX = event.clientX - lastMouseX;
  var deltaY = event.clientY - lastMouseY;

  lastMouseX = event.clientX;
  lastMouseY = event.clientY;

  // カメラの回転
  if (sceneManager.model) {
    sceneManager.model.rotation.x += deltaY * 0.01;
    sceneManager.model.rotation.y += deltaX * 0.01;
  }
  // 描画
  sceneManager.renderer.render(sceneManager.scene, sceneManager.camera);
});








//###################################
//########　Phyphox通信処理　########
//##################################

// 初期化関数を実行
window.addEventListener('DOMContentLoaded', initialize);


// 定期的なリクエスト送信を管理するための変数
let intervalId;

// ボタン要素の取得
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const urlInput = document.getElementById('urlInput');

// リクエスト間隔（ミリ秒）
const requestInterval = 1000;

// updateAcceleration 関数をインポート
import { updateAcceleration } from './updateAcceleration.js';

//updateAccelerationValuesをグローバルスコープに
window.updateAcceleration = updateAcceleration;

// リクエストを送信する関数
async function sendRequest(url) {
  try {
    const response = await fetch(`/3dMotion/getAccelerationData?url=${url}`);
    const accelerationData = await response.json();
    sceneManager.model.scale.set(window.scale, window.scale, window.scale);
    document.getElementById('sizeValue').textContent = window.scale;
    window.updateAcceleration(accelerationData);
  } catch (error) {
    console.error('エラー:', error);
  }
}



// 初期状態では停止ボタンは無効にする
stopButton.disabled = true;

// 開始ボタンがクリックされたときの処理
function startRequest() {
  const url = urlInput.value;
  intervalId = setInterval(sendRequest, requestInterval, url);
  startButton.disabled = true; // 開始ボタンを無効にする
  stopButton.disabled = false; // 停止ボタンを有効にする
}

// 停止ボタンがクリックされたときの処理
function stopRequest() {
  clearInterval(intervalId);
  modelAcceleration.x = 0;
  modelAcceleration.y = 0;
  modelAcceleration.z = 0;
  document.getElementById('xValue').textContent = "未取得";
  document.getElementById('yValue').textContent = "未取得";
  document.getElementById('zValue').textContent = "未取得";
  document.getElementById('sizeValue').textContent = "未取得";
  startButton.disabled = false; // 開始ボタンを有効にする
  stopButton.disabled = true; // 停止ボタンを無効にする
}

// 開始ボタンのクリックイベントリスナーを追加
startButton.addEventListener('click', startRequest);

// 停止ボタンのクリックイベントリスナーを追加
stopButton.addEventListener('click', stopRequest);



