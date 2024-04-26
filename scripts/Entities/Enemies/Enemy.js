// Abstract Enemy class
class Enemy extends Character {
    constructor(x, y, health, scale) {
        super(x, y);

        // You cannot create an Enemy, it needs to be a subclass
        if (this.constructor === Enemy) {
            throw new Error("Abstract classes cannot be instantiated");
        }

        // Scale the sprite
        this.sprite.scale = scale;

        // All enemies overlap the player
        this.sprite.overlaps(player.sprite);
    }

    collision() {
        this.platformCollision();

        // If shot by the player, the enemy will  take damage
        Projectile.projectiles.forEach(projectile => {
            if (customOverlap(this.sprite, projectile.sprite) && projectile.owner === "player") {
                // Projectile is removed
                projectile.sprite.remove();
                this._health.takeDamage(projectile.power);
            }
        });
    }
}