class MainMenu {
    #state;

    constructor() {
        textFont(commandFont);

        this.#state = 'main';

        bgm = menuBGM;

        bgm.loop();

        this.buttons = new Group();
        this.buttons.color = 'DeepSkyBlue';
        this.buttons.stroke = 'black';

        this.start = new this.buttons.Sprite(tileSize * 5 * cnv.scaleFactor, tileSize * 7 * cnv.scaleFactor, 100 * cnv.scaleFactor, 50 * cnv.scaleFactor, 's');
        this.start.text = 'Start';

        this.manual = new this.buttons.Sprite(tileSize * 10 * cnv.scaleFactor, tileSize * 7 * cnv.scaleFactor, 100 * cnv.scaleFactor, 50 * cnv.scaleFactor, 's');
        this.manual.text = 'How to Play';

        this.back = new this.buttons.Sprite(tileSize * 2 * cnv.scaleFactor, tileSize * 10.5 * cnv.scaleFactor, 100 * cnv.scaleFactor, 40 * cnv.scaleFactor, 's');
        this.back.text = 'Back';

    }

    draw() {
        mouse.cursor = 'default';

        switch (this.#state) {
            case 'main':
                this.drawMainButtons();
                break;
            case 'manual':
                this.drawManual();
                break;
        }

        if (this.buttons.mouse.hovering()) {
            mouse.cursor = 'pointer';
        } else {
            mouse.cursor = 'default';
        }

    }

    drawMainButtons() {
        background(mainMenuImg);

        this.start.opacity = 1;
        this.start.collider = 'static';
        this.manual.opacity = 1;
        this.manual.collider = 'static';

        this.start.x = tileSize * 5 * cnv.scaleFactor;
        this.start.y = tileSize * 7 * cnv.scaleFactor;
        this.start.width = 100 * cnv.scaleFactor;
        this.start.height = 50 * cnv.scaleFactor;
        this.start.textSize = 26 * cnv.scaleFactor;
        this.start.draw();

        if (this.start.mouse.pressing()) {
            clearWorld();
            currScene = new ChooseCharacter();
        }

        this.manual.x = tileSize * 10 * cnv.scaleFactor;
        this.manual.y = tileSize * 7 * cnv.scaleFactor;
        this.manual.width = 100 * cnv.scaleFactor;
        this.manual.height = 50 * cnv.scaleFactor;
        this.manual.textSize = 20 * cnv.scaleFactor;
        this.manual.draw();

        if (this.manual.mouse.pressing()) {
            this.#state = 'manual';
        }
    }

    drawManual() {
        background(manualImg);

        this.start.opacity = 0;
        this.start.collider = 'none';
        this.manual.opacity = 0;
        this.manual.collider = 'none';

        this.back.x = tileSize * 2 * cnv.scaleFactor;
        this.back.y = tileSize * 10.5 * cnv.scaleFactor;
        this.back.width = 100 * cnv.scaleFactor;
        this.back.height = 40 * cnv.scaleFactor;
        this.back.textSize = 26 * cnv.scaleFactor;
        this.back.draw();

        if (this.back.mouse.pressing()) {
            this.#state = 'main';
        }
    }
}