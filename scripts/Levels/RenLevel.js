// Level when player is a Ren

class RenLevel {
    #levelComplete;

    constructor() {
        player = new Ren(tileSize, 28 * tileSize);

        playerInfo = {
            name: 'Ren',
            energy: 0
        }

        // Enemies stored in arrays relevant to their area
        enemies = {
            basicEnemies: [],
        }

        energy = [];

        this.createEnemies();

        this.createMap();

        this.exit = new Sprite(23.5 * tileSize, 6.5 * tileSize, 'n');
        this.exit.addAnimation('idle', animationAtlas.exitDoor.idle);
        this.exit.layer = 1;

        // HurtSFX pitch raised
        hurtSFX.rate(1.35);

        bgm = levelBGM;

        bgm.loop();
    }

    draw() {
        noCursor();

        background(color(103, 110, 158));

        this.drawCamera();

        if (player.health.isAlive()) {
            // Draws the player
            managePlayer();

            if (!this.#levelComplete) {
                // Draws the enemies
                manageEnemies();

                manageProjectiles();


                // Beat the level
                if (customOverlap(player.sprite, this.exit)) {
                    player.sprite.vel.x = 0;
                    player.sprite.vel.y = 1.5;
                    playerInfo.energy = player.energy;
                    clearEnemies();
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
        enemies.basicEnemies.push(new UFO(8 * tileSize, 28 * tileSize, 100, 0.75));
        enemies.basicEnemies.push(new UFO(15 * tileSize, 28 * tileSize, 100, 0.75));
        enemies.basicEnemies.push(new UFO(36 * tileSize, 18 * tileSize, 125, 1));
        enemies.basicEnemies.push(new Missile(38 * tileSize, 23 * tileSize, 100, 0.75));
        enemies.basicEnemies.push(new UFO(43 * tileSize, 26 * tileSize, 125, 1));
    }

    createMap() {
        // Tiles for walls, floors and platforms
        new Tiles(
            [
                'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
                'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
                'ww...wwwwwwwwwwwwwwwww..........................ww',
                'ww...wwwwwwwwwwwwwwwww..........................ww',
                'ww...wwwwwwwwwwwwwwwww..........................ww',
                'ww...wwwwwwwwwwwwwwwww..........................ww',
                'ww...wwwwwwwwwwwwwwwww..........................ww',
                'ww...wwwwwwwwwwwwwwwww..........................ww',
                'ww...wwwwwwwwwwwwwwwww..........................ww',
                'ww...wwwwwwwwwwwwwwwww..........................ww',
                'ww...wwwwwwwwwwwwwwwwwggggggggggggggggggggggpp..ww',
                'ww...wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww....ww',
                'ww...wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww..iiww',
                'ww...wwwwwwwwwwwwwwwww....................ww..ppww',
                'ww...wwwwwwwwwwwwwwwww....................ww....ww',
                'ww...wwwwwwwwwwwwwwwww....................ww....ww',
                'ww...wwwwwwwwwwwwwwwww....................wwpp..ww',
                'ww...wwwwwwwwwwwwwwwww....................ww....ww',
                'ww...wwwwwwwwwwwwwwwww....................ww....ww',
                'ww...wwwwwwwwwwwwwwwww....ii..............ww..ppww',
                'ww...wwwwwwwwwwwwwwwww....ppggggggggggg...ww....ww',
                'ww...wwwwwwwwwwwwwwwww......wwwwwwwwwww...wwii..ww',
                'ww...wwwwwwwwwwwwwwwwwii....wwwwwwwwwww...wwpp..ww',
                'ww...wwwwwwwwwwwwwwwwwpp....wwwwwwwwwww...ww....ww',
                'ww..........................ww............ww....ww',
                'ww........................iiww................ppww',
                'ww......iiiiiiii..........ppww..iiiii...........ww',
                'ww......pppppppp.....ppp....ww..ppppp...........ww',
                'ww..........................ww..........ggggggggww',
                'ww..........................ww..........ggggggggww',
                'wwggggggggggggggggggggggggggggggggggggggggggggggww',
                'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww'
            ],
            -64, -tileSize, tileSize, tileSize
        );


        // Energy capsules to collect
        energy.push(new Energy(20 * tileSize, 25 * tileSize));
        energy.push(new Energy(38 * tileSize, 21 * tileSize));
        energy.push(new Energy(29 * tileSize, 28 * tileSize));
        energy.push(new Energy(45 * tileSize, 26 * tileSize));
        energy.push(new Energy(42 * tileSize, 8 * tileSize));
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
}