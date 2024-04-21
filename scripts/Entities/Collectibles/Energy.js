// Energy collectibles present in the level

class Energy {
    constructor(x, y) {
        this.sprite = new Sprite(x, y);

        this.sprite.scale = 0.5;

        this.sprite.addAnimation('idle', animationAtlas.energy.idle);

        this.sprite.changeAni('idle');

        // Energy doesn't move
        this.sprite.collider = 'static';

        // Energy overlaps player and all enemies.
        this.sprite.overlaps(player.sprite);

        for (const enemyGroup of Object.values(enemies)) {
            enemyGroup.forEach((enemy) => {
                this.sprite.overlaps(enemy.sprite);
            });
        }
    }
}