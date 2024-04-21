// UFO enemy follows player, but cannot fly

class UFO extends Enemy {
    constructor(x, y, health, scale) {
        super(x, y, health, scale);

        this.sprite.addAnimation('idle', animationAtlas.UFO.idle);

        this.sprite.anis.frameDelay = 8;
        this.sprite.changeAni('idle');

        this.sprite.anis.offset.y = -10;

        this.sprite.diameter = 52 * scale;

        this._velocity = {
            max: 3,
            min: -3
        }
        this._acceleration = 0.15;

        this._power = 2;

        this._health = new Health(health, health, 10);
    }

    actions() {
        this.moveActions();
    }

    moveActions() {

        // Only activate ufo if player is nearby (8 horizontal tiles and 5 vertical tiles)
        let xDist = Math.abs(this.sprite.x - player.sprite.x);
        let yDist = Math.abs(this.sprite.y - player.sprite.y);
        if (xDist <= tileSize * 8 && yDist <= tileSize * 5) {

            // Determine if UFO moves left or right
            let direction = player.sprite.x < this.sprite.x ? -1 : 1;

            // Move UFO towards player
            if (direction === -1) {
                this.sprite.vel.x = Math.max(this.sprite.vel.x - this._acceleration, this._velocity.min);
            } else {
                this.sprite.vel.x = Math.min(this.sprite.vel.x + this._acceleration, this._velocity.max);
            }
        } else {
            this.sprite.vel.x = 0;
        }
    }
}