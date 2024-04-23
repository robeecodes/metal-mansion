function HpBar(x, y, width, height) {
    // Create an hp bar: two bars overlayed on top of each other
    let hpBar = new Group();
    hpBar.collider = 'none';
    hpBar.stroke = 'black';

    // Create the background
    new hpBar.Sprite(x, y, width, height);

    // Create the foreground
    new hpBar.Sprite(x, y, width, height);

    // Colour the background
    hpBar[0].color = 'black';

    // Set the x-offset and colour the foreground
    hpBar[1].xOff = 0;
    hpBar[1].color = 'green';

    return hpBar;
}

// Render an hp bar in a given location
function renderHP(hpBar, x, y, entity) {
    // Position of the hp bar background
    hpBar[0].x = x;
    hpBar[0].y = y;

    // Position of the hp bar foreground
    hpBar[1].x = x - hpBar[1].xOff;
    hpBar[1].y = y;

    // Convert the entity's current health to a value relative to the hp bar width
    hpBar[1].width = map(
        entity.health.currentHealth,
        0, entity.health.maxHealth,
        0, hpBar[0].width
    );

    // Calculate the x offset of the foreground bar so it aligns left with the black background bar
    hpBar[1].xOff = (hpBar[0].width / 2) - (hpBar[1].width / 2);

    // Colour hp bar depending on amount of damage taken
    if (hpBar[1].width <= hpBar[0].width / 4) {
        hpBar[1].color = 'red';
    } else if (hpBar[1].width <= hpBar[0].width / 2) {
        hpBar[1].color = 'yellow';
    } else {
        hpBar[1].color = 'green';
    }
}