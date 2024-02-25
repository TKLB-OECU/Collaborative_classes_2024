import * as THREE from '/node_modules/three/build/three.module.min.js';

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

// カメラ
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 2;

// レンダラー
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('myCanvas')
});
renderer.setSize(sizes.width, sizes.height);

// 光源を作成
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
// カメラと同じ位置に光源を配置
directionalLight.position.copy(camera.position);
// カメラの方向を取得して光源の方向に設定
directionalLight.target.position.copy(camera.getWorldDirection(new THREE.Vector3()).negate());
// シーンに追加
scene.add(directionalLight);

function loadModel(file) {
    const loader = new GLTFLoader();
    loader.load(
        file,
        function (gltf) {
            const model = gltf.scene;
            scene.add(model);

            // モデルのサイズを取得
            const bbox = new THREE.Box3().setFromObject(model);
            const modelSize = bbox.getSize(new THREE.Vector3());

            // カメラの位置をモデルのサイズに応じて調整
            const maxModelSize = Math.max(modelSize.x, modelSize.y, modelSize.z);
            const distance = maxModelSize * 2; // 2倍のサイズで調整（適宜調整可能）

            camera.position.z = distance;
        },
        undefined,
        function (error) {
            console.error('Failed to load GLTF model', error);
        }
    );
}

// ファイルの選択時にモデルを読み込むイベントリスナーを追加
document.getElementById('modelFile').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        loadModel(URL.createObjectURL(file), scene, camera);
    }
});


// アニメーション関数
function animate() {
    requestAnimationFrame(animate);

    // モデルを回転させる
    if (scene.children.length > 1) {
        const model = scene.children[1]; // シーンに追加されたモデルを取得（カメラ以外の最初のオブジェクト）

        // Y軸を中心に回転させる
        model.rotation.y += 0.01; // 例として毎フレームごとに0.01ラジアン回転するよう設定

        // X軸を中心に回転させる
        model.rotation.x += 0.01; // 例として毎フレームごとに0.01ラジアン回転するよう設定
    }

    // レンダリング
    renderer.render(scene, camera);
}

// 初回アニメーション開始
animate();
