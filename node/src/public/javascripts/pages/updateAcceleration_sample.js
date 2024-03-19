// updateAcceleration.js

// 加速度データの値を更新する関数
function updateAcceleration(data) {
  var { x, y, z } = data;
  
  //加速度データの数値表示
  document.getElementById('xValue').textContent = x;

  //3Dモデル制御
  modelAcceleration.x += x;
}