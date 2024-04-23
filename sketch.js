const SCENES = [MainMenu, KaoriLevel, BossLevel, GameOver, RenLevel];

let cnv, currScene, prevScene, tilesheet, animatedSheet, iceImg, tileSize, animationAtlas;

let mainMenuImg, manualImg, chooseCharacterImg;

let gameOverTimeout;

let player, enemies, energy, playerInfo;

let arcadeFont, commandFont;

let bgm;

let bossBGM, levelBGM, menuBGM, winBGM;

let deathSFX, fireSFX, hurtSFX, jumpSFX, pickupSFX, shootSFX, stepSFX, teleportSFX;

let wall, ground, tempWall, platforms, danger, ice;

let conveyorL, conveyorR;

function preload() {
    // Load the sprites tilesheets
    tilesheet = loadImage('./assets/maps/tilesheets/tiles.png');
    animatedSheet = loadImage('./assets/maps/tilesheets/animated-objects.png');
    iceImg = loadImage('./assets/maps/tilesheets/ice.png');

    // Load Menu Images
    mainMenuImg = loadImage('./assets/menus/main.png');
    manualImg = loadImage('./assets/menus/manual.png');
    chooseCharacterImg = loadImage('./assets/menus/choose-character.png');

    // Preload animations here
    animationAtlas = buildAnimationAtlas();

    // Load retro font
    arcadeFont = loadFont('./assets/fonts/karmatic-arcade/ka1.ttf');
    commandFont = loadFont('./assets/fonts/Atarian/SF Atarian System Bold.ttf');

    // Load music
    soundFormats('mp3');
    bossBGM = loadSound('./assets/music/boss');
    levelBGM = loadSound('./assets/music/8-bitGame');
    levelBGM.setVolume(0.35);
    menuBGM = loadSound('./assets/music/digital-dreamscape');
    menuBGM.setVolume(0.35);
    winBGM = loadSound('./assets/music/you-win');

    // Load sfx
    deathSFX = loadSound('./assets/music/videogame-death-sound');
    fireSFX = loadSound('./assets/music/fireball');
    fireSFX.setVolume(0.35);
    hurtSFX = loadSound('./assets/music/oof');
    hurtSFX.setVolume(0.25);
    jumpSFX = loadSound('./assets/music/cartoon-jump');
    jumpSFX.setVolume(0.35);
    pickupSFX = loadSound('./assets/music/pickup');
    pickupSFX.setVolume(0.5);
    shootSFX = loadSound('./assets/music/shoot');
    shootSFX.setVolume(0.3);
    stepSFX = loadSound('./assets/music/footstep');
    stepSFX.setVolume(1.5);
    teleportSFX = loadSound('./assets/music/teleport');
}

