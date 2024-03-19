// updateAcceleration.js

// 加速度データの値を更新する関数
window.updateAcceleration = function updateAcceleration(data){
  var { x, y, z } = data;
  document.getElementById('xValue').textContent = x;
  document.getElementById('yValue').textContent = y;
  document.getElementById('zValue').textContent = z;
  window.changeSize(z);
  modelAcceleration.x = x;
  modelAcceleration.y = y;
  modelAcceleration.z = z;
}