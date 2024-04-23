// Stores data about the current game canvas to assist with resizing and camera zoom

class GameCanvas {
    constructor() {
        this.aspectRatio = 4 / 3;
        this.position = {
            x: 0,
            y: 0
        }
        this.dimensions = {
            width: 480,
            height: 320,
            minWidth: 480,
            minHeight: 320,
            maxWidth: 1600,
            maxHeight: 1200
        }

        this.canvas = new Canvas(this.dimensions.width, this.dimensions.height, 'pixelated');
    }

    get scaleFactor() {
        return this.dimensions.width / this.dimensions.minWidth;
    }

    setDimensions(width) {
        this.dimensions.width = width;
        this.dimensions.height = 3 * width / 4;
    }

    buildGameCanvas() {

        this.sizeGameCanvas();

        this.canvas.resize(this.dimensions.width, this.dimensions.height);
    }

    sizeGameCanvas() {
        if (windowWidth / windowHeight > this.aspectRatio) {
            let gameHeight = Math.min(Math.max(windowHeight, this.dimensions.minHeight), this.dimensions.maxHeight);
            this.setDimensions(gameHeight * this.aspectRatio);
        } else {
            let gameWidth = Math.min(Math.max(windowWidth, this.dimensions.minWidth), this.dimensions.maxWidth);
            this.setDimensions(gameWidth);
        }
    }
}