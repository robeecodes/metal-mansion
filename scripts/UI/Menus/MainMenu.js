class MainMenu {
    constructor() {
        textFont(commandFont);

        bgm = menuBGM;

        bgm.loop();

        this.buttons = new Group();
        this.buttons.color = 'DeepSkyBlue';
        this.buttons.stroke = 'black';

        this.start = new this.buttons.Sprite(tileSize * 5 * cnv.scaleFactor, tileSize * 7 * cnv.scaleFactor, 100 * cnv.scaleFactor, 50 * cnv.scaleFactor, 's');
        this.start.text = 'Start';

        this.manual = new this.buttons.Sprite(tileSize * 10 * cnv.scaleFactor, tileSize * 7 * cnv.scaleFactor, 100 * cnv.scaleFactor, 50 * cnv.scaleFactor, 's');
        this.manual.text = 'How to Play';

    }

    draw() {
        background(mainMenuImg);

        mouse.cursor = 'default';

        this.start.x = tileSize * 5 * cnv.scaleFactor;
        this.start.y = tileSize * 7 * cnv.scaleFactor;
        this.start.width = 100 * cnv.scaleFactor;
        this.start.height = 50 * cnv.scaleFactor;
        this.start.textSize = 26 * cnv.scaleFactor;
        this.start.draw();

        if (this.start.mouse.pressing()) {
            bgm.stop();
            clearWorld();
            currScene = new KaoriLevel();
        }

        this.manual.x = tileSize * 10 * cnv.scaleFactor;
        this.manual.y = tileSize * 7 * cnv.scaleFactor;
        this.manual.width = 100 * cnv.scaleFactor;
        this.manual.height = 50 * cnv.scaleFactor;
        this.manual.textSize = 20 * cnv.scaleFactor;
        this.manual.draw();

        if (this.buttons.mouse.hovering()) {
            mouse.cursor = 'pointer';
        } else {
            mouse.cursor = 'default';
        }

    }
}