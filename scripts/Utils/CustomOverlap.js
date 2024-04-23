// Detect if two sprites are overlapping
function customOverlap(obj, other) {
    let d = dist(obj.x, obj.y, other.x, other.y);

    return d <= obj.hw + other.hw;
}