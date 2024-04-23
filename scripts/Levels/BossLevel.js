class BossLevel {

    #levelComplete;

    constructor() {
        enemies = {
            mainBoss: [],
            cannons: [],
            minions: []
        }

        if (playerInfo.name === 'Kaori') {
            player = new Kaori(11 * tileSize, 8 * tileSize);
            player.energy = playerInfo.energy;
        }

        if (playerInfo.name === 'Ren') {
            player = new Ren(11 * tileSize, 8 * tileSize);
            player.energy = playerInfo.energy;
        }

        if (player.energy > 0) {
            player.becomeSuper();
        }

        this.createMap();

        this.createEnemies();

        bgm = bossBGM;

        bgm.loop();
    }

    draw() {
        noCursor();

        background(color(103, 110, 158));

        this.drawCamera();

        managePlayer();

        if (player.health.isAlive() && !this.#levelComplete) {
            manageEnemies();
            manageProjectiles();
            this.spawnMinions();
            // Beat the level
            if (enemies.mainBoss.length < 1) {
                player.sprite.vel.x = 0;
                player.sprite.vel.y = 1.5;
                bgm.stop();
                clearEnemies();
                if (!winBGM.isPlaying()) {
                    winBGM.play();
                }
                if (!this.#levelComplete) {
                    this.#levelComplete = setTimeout(() => {
                        teleportSFX.play();
                        playerInfo = {};
                        clearWorld();
                        currScene = new MainMenu();
                    }, 7000);
                }
            }
        } else if (!this.#levelComplete) {
            playerDeath();
        }
    }

    createEnemies() {
        enemies.mainBoss.push(new UFO(15 * tileSize, 9 * tileSize, 2000, 1.75));

        enemies.cannons.push(new Cannon(0, 8 * tileSize, 200, 0.75, 0, "tank"));
        enemies.cannons.push(new Cannon(24 * tileSize, 8 * tileSize, 200, 0.75, -180, "tank"));

        enemies.minions.push(new Missile(4 * tileSize, 5 * tileSize, 150, 0.75));
        enemies.minions.push(new Missile(20 * tileSize, 5 * tileSize, 150, 0.75));
    }

    createMap() {
        // Tiles for walls, floors and platforms
        new Tiles(
            [
                'wwwwwwwwwwwwwwwwwwwwwwwwwwwww',
                'wwwwwwwwwwwwwwwwwwwwwwwwwwwww',
                'ww.........................ww',
                'ww.........................ww',
                'ww.........................ww',
                'ww.........................ww',
                'ww.........pppppp..........ww',
                'ww..pppppp.........pppppp..ww',
                'ww.........................ww',
                'ww.........................ww',
                'wwgggggggggggggggggggggggggww',
                'wwwwwwwwwwwwwwwwwwwwwwwwwwwww'
            ],
            -64, -tileSize, tileSize, tileSize
        );
    }

    drawCamera() {
        // Draw the camera at the player's position
        camera.position = player.sprite.position;

        // Don't show areas beyond the level bounds
        if (camera.x < tileSize * 5) {
            camera.x = tileSize * 5;
        } else if (camera.x > tileSize * 19) {
            camera.x = tileSize * 19;
        }

        if (camera.y > tileSize * 4.5) {
            camera.y = tileSize * 4.5;
        } else if (camera.y < tileSize * 4.25) {
            camera.y = tileSize * 4.25;
        }
    }

    spawnMinions() {
        // Spawn new tanks every .5 seconds
        if (enemies.minions.length < 3) {
            enemies.cannons.forEach((cannon) => {
                if (!cannon.spawning) {
                    cannon.spawning = setTimeout(() => {
                        enemies.minions.push(cannon.spawnEnemy());
                        clearTimeout(cannon.spawning);
                        cannon.spawning = null;
                    }, 500);
                }
            });
        }
    }
}