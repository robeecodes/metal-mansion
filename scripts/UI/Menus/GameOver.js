class GameOver {
    constructor () {
        cursor();

        this.buttons = new Group();
        this.buttons.color = 'paleGreen';
        this.buttons.stroke = 'black';

        this.retry = new this.buttons.Sprite(tileSize * 5 * cnv.scaleFactor, tileSize * 7 * cnv.scaleFactor, 100 * cnv.scaleFactor, 50 * cnv.scaleFactor, 's');
        this.retry.text = 'Retry';

        this.main = new this.buttons.Sprite(tileSize * 10 * cnv.scaleFactor, tileSize * 7 * cnv.scaleFactor, 100 * cnv.scaleFactor, 50 * cnv.scaleFactor, 's');
        this.main.text = 'Main Menu';
    }
    draw() {
        background('black');
        fill('palegreen');
        textAlign('center', 'center');
        textFont(arcadeFont, 48 * cnv.scaleFactor);
        text('GAME OVER', cnv.canvas.width / 2, tileSize * 3 * cnv.scaleFactor);


        textFont(commandFont, 26 * cnv.scaleFactor);
        this.retry.x = tileSize * 5 * cnv.scaleFactor;
        this.retry.y = tileSize * 7 * cnv.scaleFactor;
        this.retry.width = 100 * cnv.scaleFactor;
        this.retry.height = 50 * cnv.scaleFactor;
        this.retry.textSize = 26 * cnv.scaleFactor;
        this.retry.draw();

        if (this.retry.mouse.pressing()) {
            clearWorld();
            SCENES.forEach(scene => {
                if (prevScene instanceof scene) {
                    currScene = new scene();
                }
            });
        }

        this.main.x = tileSize * 10 * cnv.scaleFactor;
        this.main.y = tileSize * 7 * cnv.scaleFactor;
        this.main.width = 100 * cnv.scaleFactor;
        this.main.height = 50 * cnv.scaleFactor;
        this.main.textSize = 26 * cnv.scaleFactor;
        this.main.draw();

        if (this.main.mouse.pressing()) {
            clearWorld();
            currScene = new MainMenu();
        }

        if (this.buttons.mouse.hovering()) {
            mouse.cursor = 'pointer';
        } else {
            mouse.cursor = 'default';
        }
    }
}