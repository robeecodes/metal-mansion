// Detect if two sprites are overlapping - alternative to p5.play overlapping() function
function customOverlap(obj, other) {
    let d = dist(obj.x, obj.y, other.x, other.y);

    return d <= obj.hw + other.hw;
}