// updateAcceleration.js

// 加速度データの値を更新する関数
function updateAccelerationValues(data) {
  const { x, y, z } = data;
  document.getElementById('xValue').textContent = x;
  document.getElementById('yValue').textContent = y;
  document.getElementById('zValue').textContent = z;
}

export { updateAccelerationValues };