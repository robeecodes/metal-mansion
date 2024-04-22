// Base abstract player class, can be used to create multiple different player characters

class Player extends Character {
    // https://www.sohamkamani.com/javascript/enums/
    // Check if the player can jump
    #JUMP_STATE = Object.freeze({
        GROUNDED: Symbol('grounded'),
        ONE_JUMP: Symbol('one jump'),
        DOUBLE_JUMP: Symbol('double jump')
    });

    _superPowered;

    constructor(x, y) {
        super(x, y);

        // Player itself cannot be created
        if (this.constructor === Player) {
            throw new Error("Abstract classes cannot be instantiated");
        }

        // Initialise player on the ground
        this.jumpState = this.#JUMP_STATE.GROUNDED;

        // Player is not invincible at first
        this.invincible = false;

        this.energy = 0;

        this._superPowered = false;
    }

    // Call all the animations from this function in draw
    animations() {
            this.movementAnimations();
            this.shootAnimations();
    }

    //
    actions() {
            this.movementActions();
            this.shootActions();
            this.pickupEnergy();
    }

    die() {
        this.sprite.changeAni('die');
    }

    movementAnimations() {
        // Animations for player movement - detect when running, jumping and shooting
        if (this.sprite.ani.name !== 'idleShoot' && this.sprite.ani.name !== 'runShoot' && this.sprite.ani.name !== 'jumpShoot') {
            if (kb.pressing('left') && this.jumpState === this.#JUMP_STATE.GROUNDED) {
                if (this._superPowered) {
                    this.sprite.changeAni('superRun');
                } else {
                    this.sprite.changeAni('run');
                }
                this.sprite.mirror.x = true;
                if (!stepSFX.isPlaying()) {
                    stepSFX.play();
                }
            } else if (kb.pressing('right') && this.jumpState === this.#JUMP_STATE.GROUNDED) {
                if (this._superPowered) {
                    this.sprite.changeAni('superRun');
                } else {
                    this.sprite.changeAni('run');
                }
                this.sprite.mirror.x = false;
                if (!stepSFX.isPlaying()) {
                    stepSFX.play();
                }
            } else if (this.jumpState === this.#JUMP_STATE.GROUNDED) {
                if (this._superPowered) {
                    this.sprite.changeAni('superIdle');
                } else {
                    this.sprite.changeAni('idle');
                }
            }

            if (kb.presses(' ')) {
                if (this.jumpState !== this.#JUMP_STATE.DOUBLE_JUMP) {
                    if (this._superPowered) {
                        this.sprite.changeAni('superJump');
                    } else {
                        this.sprite.changeAni('jump');
                    }
                }
            }
        }
    }

    movementActions() {
        // Moves the player based on input: left, right, jump and stop
        if (kb.pressing('left')) {
            this.sprite.vel.x = Math.max(this.sprite.vel.x - this._acceleration, this._velocity.min);
        } else if (kb.pressing('right')) {
            this.sprite.vel.x = Math.min(this.sprite.vel.x + this._acceleration, this._velocity.max);
        } else if (this.jumpState === this.#JUMP_STATE.GROUNDED) {
            this.sprite.vel.x = 0;
        }

        if (kb.presses(' ')) {
            if (this.jumpState !== this.#JUMP_STATE.DOUBLE_JUMP) {
                this.sprite.vel.y = -4.5;
                jumpSFX.play();
            }
            // Change jump state to allow player to double-jump
            if (this.jumpState === this.#JUMP_STATE.GROUNDED) {
                this.jumpState = this.#JUMP_STATE.ONE_JUMP;
            } else if (this.jumpState === this.#JUMP_STATE.ONE_JUMP) {
                this.jumpState = this.#JUMP_STATE.DOUBLE_JUMP;
            }
        }
    }

    shootAnimations() {
        // Animations to play when player is shooting
        if (mouse.presses() || kb.presses('e') || kb.presses('f')) {
            if (this.jumpState === this.#JUMP_STATE.GROUNDED) {
                if (!kb.pressing('left') && !kb.pressing('right')) {
                    if (this._superPowered) {
                        this.sprite.changeAni(['superIdleShoot', 'superIdle']);
                    } else {
                        this.sprite.changeAni(['idleShoot', 'idle']);
                    }
                } else {
                    if (this._superPowered) {
                        this.sprite.changeAni(['superRunShoot', 'superRun']);
                    } else {
                        this.sprite.changeAni(['runShoot', 'run']);
                    }
                }
            } else {
                if (this._superPowered) {
                    this.sprite.changeAni(['superJumpShoot', 'superJump']);
                } else {
                    this.sprite.changeAni(['jumpShoot', 'jump']);
                }

            }
        }
    }

    shootActions() {
        throw new Error("shootActions() have not yet been created");
    }

    pickupEnergy() {
        // Increase energy when player picks up an energy pill
        energy.forEach((pill, i) => {
            if (customOverlap(this.sprite, pill.sprite)) {
                pickupSFX.play();
                this.energy++;
                pill.sprite.remove();
                energy.splice(i, 1);
            }
        });
    }

    collision() {
        this.platformCollision();

        // Check when player is on the ground
        if (this.sprite.collides(ground) || this.sprite.collides(platforms)) {
            this.jumpState = this.#JUMP_STATE.GROUNDED;
        }

        // Move player along conveyor belts
        if (this.sprite.colliding(conveyorL)) {
            this.sprite.bearing = -180;
            this.sprite.applyForce(17);
        }

        if (this.sprite.colliding(conveyorR)) {
            this.sprite.bearing = 0;
            this.sprite.applyForce(17);
        }

        // Player takes damage if shot by an enemy
        Projectile.projectiles.forEach(projectile => {
            if (customOverlap(this.sprite, projectile.sprite) && projectile.owner === "enemy" && !this.invincible) {
                projectile.sprite.remove();
                this._health.takeDamage(projectile.power);
                // Become invincible for 2 seconds
                this.iFrames();
            }
        });

        // Player slips on ice
        ice.forEach(i => {
            if (customOverlap(this.sprite, i)) {
                this.sprite.friction = 0;
                let direction = this.sprite.mirror.x ? -1 : 1;

                if (direction === -1) {
                    this.sprite.bearing = -180;
                } else {
                    this.sprite.bearing = 0;
                }

                this.sprite.applyForce(20);

                if (!this.invincible) {
                    hurtSFX.play();
                    this.health.takeDamage(6);
                    if (this.health.isAlive()) {
                        this.iFrames();
                    }
                }
            } else {
                this.sprite.friction = 0.5;
            }
        })

        // If player touches an enemy, take damage and become invincible for 1.5 seconds
        for (const enemyGroup of Object.values(enemies)) {
            enemyGroup.forEach((enemy) => {
                if (customOverlap(this.sprite, enemy.sprite)) {
                    if (!this.invincible && enemy.power > 0) {
                        hurtSFX.play();
                        this.health.takeDamage(enemy.power);
                        if (this.health.isAlive()) {
                            this.iFrames();
                        }
                    }
                    enemy.sprite.velocity.x = 0;
                    enemy.sprite.velocity.y = 0;
                }
            });
        }
    }

    // Makes character invincible for 1.5 seconds after being hit
    iFrames() {
        this.invincible = true;
        // Visually indicate invincibility
        this.sprite.opacity = 0.5;
            setTimeout(() => {
                this.invincible = false;
                this.sprite.opacity = 1;
            }, 1500);
    }

    becomeSuper() {
        throw new Error("becomeSuper() has not yet been created");
    }
}