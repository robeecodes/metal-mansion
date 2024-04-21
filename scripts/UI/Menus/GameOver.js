class GameOver {
    constructor () {
        cursor();
    }
    draw() {
        background('black');
        fill('palegreen');
        textAlign('center', 'center');
        textFont(arcadeFont, 48 * cnv.scaleFactor);
        text('GAME OVER', cnv.canvas.width / 2, cnv.canvas.height / 2);

        if (kb.presses('r')) {
            SCENES.forEach(scene => {
                if (prevScene instanceof scene) {
                    currScene = new scene();
                }
            })
        }
    }
}