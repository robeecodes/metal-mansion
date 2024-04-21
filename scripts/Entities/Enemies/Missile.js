// Missile enemy which homes in on the player

class Missile extends Enemy {
    // Store the initial x and y position of the missile
    #initX;
    #initY;

    constructor(x, y, health, scale) {
        super(x, y, health, scale);

        this.#initX = x;
        this.#initY = y;

        this.sprite.addAnimation('idle', animationAtlas.missile.idle);

        this.sprite.changeAni('idle');
        this.sprite.anis.frameDelay = 8;

        // Missile flies, so it isn't affected by gravity
        this.sprite.collider = 'kinematic';
        this.sprite.overlaps(allSprites);

        this.sprite.diameter = 40 * scale;

        this._velocity = {
            max: 3,
            min: -3
        }
        this._acceleration = 0.5;

        this._power = 4;

        this._health = new Health(health, health, 5);
    }

    actions() {
        this.moveActions();
    }

    moveActions() {
        // Sprite faces the player
        this.sprite.mirror.x = player.sprite.x < this.sprite.position.x ? -1 : 1;

        // Sprite rotates towards player
        this.sprite.rotateTowards(
            player.sprite, 0.1, 0
        );

        // Only activate missile if player is within 8 horizontal and 3 vertical tiles
        let xDist = Math.abs(this.sprite.x - player.sprite.x);
        let yDist = Math.abs(this.sprite.y - player.sprite.y);
        if (xDist <= tileSize * 8 && yDist <= tileSize * 3) {
            this.sprite.moveTo(player.sprite.x, player.sprite.y, this._velocity.max);
            if (customOverlap(this.sprite, player.sprite)) {
                // Missile returns to initial position on impact
                this.sprite.x = this.#initX;
                this.sprite.y = this.#initY;
            }
        }
    }
}