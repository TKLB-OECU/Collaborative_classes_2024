function updateModelAcceleration(data) {
    const { x, y, z } = data;
    modelAcceleration.x += x*5;
    modelAcceleration.y += y*5;
    modelAcceleration.z += z*5;
}

export { updateModelAcceleration };