function setup() {
    player = null;

    // Initialise Game Canvas
    cnv = new GameCanvas();
    cnv.buildGameCanvas();
    camera.zoom = cnv.scaleFactor;

    // Initialise world
    world.gravity.y = 10;

    // Set angle mode to degrees and rectmode to center
    angleMode(DEGREES);
    rectMode(CENTER);

    // General size of tiles
    tileSize = 32;

    // Create tiles for levels
    wall = new Group();
    wall.collider = 'static';
    wall.spriteSheet = tilesheet;
    wall.addAni({width: tileSize, height: tileSize, row: 1, col: 4});
    wall.tile = 'w';
    wall.layer = 2;

    ground = new Group();
    ground.collider = 'static';
    ground.spriteSheet = tilesheet;
    ground.addAni({width: tileSize, height: tileSize, row: 1, col: 4});
    ground.tile = 'g';
    ground.layer = 2;

    tempWall = new Group();
    tempWall.collider = 'static';
    tempWall.spriteSheet = tilesheet;
    tempWall.addAni({width: tileSize, height: tileSize, row: 6, col: 6});
    tempWall.tile = 't';
    tempWall.layer = 2;

    platforms = new Group();
    platforms.collider = 'static';
    platforms.spriteSheet = tilesheet;
    platforms.addAni({width: tileSize, height: tileSize, row: 8, col: 7});
    platforms.tile = 'p';
    platforms.layer = 2;
    platforms.height = 16;
    platforms.anis.offset.y = platforms.height / 2;

    danger = new Group();
    danger.collider = 'none';
    danger.spriteSheet = tilesheet;
    danger.addAni({width: tileSize, height: tileSize, row: 4, col: 4});
    danger.tile = '!';
    danger.layer = 1;

    conveyorL = new Group();
    conveyorL.collider = 'static';
    conveyorL.spriteSheet = animatedSheet;
    conveyorL.addAni({width: tileSize * 5, height: tileSize, row: 1, col: 0, frames: 3});
    conveyorL.tile = 'L';
    conveyorL.layer = 3;

    conveyorR = new Group();
    conveyorR.collider = 'static';
    conveyorR.spriteSheet = animatedSheet;
    conveyorR.addAni({width: tileSize * 5, height: tileSize, row: 0, col: 0, frames: 3});
    conveyorR.tile = 'R';
    conveyorR.layer = 3;

    ice = new Group();
    ice.collider = 'static';
    ice.spriteSheet = iceImg;
    ice.addAni({width: tileSize, height: tileSize, row: 0, col: 0});
    ice.tile = 'i';
    ice.height = 48;
    ice.anis.offset.y = ice.height / 2 - 16;
    ice.layer = 3;
    ice.overlaps(allSprites);

    currScene = new MainMenu();
}

function draw() {
    currScene.draw();
}

function windowResized() {
// Change screen size if window size changes after p5.play splash
    if (cnv) {
        cnv.buildGameCanvas();
        camera.zoom = cnv.scaleFactor;
    }
}

// Delete all tiles currently being displayed
function clearWorld() {
    if (player !== null) {
        player.sprite.remove();
        player = null;
    }
    allSprites.removeAll();
    enemies = {};
    energy = [];
}

// Delete all enemies
function clearEnemies() {
    for (let arr of Object.values(enemies)) {
        arr.forEach(enemy => {
            enemy.hpBar.remove();
            enemy.sprite.remove();
        });
    }
    enemies = {};
}

// Activate when the player dies
function playerDeath() {
    bgm.stop();

    clearEnemies();

    // Play player death animation
    player.die();

    prevScene = currScene;

    if (!gameOverTimeout) {
        deathSFX.play();
        gameOverTimeout = setTimeout(() => {
            clearWorld();
            currScene = new GameOver();

            clearTimeout(gameOverTimeout);
            gameOverTimeout = null;
        }, 2000);
    }
}

// Check if each enemy is alive. If not, it's removed, otherwise its draw functions are run
function manageEnemies() {
    for (let arr of Object.values(enemies)) {
        arr.forEach((enemy, i) => {
            if (!enemy.health.isAlive()) {
                enemy.sprite.remove();
                enemy.hpBar.remove();
                arr.splice(i, 1);
            } else {
                enemy.actions();
                enemy.drawHP();
                enemy.collision();
            }
        });
    }
}

function managePlayer() {
    player.animations();
    player.actions();
    player.collision();
    player.drawHP();
}

function manageProjectiles() {
    // Fire all existing projectiles
    Projectile.projectiles.forEach((projectile) => {
        projectile.fire();
    });
}

