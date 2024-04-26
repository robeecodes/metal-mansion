class BossLevel {

    // Check if level complete
    #levelComplete;

    constructor() {
        // Configure different enemy types
        enemies = {
            mainBoss: [],
            cannons: [],
            minions: []
        }

        // Recreate player based on attributes
        if (playerInfo.name === 'Kaori') {
            player = new Kaori(11 * tileSize, 8 * tileSize);
            player.energy = playerInfo.energy;
        }

        if (playerInfo.name === 'Ren') {
            player = new Ren(11 * tileSize, 8 * tileSize);
            player.energy = playerInfo.energy;
        }

        // Powerup if player has energy
        if (player.energy > 0) {
            player.becomeSuper();
        }

        // Build the map
        this.createMap();

        // Create the enemies
        this.createEnemies();

        // Set bgm
        bgm = bossBGM;

        // Play bgm
        bgm.loop();
    }

    draw() {
        // Hide cursor
        noCursor();

        background(color(103, 110, 158));

        // Draw camera
        this.drawCamera();

        // Player, enemies and projectiles are active while player is alive
        if (player.health.isAlive() && !this.#levelComplete) {
            managePlayer();
            manageEnemies();
            manageProjectiles();

            // Create new enemies
            this.spawnMinions();
            // Beat the level
            if (enemies.mainBoss.length < 1) {
                levelWin();
                // Return to title after 7 seconds
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
            // Player dies if their health is 0 and level isn't complete
            playerDeath();
        }
    }


    // Create all the enemies on the map and push into the enemies object
    createEnemies() {
        enemies.mainBoss.push(new UFO(15 * tileSize, 9 * tileSize, 2000, 1.75));

        enemies.cannons.push(new Cannon(0, 8 * tileSize, 200, 0.75, 0, "tank"));
        enemies.cannons.push(new Cannon(24 * tileSize, 8 * tileSize, 200, 0.75, -180, "tank"));

        enemies.minions.push(new Missile(4 * tileSize, 5 * tileSize, 150, 0.75));
        enemies.minions.push(new Missile(20 * tileSize, 5 * tileSize, 150, 0.75));
    }

    // Create the map using tiles
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