// Level when player is a Kaori

class KaoriLevel {
    // Check if player has beaten all enemies in the trap area
    #clearedTrap;
    // Check if player has beaten all enemies in the danger area with the conveyors
    #clearedDangerRoom;

    #levelComplete;

    constructor() {
        player = new Kaori(tileSize, 160);

        playerInfo = {
            name: 'Kaori',
            energy: 0
        }

        // Enemies stored in arrays relevant to their area
        enemies = {
            basicEnemies: [],
            trapEnemies: [],
            conveyorUFOs: [],
            conveyorMissiles: [],
            conveyorCannons: []
        }

        energy = [];

        this.createEnemies();

        this.createMap();

        this.#clearedTrap = false;
        this.#clearedDangerRoom = false;

        this.exit = new Sprite(23.5 * tileSize, 26.5 * tileSize, 'n');
        this.exit.addAnimation('idle', animationAtlas.exitDoor.idle);
        this.exit.layer = 1;

        // HurtSFX pitch raised
        hurtSFX.rate(1.75);

        bgm = levelBGM;

        bgm.loop();

        noCursor();
    }

    draw() {
        background(color(103, 110, 158));

        this.drawCamera();

        if (player.health.isAlive()) {
            // Draws the player
            managePlayer();

            if (!this.#levelComplete) {
                this.conveyorSpawns();

                // Draws the enemies
                manageEnemies();

                manageProjectiles();

                // If all trap enemies are gone, teleport out of the trap
                if (enemies.trapEnemies.length < 1 && !this.#clearedTrap) {
                    this.#clearedTrap = setTimeout(() => {
                        teleportSFX.play();
                        player.sprite.x = 31 * tileSize;
                        player.sprite.y = 17 * tileSize;
                        clearTimeout(this.#clearedTrap);
                        this.#clearedTrap = true;
                    }, 1000);
                }

                if (enemies.conveyorUFOs.length < 1 && enemies.conveyorMissiles.length < 1 && enemies.conveyorCannons.length < 1 && !this.#clearedDangerRoom) {
                    tempWall.remove();
                    this.#clearedDangerRoom = true;
                }

                // Beat the level
                if (customOverlap(player.sprite, this.exit)) {
                    player.sprite.vel.x = 0;
                    player.sprite.vel.y = 1.5;
                    playerInfo.energy = player.energy;
                    bgm.stop();
                    if (!winBGM.isPlaying()) {
                        winBGM.play();
                    }
                    if (!this.#levelComplete) {
                        this.#levelComplete = setTimeout(() => {
                            teleportSFX.play();
                            clearWorld();
                            currScene = new BossLevel();
                        }, 7000);
                    }
                }
            }

        } else {
            playerDeath();
        }
    }

    createEnemies() {
        enemies.basicEnemies.push(new UFO(14 * tileSize, 5 * tileSize, 100, 0.75));
        enemies.basicEnemies.push(new UFO(28 * tileSize, 5 * tileSize, 100, 0.75));
        enemies.basicEnemies.push(new UFO(24 * tileSize, 15 * tileSize, 100, 0.75));
        enemies.basicEnemies.push(new UFO(22 * tileSize, 15 * tileSize, 100, 0.75));
        enemies.basicEnemies.push(new UFO(20 * tileSize, 15 * tileSize, 100, 0.75));
        enemies.basicEnemies.push(new Missile(39 * tileSize, 3 * tileSize, 100, 0.75));
        enemies.basicEnemies.push(new Missile(14 * tileSize, 14 * tileSize, 100, 0.75));

        enemies.trapEnemies.push(new Missile(35 * tileSize, 25 * tileSize, 250, 0.75));
        enemies.trapEnemies.push(new Missile(43 * tileSize, 25 * tileSize, 250, 0.75));
        enemies.trapEnemies.push(new Tank(39 * tileSize, 27 * tileSize, 250, 2));

        enemies.conveyorUFOs.push(new UFO(3 * tileSize, 25 * tileSize, 100, 0.75));
        enemies.conveyorMissiles.push(new Missile(1 * tileSize, 23 * tileSize, 100, 0.75));
        enemies.conveyorCannons.push(new Cannon(9 * tileSize, 26 * tileSize, 100, 0.75, -90, "missile"));
        enemies.conveyorCannons.push(new Cannon(0, 26 * tileSize, 100, 0.75, 0, "ufo"));
    }

    createMap() {
        // Tiles for backgrounds
        new Tiles(
            [
                '..!!!!!!!!!!......................................',
                '..!!!!!!!!!!......................................',
                '..!!!!!!!!!!........................!!!!!!!!!!!!..',
                '..!!!!!!!!!!........................!!!!!!!!!!!!..',
                '..!!!!!!!!!!........................!!!!!!!!!!!!..',
                '..!!!!!!!!!!........................!!!!!!!!!!!!..',
                '....................................!!!!!!!!!!!!..',
                '....................................!!!!!!!!!!!!..',
            ],
            -64, 672, 32, 32
        )


        // Tiles for walls, floors and platforms
        new Tiles(
            [
                'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
                'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
                'ww..............................................ww',
                'ww..............................................ww',
                'ww.........................................p....ww',
                'ww......pppppp..................................ww',
                'ww....................................pp........ww',
                'wwggggggggggggggg............pp.................ww',
                'wwgggggggggggggggggggg.............g............ww',
                'ww..............ggggggggggg........w............ww',
                'ww...................ggggggggggg...w............ww',
                'ww.............................w...w............ww',
                'ww.............................w...w............ww',
                'ww.............................w...w............ww',
                'ww.............................w...w............ww',
                'ww.............................w...w............ww',
                'ww...........pppppp............w...w............ww',
                'ww...................pppppp....w...w............ww',
                'wwgggg..gggggg.....................w............ww',
                'wwwwww..wwwwww.....................w............ww',
                'wwwwww..wwwwww.......ggggggggggggggw............ww',
                'wwwwww..wwwwww.....gggwwwwwwwwwwwwww............ww',
                'ww..........wwggggggwww.....wwwwwwww............ww',
                'ww..........wwwwwwwww.......wwwwwwww............ww',
                'ww..........w...............wwwwwwww............ww',
                'ww...pppp...w...............wwwwwwww............ww',
                'ww..........t.....pppp......wwwwwwww............ww',
                'ww..........t...............wwwwwwww..ppp..ppp..ww',
                'wwggggggggggggggg...........wwwwwwww............ww',
                'wwwwwwwwwwwwwwwww...........wwwwwwww............ww',
                'wwwwwwwwwwwwwwwwwggggggggggggggggggwggggggggggggww',
                'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww'
            ],
            -64, -tileSize, tileSize, tileSize
        );

        // Tiles for the conveyor
        new Tiles([
                'LR'
            ], tileSize * 2, tileSize * 27, tileSize * 5, tileSize
        );


        // Energy capsules to collect
        energy.push(new Energy(16 * tileSize, 6 * tileSize));
        energy.push(new Energy(41 * tileSize, 2 * tileSize));
        energy.push(new Energy(12 * tileSize, 20 * tileSize));
        energy.push(new Energy(17 * tileSize, 24 * tileSize));
        energy.push(new Energy(28 * tileSize, 8 * tileSize));
    }

    drawCamera() {
        // Draw the camera at the player's position
        camera.position = player.sprite.position;

        // Don't show areas beyond the level bounds
        if (camera.x < tileSize * 5) {
            camera.x = tileSize * 5;
        } else if (camera.x > tileSize * 40) {
            camera.x = tileSize * 40;
        }

        if (camera.y < 135) {
            camera.y = 135;
        } else if (camera.y > tileSize * 24) {
            camera.y = tileSize * 24;
        }
    }

    conveyorSpawns() {
        if (enemies.conveyorUFOs.length < 1) {
            enemies.conveyorCannons.forEach(cannon => {
                if (!cannon.spawning && cannon.spawnType === "ufo") {
                    cannon.spawning = setTimeout(() => {
                        enemies.conveyorUFOs.push(cannon.spawnEnemy());
                        clearTimeout(cannon.spawning);
                        cannon.spawning = null;
                    }, 500);
                }
            });
        }

        if (enemies.conveyorMissiles.length < 1) {
            enemies.conveyorCannons.forEach(cannon => {
                if (!cannon.spawning && cannon.spawnType === "missile") {
                    cannon.spawning = setTimeout(() => {
                        enemies.conveyorMissiles.push(cannon.spawnEnemy());
                        clearTimeout(cannon.spawning);
                        cannon.spawning = null;
                    }, 500);
                }
            });
        }
    }
}