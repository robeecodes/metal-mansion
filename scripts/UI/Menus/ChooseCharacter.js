class ChooseCharacter {
    constructor() {
        this.buttons = new Group();
        this.buttons.color = 'paleGreen';
        this.buttons.stroke = 'black';

        this.kaori = new this.buttons.Sprite(149 * cnv.scaleFactor, tileSize * 10 * cnv.scaleFactor, 110 * cnv.scaleFactor, 50 * cnv.scaleFactor, 's')
        this.kaori.text = 'Play Kaori!';

        this.ren = new this.buttons.Sprite(330 * cnv.scaleFactor, tileSize * 10 * cnv.scaleFactor, 110 * cnv.scaleFactor, 50 * cnv.scaleFactor, 's');
        this.ren.text = 'Play Ren!';
    }

    draw() {
        background(chooseCharacterImg);

        this.kaori.x = 149 * cnv.scaleFactor;
        this.kaori.y = tileSize * 10 * cnv.scaleFactor;
        this.kaori.width = 110 * cnv.scaleFactor;
        this.kaori.height = 50 * cnv.scaleFactor;
        this.kaori.textSize = 26 * cnv.scaleFactor;
        this.kaori.draw();

        if (this.kaori.mouse.pressing()) {
            bgm.stop();
            clearWorld();
            currScene = new KaoriLevel();
        }

        this.ren.x = 330 * cnv.scaleFactor;
        this.ren.y = tileSize * 10 * cnv.scaleFactor;
        this.ren.width = 110 * cnv.scaleFactor;
        this.ren.height = 50 * cnv.scaleFactor;
        this.ren.textSize = 26 * cnv.scaleFactor;
        this.ren.draw();

        if (this.ren.mouse.pressing()) {
            bgm.stop();
            clearWorld();
            currScene = new RenLevel();
        }

        if (this.buttons.mouse.hovering()) {
            mouse.cursor = 'pointer';
        } else {
            mouse.cursor = 'default';
        }
    }
}