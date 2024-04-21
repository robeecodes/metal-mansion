// Bullet projectile - a simple gray sprite

class Bullet extends Projectile {
    constructor(x, y, direction, power, owner, scale) {
        super(x, y, direction, power, owner);

        this.sprite = new Sprite(x, y, 5);
        this.sprite.scale = scale;
        this.sprite.color = 'gray';
        this.sprite.life = 60;
        this.sprite.overlaps(allSprites);

        this._speed = 10;

        Projectile.projectiles.push(this);
    }
}