function buildAnimationAtlas() {
    // Create all the animations needed from sprite sheets
    return {
        kaori: {
            idle: loadAnimation('./assets/sprites/kaori/kaori-idle.png', {frameSize: [64, 64], frames: 4}),
            idleShoot: loadAnimation('./assets/sprites/kaori/kaori-idle-shoot.png', {frameSize: [64, 64], frames: 2}),
            run: loadAnimation('./assets/sprites/kaori/kaori-run.png', {frameSize: [64, 64], frames: 2}),
            runShoot: loadAnimation('./assets/sprites/kaori/kaori-run-shoot.png', {frameSize: [64, 64], frames: 2}),
            jump: loadAnimation('./assets/sprites/kaori/kaori-jump.png', {frameSize: [64, 64], frames: 2}),
            jumpShoot: loadAnimation('./assets/sprites/kaori/kaori-jump-shoot.png', {frameSize: [64, 64], frames: 2}),
            die: loadAnimation('./assets/sprites/kaori/kaori-death.png', {frameSize: [64, 64], frames: 2}),
            superIdle: loadAnimation('./assets/sprites/kaori/kaori-special-idle.png', {frameSize: [64, 64], frames: 4}),
            superIdleShoot: loadAnimation('./assets/sprites/kaori/kaori-special-idle-shoot.png', {
                frameSize: [64, 64],
                frames: 2
            }),
            superRun: loadAnimation('./assets/sprites/kaori/kaori-special-run.png', {frameSize: [64, 64], frames: 2}),
            superRunShoot: loadAnimation('./assets/sprites/kaori/kaori-special-run-shoot.png', {
                frameSize: [64, 64],
                frames: 2
            }),
            superJump: loadAnimation('./assets/sprites/kaori/kaori-special-jump.png', {frameSize: [64, 64], frames: 2}),
            superJumpShoot: loadAnimation('./assets/sprites/kaori/kaori-special-jump-shoot.png', {
                frameSize: [64, 64],
                frames: 2
            }),
        },
        ren: {
            idle: loadAnimation('./assets/sprites/ren/ren-idle.png', {frameSize: [64, 64], frames: 4}),
            idleShoot: loadAnimation('./assets/sprites/ren/ren-idle-shoot.png', {frameSize: [64, 64], frames: 2}),
            run: loadAnimation('./assets/sprites/ren/ren-run.png', {frameSize: [64, 64], frames: 2}),
            runShoot: loadAnimation('./assets/sprites/ren/ren-run-shoot.png', {frameSize: [64, 64], frames: 2}),
            jump: loadAnimation('./assets/sprites/ren/ren-jump.png', {frameSize: [64, 64], frames: 2}),
            jumpShoot: loadAnimation('./assets/sprites/ren/ren-jump-shoot.png', {frameSize: [64, 64], frames: 2}),
            die: loadAnimation('./assets/sprites/ren/ren-death.png', {frameSize: [64, 64], frames: 2}),
            superIdle: loadAnimation('./assets/sprites/ren/ren-special-idle.png', {frameSize: [64, 64], frames: 4}),
            superIdleShoot: loadAnimation('./assets/sprites/ren/ren-special-idle-shoot.png', {
                frameSize: [64, 64],
                frames: 2
            }),
            superRun: loadAnimation('./assets/sprites/ren/ren-special-run.png', {frameSize: [64, 64], frames: 2}),
            superRunShoot: loadAnimation('./assets/sprites/ren/ren-special-run-shoot.png', {
                frameSize: [64, 64],
                frames: 2
            }),
            superJump: loadAnimation('./assets/sprites/ren/ren-special-jump.png', {frameSize: [64, 64], frames: 2}),
            superJumpShoot: loadAnimation('./assets/sprites/ren/ren-special-jump-shoot.png', {
                frameSize: [64, 64],
                frames: 2
            }),
        },
        UFO: {
            idle: loadAnimation('./assets/sprites/enemies/ufo.png', {frameSize: [64, 64], frames: 6})
        },
        missile: {
            idle: loadAnimation('./assets/sprites/enemies/missile.png', {frameSize: [64, 64], frames: 6})
        },
        tank: {
            idle: loadAnimation('./assets/sprites/enemies/tank.png', {frameSize: [64, 64], frames: 2})
        },
        cannon: {
            idle: loadAnimation('./assets/sprites/enemies/cannon.png', {frameSize: [64, 64], frames: 1}),
            shoot: loadAnimation('./assets/sprites/enemies/cannon-shoot.png', {frameSize: [64, 64], frames: 1})
        },
        exitDoor: {
            idle: loadAnimation('./assets/maps/tilesheets/exit-door.png', {frameSize: [128, 128], frames: 1})
        },
        energy: {
            idle: loadAnimation('./assets/sprites/energy.png', {frameSize: [64, 64], frames: 1})
        }
    };
}