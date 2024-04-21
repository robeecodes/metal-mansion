// Base character class

class Character {
// https://javascript.info/private-protected-properties-methods#protecting-wateramount
    // The maximum speed the character moves at
    _velocity;

    // How quickly the character accelerates
    _acceleration;

    // How much damage the character deals
    _power;

    // The character's health component
    _health;

    constructor(x, y) {
        if (this.constructor === Character) {
            throw new Error("Abstract classes cannot be instantiated");
        }

        // Create sprite
        this.sprite = new Sprite(x, y);

        this.sprite.layer = 4;

        this.sprite.bounciness = 0;
        this.sprite.rotationLock = true;

        this.hpBar = HpBar(this.sprite.x, this.sprite.y - 8 * this.sprite.hh / 4, 40, 5);
    }

    // Reference character's health component
    get health() {
        return this._health;
    }

    // Update character's health component
    set health(newHealth) {
        this._health = newHealth;
    }

    get power() {
        return this._power;
    }

    // Draw animations
    animations() {
        throw new Error("animations() not yet created");
    };

    // Draw actions
    actions() {
        throw new Error("actions() not yet created");
    };

    // Character collision
    collision() {
        throw new Error("collision() not yet created");
    }

    drawHP() {
        renderHP(this.hpBar, this.sprite.x, this.sprite.y - 8 * this.sprite.hh / 4, this);
    }

    platformCollision() {
        // Allows character to jump through platforms when underneath them
        platforms.forEach(platform => {
            if (this.sprite.y + this.sprite.hh > platform.y) {
                this.sprite.overlaps(platform);
            } else {
                // If player is above platform, player lands on platform
                this.sprite.collides(platform);
            }
        });
    }
}