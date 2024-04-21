// Cannon Enemy used to spawn additional enemies
class Cannon extends Enemy {
    constructor(x, y, health, scale, rotation, spawnType) {
        super(x, y, health, scale);

        // Direction the cannon is facing
        this.sprite.rotation = rotation;

        // String dictating which enemy to spawn
        this.spawnType = spawnType;

        this.sprite.addAnimation('idle', animationAtlas.cannon.idle);
        this.sprite.addAnimation('shoot', animationAtlas.cannon.shoot);

        this.sprite.changeAni('idle');

        this.sprite.anis.frameDelay = 8;

        // Cannon itself doesn't damage the player
        this._power = 0;

        // Cannon doesn't move
        this.sprite.collider = 'static';
        this.sprite.overlaps(allSprites);

        this.sprite.width = 52 * scale;
        this.sprite.height = 32 * scale;

        this._health = new Health(health, health, 5);

        // Check if cannon is currently spawning enemy
        this.spawning = null;
    }

    actions() {
        // Cannon has no constant actions like other enemies
    }

    // Spawn enemy based on spawnType
    spawnEnemy() {
        this.sprite.changeAni(['idle', 'shoot']);
        switch (this.spawnType) {
            case "ufo":
                return new UFO(this.sprite.x + this.sprite.hw, this.sprite.y, 100, .75);
            case "missile":
                return new Missile(this.sprite.x, this.sprite.y, 100, .75);
            case "tank":
                return new Tank(this.sprite.x, this.sprite.y, 100, .5);
        }
    }
}