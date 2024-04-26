// Kaori character option - she's speedy and has a powerful gun, but also takes decent damage

class Kaori extends Player {
    constructor(x, y) {
        super(x, y);

        // Configure Kaori animations
        this.sprite.addAnimation('idle', animationAtlas.kaori.idle);
        this.sprite.addAnimation('idleShoot', animationAtlas.kaori.idleShoot);
        this.sprite.addAnimation('run', animationAtlas.kaori.run);
        this.sprite.addAnimation('runShoot', animationAtlas.kaori.runShoot);
        this.sprite.addAnimation('jump', animationAtlas.kaori.jump);
        this.sprite.addAnimation('jumpShoot', animationAtlas.kaori.jumpShoot);
        this.sprite.addAnimation('die', animationAtlas.kaori.die);
        this.sprite.addAnimation('superIdle', animationAtlas.kaori.superIdle);
        this.sprite.addAnimation('superIdleShoot', animationAtlas.kaori.superIdleShoot);
        this.sprite.addAnimation('superRun', animationAtlas.kaori.superRun);
        this.sprite.addAnimation('superRunShoot', animationAtlas.kaori.superRunShoot);
        this.sprite.addAnimation('superJump', animationAtlas.kaori.superJump);
        this.sprite.addAnimation('superJumpShoot', animationAtlas.kaori.superJumpShoot);

        this.sprite.diameter = 40;

        this.sprite.anis.offset.y = -10;
        this.sprite.anis.frameDelay = 8;

        this.sprite.animations.jump.noLoop();
        this.sprite.animations.idleShoot.frameDelay = 4;
        this.sprite.animations.jumpShoot.frameDelay = 4;
        this.sprite.animations.die.frameDelay = 60;
        this.sprite.animations.superJump.noLoop();
        this.sprite.animations.superIdleShoot.frameDelay = 4;
        this.sprite.animations.superJumpShoot.frameDelay = 4;

        this.sprite.changeAni('idle');

        // Kaori max and min velocity
        this._velocity = {
            max: 5,
            min: -5
        }

        // Kaori acceleration
        this._acceleration = 0.25;

        // Kaori power
        this._power = 5;

        // Kaori health component
        this._health = new Health(100, 100, 3);
    }

    shootActions() {
        // Kaori can shoot in the direction she's facing when you press e, f or click
        if (mouse.presses() || kb.presses('e') || kb.presses('f')) {
            shootSFX.play();

            // Determine direction of bullets
            let direction = this.sprite.mirror.x ? -1 : 1;

            new Bullet(this.sprite.x + (this.sprite.hw * direction), this.sprite.y, direction, this._power, "player", 1);

            // Shoot two additional bullets if super is active
            if (this._superPowered) {
                new Bullet(this.sprite.x + (this.sprite.hw * direction), this.sprite.y - 10, direction, this._power, "player", 1);
                new Bullet(this.sprite.x + (this.sprite.hw * direction), this.sprite.y + 10, direction, this._power, "player", 1);
            }
        }
    }

    // Character gains additional abilities for energy * seconds
    becomeSuper() {
        this._superPowered = setTimeout(() => {
            clearTimeout(this._superPowered);
            this._superPowered = null;
        }, this.energy * 1000);
    }
}