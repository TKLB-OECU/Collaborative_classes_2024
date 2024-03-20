// 加速度データの値を更新する関数
window.updateAcceleration = function updateAcceleration(data){
  var { x, y, z } = data;
  
  //加速度データの数値表示
  document.getElementById('xValue').textContent = x;
  document.getElementById('yValue').textContent = y;
  document.getElementById('zValue').textContent = z;
  modelAcceleration.x = x;
  modelAcceleration.y = y;
  modelAcceleration.z = z;
  //テスト
  //window.changeSize(z);
}