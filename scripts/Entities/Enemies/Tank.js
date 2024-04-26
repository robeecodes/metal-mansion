// Tank enemy which moves from left to right and shoots player

class Tank extends Enemy {
    // Check if enemy is preparing to shoot
    #preparingShot;

    constructor(x, y, health, scale) {
        super(x, y, health, scale);

        // Add tank animations
        this.sprite.addAnimation('idle', animationAtlas.tank.idle);

        this.sprite.anis.frameDelay = 8;
        this.sprite.changeAni('idle');

        // Set collision for tank
        this.sprite.overlaps(allSprites);
        this.sprite.collides(wall);
        this.sprite.collides(ground);

        // Set diameter of sprite
        this.sprite.diameter = 40 * scale;

        // Set where sprite is drawn
        this.sprite.anis.offset.y = -10;

        // Set maximum and minimum velocity of tank
        this._velocity = {
            max: 2,
            min: -2
        }

        // Set acceleration of tank
        this._acceleration = 0.15;

        // Set power of tank
        this._power = 4;

        // Create health component for tank
        this._health = new Health(health, health, 3);
    }

    actions() {
        this.moveActions();
        this.shootActions();
    }

    drawHP() {
        renderHP(this.hpBar, this.sprite.x, this.sprite.y - 6 * this.sprite.hh / 4, this);
    }

    moveActions() {
        // The tank will move forward until it collides with a wall
        if (!this.sprite.mirror.x) {
            this.sprite.vel.x = Math.max(this.sprite.vel.x - this._acceleration, this._velocity.min);
        } else {
            this.sprite.vel.x = Math.min(this.sprite.vel.x + this._acceleration, this._velocity.max);
        }

        // When the tank collides with a wall, it turns around
        if (this.sprite.collides(wall)) {
            this.sprite.mirror.x = !this.sprite.mirror.x;
        }
    }

    shootActions() {
        // Bullet direction is based on which way sprite is facing
        let direction = this.sprite.mirror.x ? 1 : -1;


        // Only shoot at the player if they are in front of and nearby the tank (8 horizontal and 6 vertical tiles)
        if (
            ((player.sprite.x > this.sprite.x && direction === 1) || (player.sprite.x < this.sprite.x && direction === -1))
            && (this.sprite.y - player.sprite.y < 6 * tileSize)
            && Math.abs(this.sprite.x - player.sprite.x) < 8 * tileSize
        ) {
            if (!this.#preparingShot) {
                // Shoot every 500ms
                this.#preparingShot = setTimeout(() => {
                    shootSFX.play();
                    new Bullet(this.sprite.x + (this.sprite.hw * direction), this.sprite.y, direction, this._power, "enemy", this.sprite.scale);
                    clearTimeout(this.#preparingShot);
                    this.#preparingShot = null;
                }, 500);
            }
        }
    }
}