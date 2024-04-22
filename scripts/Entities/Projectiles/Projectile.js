// Base class for any projectiles

class Projectile {
    static projectiles = [];

    // Who shot the projectile
    #owner;
    // Direction to send the projectile
    #direction;
    // How strong the projectile is
    #power;

    // Speed of the projectile
    _speed;

    sprite;

    constructor(x, y, direction, power, owner) {
        if (this.constructor === Projectile) {
            throw new Error("Abstract classes cannot be instantiated");
        }

        this.#direction = direction;

        this.#owner = owner;
        this.#power = power;
    }

    // Access the owner of the projectile
    get owner() {
        return this.#owner;
    }


    // Access the power of the projectile
    get power() {
        return this.#power;
    }

    fire() {
        // Fires projectile in given direction
        this.sprite.vel.x = this.#direction * this._speed;
        // Y velocity prevents sprite from falling
        this.sprite.vel.y = -0.25;


        // Remove sprite if it hits wall or floor
        if (this.sprite.overlaps(wall) || this.sprite.overlaps(ground)) {
            this.sprite.remove();
        }

        if (this instanceof Fireball) {
            ice.forEach(i => {
                if (this.sprite.overlaps(i)) {
                    i.remove();
                }
            })
        }

        if (this.sprite.removed) {
            Projectile.projectiles = Projectile.projectiles.filter((projectile) => projectile !== this);
        }
    }
}