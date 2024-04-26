// Fireball projectile - a slow, large projectile

class Fireball extends Projectile {
    constructor(x, y, direction, power, owner, scale) {
        super(x, y, direction, power, owner);

        // Create fireball sprite
        this.sprite = new Sprite(x, y, 10);
        this.sprite.scale = scale;
        this.sprite.color = 'red';
        this.sprite.life = 120;
        this.sprite.overlaps(allSprites);

        // Fireball speed
        this._speed = 5;

        // Add fireball to projectiles array
        Projectile.projectiles.push(this);
    }
}