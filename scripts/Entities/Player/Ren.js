// Ren character option - he's fairly slow and not a heavy-hitter, but also takes less damage in turn

class Ren extends Player {
    constructor(x, y) {
        super(x, y);

        // Configure Ren animations
        this.sprite.addAnimation('idle', animationAtlas.ren.idle);
        this.sprite.addAnimation('idleShoot', animationAtlas.ren.idleShoot);
        this.sprite.addAnimation('run', animationAtlas.ren.run);
        this.sprite.addAnimation('runShoot', animationAtlas.ren.runShoot);
        this.sprite.addAnimation('jump', animationAtlas.ren.jump);
        this.sprite.addAnimation('jumpShoot', animationAtlas.ren.jumpShoot);
        this.sprite.addAnimation('die', animationAtlas.ren.die);
        this.sprite.addAnimation('superIdle', animationAtlas.ren.superIdle);
        this.sprite.addAnimation('superIdleShoot', animationAtlas.ren.superIdleShoot);
        this.sprite.addAnimation('superRun', animationAtlas.ren.superRun);
        this.sprite.addAnimation('superRunShoot', animationAtlas.ren.superRunShoot);
        this.sprite.addAnimation('superJump', animationAtlas.ren.superJump);
        this.sprite.addAnimation('superJumpShoot', animationAtlas.ren.superJumpShoot);

        this.sprite.diameter = 40;

        this.sprite.anis.offset.y = -10;
        this.sprite.anis.frameDelay = 8;

        this.sprite.animations.idle.frameDelay = 16;
        this.sprite.animations.jump.noLoop();
        this.sprite.animations.idleShoot.frameDelay = 4;
        this.sprite.animations.jumpShoot.frameDelay = 4;
        this.sprite.animations.die.frameDelay = 60;
        this.sprite.animations.superIdle.frameDelay = 16;
        this.sprite.animations.superJump.noLoop();
        this.sprite.animations.superIdleShoot.frameDelay = 4;
        this.sprite.animations.superJumpShoot.frameDelay = 4;

        this.sprite.changeAni('idle');

        this._velocity = {
            max: 3.5,
            min: -3.5
        }
        this._acceleration = 0.2;

        this._power = 3;

        this._health = new Health(100, 100, 1.5);
    }

    shootActions() {
        // Ren casts fireballs in the direction he's facing when you press e, f or click
        if (mouse.presses() || kb.presses('e') || kb.presses('f')) {
            fireSFX.play();

            let direction = this.sprite.mirror.x ? -1 : 1;

            new Fireball(this.sprite.x + (this.sprite.hw * direction), this.sprite.y, direction, this._power, "player", 1);

        }
    }

    // Ren becomes invincible for energy * seconds
    becomeSuper() {
        this.invincible = true;
        this._superPowered = setTimeout(() => {
            this.invincible = false;
            clearTimeout(this._superPowered);
            this._superPowered = null;
        }, this.energy * 1000);
    }
}