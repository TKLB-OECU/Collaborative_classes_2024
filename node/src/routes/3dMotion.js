

var express = require('express');
var router = express.Router();
const axios = require('axios'); // Import axios module

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('pages/3dMotion', { title: '3Dモデル制御' });
  console.log("3Dモデル制御ページ_アクセス");
});


router.get('/getAccelerationData', async function (req, res, next) {
  console.log("3Dモデル制御ページ_加速度データ取得リクエスト受信");
  try {
    const url = req.query.url; // URLをクエリパラメータから取得
    console.log('[INFO] URL:', url)
    const accelerationData = await fetchAccelerationData(url + '/get?accX&accY&accZ'); // クエリパラメータから取得したURLを使用
    res.json(accelerationData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 加速度データを取得する関数
async function fetchAccelerationData(url) {
  console.log('[INFO] 加速度データを取得します');
  try {
    const response = await axios.get(url);
    const data = response.data;

    const accelerationX = parseFloat(data.buffer.accX.buffer[0]);
    const accelerationY = parseFloat(data.buffer.accY.buffer[0]);
    const accelerationZ = parseFloat(data.buffer.accZ.buffer[0]);

    console.log('[INFO] X軸加速度:', accelerationX);
    console.log('[INFO] Y軸加速度:', accelerationY);
    console.log('[INFO] Z軸加速度:', accelerationZ);

    return { x: accelerationX, y: accelerationY, z: accelerationZ };
  } catch (error) {
    console.error('[ERROR] データの取得に失敗しました:', error);
    throw error;
  }
}




module.exports = router;