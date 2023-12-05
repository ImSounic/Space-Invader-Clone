function startGame() {
    // Get the player's name
    const playerName = document.getElementById('nameInput').value;

    // Check if the player entered a name
    if (playerName.trim() !== '') {
        // Hide the UI elements
        document.getElementById('nameInput').style.display = 'none';
        document.getElementById('startButton').style.display = 'none';
        document.getElementById('description').style.display = 'none';
        document.getElementById('title').style.display = 'none';

        // Show the canvas
        document.getElementById('gameCanvas').style.display = 'block';
        document.getElementById('score').style.display = 'block';
        document.getElementById('livesContainer').style.display = 'flex';

        // Initialize the game with the player's name
        initializeGame(playerName);
    } else {
        alert('Please enter your name before starting the game.');
    }
}

function initializeGame(playerName) {
    const canvas = document.querySelector('canvas');
    const scoreElement = document.querySelector('#scoreElement');
    const c = canvas.getContext('2d');

    canvas.width = 1280;
    canvas.height = 720;

    const gameOver = document.querySelector('#gameOver');
    const finalScore = document.querySelector('#finalScore');
    const nameInput = document.querySelector('#nameInput');

    const restartButton = document.querySelector('#restartButton');

    const shootSound = new Audio("./sounds/shoot.wav");
    shootSound.volume = 0.2;
    const enemyDeathSound = new Audio("./sounds/enemy-death.wav");
    enemyDeathSound.volume = 0.2;
    const playerDeathSound = new Audio("./sounds/playerDamage.mp3");

    //Player
    class Player {
        //Constructor with parameters
        constructor() {
            //initial movement/values
            this.velocity = {
                x: 0,
                y: 0
            }

            this.rotation = 0
            this.opacity = 1;
            //load image
            const image = new Image();
            image.src = './img/spaceship.png';

            //using Image on load to wait for the image to load before the
            //game is started.
            //otherwise the game would start without the spaceship
            image.onload = () => {
                this.image = image;
                this.width = image.width * 0.07;
                this.height = image.height * 0.07;
                this.position = {
                    x: canvas.width / 2,
                    y: canvas.height - this.height - 20
                }
            }
        }

        //Draw the player at the position with the width and height
        draw() {
            c.save();
            c.globalAlpha = this.opacity;
            c.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            )
            c.restore();
        }

        //Update the player's position
        update() {
            if (this.image) {
                this.draw();
                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;
            }
        }
    }

    // Projectile/Bullets
    class Projectile {
        //Projectile will have a movement as well, so we need position and velocity
        constructor({ position, velocity }) {
            this.position = position;
            this.velocity = velocity;

            const player_bullet = new Image();
            player_bullet.src = './img/player_bullet.png';

            player_bullet.onload = () => {
                this.image = player_bullet;
                this.width = player_bullet.width * 0.6;
                this.height = player_bullet.height * 0.6;
            }
        }

        draw() {
            c.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            )
        }

        update() {
            if (this.image) {
                this.draw();
                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;
            }
        }
    }
    //Enemy Bullets
    class EnemyProjectile {
        //Enemy Bullet will be slightly different from player bullet.
        constructor({ position, velocity }) {
            this.position = position;
            this.velocity = velocity;

            const player_bullet = new Image();
            player_bullet.src = './img/enemy_bullet.png';

            player_bullet.onload = () => {
                this.image = player_bullet;
                this.width = player_bullet.width * 0.4; //making enemy bullet smaller.
                this.height = player_bullet.height * 0.4;
            }
        }

        draw() {
            c.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            )
        }

        update() {
            if (this.image) {
                this.draw();
                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;
            }
        }
    }
    //Enemies

    class Enemy {
        constructor({ position }) {
            //initial movement/values
            this.velocity = {
                x: 0,
                y: 0
            }

            //load image
            const image = new Image();
            image.src = './img/enemy.png';

            //using Image on load to wait for the image to load before the
            //game is started.
            //otherwise the game would start without the spaceship
            image.onload = () => {
                this.image = image;
                this.width = image.width * 0.4;
                this.height = image.height * 0.4;
                this.position = {
                    x: position.x,
                    y: position.y
                }
            }
        }

        //Draw the player at the position with the width and height
        draw() {
            c.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            )
        }

        //Update the player's position
        update({ velocity }) {
            if (this.image) {
                this.draw();
                this.position.x += velocity.x;
                this.position.y += velocity.y;
            }
        }

        shoot(enemyProjectiles) {
            enemyProjectiles.push(new EnemyProjectile({
                position: {
                    x: this.position.x + this.width / 2,
                    y: this.position.y + this.height
                },
                velocity: {
                    x: 0,
                    y: 3
                }
            }))
        }
    }

    class Grid {
        constructor() {
            this.position = {
                x: 0,
                y: 0
            }

            this.velocity = {
                x: 3,
                y: 0
            }

            this.enemy = [];
            //minimum cols and rows. (5, 1 respectively).
            const cols = Math.floor(Math.random() * 10 + 5);
            const rows = Math.floor(Math.random() * 4 + 1);

            this.width = cols * 60;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    this.enemy.push(new Enemy({
                        position: {
                            //Gap between each enemy.
                            x: i * 50,
                            y: j * 35
                        }
                    }));
                }
            }
        }

        update() {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            this.velocity.y = 0;

            if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
                this.velocity.x = -this.velocity.x;
                this.velocity.y = 30;
            }
        }
    }
    //Instantiate the player
    const player = new Player();
    const grid = []; //no need to instantiate a new Grid as we are creating a new grid in the animate function.

    //Projectiles Array
    //as there will be multiple projectiles/bullets being shot by the
    const projectiles = [];
    //Enemy Projectiles
    const enemyProjectiles = [];
    //Keys
    const keys = {
        a: {
            pressed: false
        },
        d: {
            pressed: false
        },
        w: {
            pressed: false
        },
        s: {
            pressed: false
        },
        space: {
            pressed: false
        }
    }
    //spawning enemies after certain frames.
    let no_of_frames = 0;
    //interval to spawn enemies. (Randomising for better gameplay)
    let randomInterval = Math.floor(Math.random() * 500 + 500);
    let game = {
        over: false,
        active: true
    }
    //score
    let score = 0;

    let playerLives = 3;

    //Background for the canvas.
    const backgroundImage = new Image();
    backgroundImage.src = './img/gameBackground.jpg';
    backgroundImage.opacity = 0.5;

    const heartImage1 = document.getElementById("heart1");
    const heartImage2 = document.getElementById("heart2");
    const heartImage3 = document.getElementById("heart3");
    //Animate
    function animate() {
        if (!game.active) {
            return;
        }
        requestAnimationFrame(animate);
        //to reset the canvas after the animation, or else we would have an echo of the animation.
        c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        player.update();
        //Enemy Bullets Garbage collection
        enemyProjectiles.forEach((enemyProjectile, index) => {
            if (enemyProjectile.position.y + enemyProjectile.height >= canvas.height) {
                enemyProjectiles.splice(index, 1);
            }
            else {
                enemyProjectile.update();
            }

            //collision detection when the enemy bullet hits the player.
            if (enemyProjectile.position.y + enemyProjectile.height >= player.position.y &&
                enemyProjectile.position.x + enemyProjectile.width >= player.position.x &&
                enemyProjectile.position.x <= player.position.x + player.width) {
                console.log('Player Hit');
                enemyProjectiles.splice(index, 1);
                playerLives = playerLives - 1;
                heartImage3.style.display = 'none';
                playerDeathSound.play();

                if (playerLives === 1) {
                    heartImage2.style.display = 'none';
                    playerDeathSound.play();
                }


                if (playerLives <= 0) {
                    console.log('Game Over');
                    playerDeathSound.play();
                    heartImage1.style.display = 'none';
                    player.opacity = 0;
                    game.over = true;
                    game.active = false;
                    gameOver.style.display = 'block';
                    finalScore.innerHTML = score;
                    document.getElementById('score').style.display = 'none';
                    saveScore(playerName, score);
                    console.log("Score is " + score + " for " + playerName);
                }
            }
        })
        //Enemy Shooting
        enemyProjectiles.forEach((enemyProjectile, index) => {
            enemyProjectile.update();
        })
        // projectile/bullets
        projectiles.forEach((projectile, index) => {
            if (projectile.position.y + projectile.height >= canvas.height) {
                projectiles.splice(index, 1);
            }
            else {
                projectile.update();
            }
        })
        //enemy grid movement
        grid.forEach((grid) => {
            grid.update();
            //Enemy shooting
            if (no_of_frames % 100 === 0 && grid.enemy.length > 0) {
                //randomly select an enemy to shoot.
                grid.enemy[Math.floor(Math.random() * grid.enemy.length)].shoot(enemyProjectiles);
            }
            grid.enemy.forEach((enemy) => {
                enemy.update({ velocity: grid.velocity });
                //projectile collision detection to destroy the enemy.
                projectiles.forEach((projectile) => {
                    if (projectile.position.y + projectile.height + 75 >=
                        enemy.position.y && projectile.position.x >=
                        enemy.position.x && projectile.position.x <=
                        enemy.position.x + enemy.width && projectile.position.y <=
                        enemy.position.y + enemy.height) {
                        //remove the enemy and the bullet from the array
                        //ISSUES: 1. The enemy is flickering when it is removed, 2. The bullet is not completely in contact with the enemy, 3. The enemy grid is bouncing off the canvas at the original width of the grid and not the new grid formed after enemies are shot.
                        //ISSUE 1 Solution:
                        setTimeout(() => {
                            //setTimeout is used to delay the removal of the enemy and the bullet.
                            //As splice is used to remove an element from an array, the array is rearranged.
                            const enemyFound = grid.enemy.find((enemy2) => {
                                return enemy2 === enemy
                            })

                            const projectileFound = projectiles.find((projectile2) => {
                                return projectile2 === projectile
                            })

                            if (enemyFound && projectileFound) {
                                grid.enemy.splice(grid.enemy.indexOf(enemyFound), 1);
                                projectiles.splice(projectiles.indexOf(projectile), 1);
                            }

                        }, 0)
                        //Play the sound when the enemy is hit.
                        enemyDeathSound.play();
                        //update the score
                        score += 100;
                        scoreElement.innerHTML = score;
                        //ISSUE 3 Solution:
                        //check if there are any enemies left, and grid bounces off the canvas accordingly
                        if (grid.enemy.length > 0) {
                            const first_enemy = grid.enemy[0];
                            const last_enemy = grid.enemy[grid.enemy.length - 1];

                            grid.width = last_enemy.position.x - first_enemy.position.x + last_enemy.width;
                            grid.position.x = first_enemy.position.x;
                        }
                        else {
                            grid.splice(grid.indexOf(grid), 1);
                        }
                    }
                })
            })
        })

        //Player movement within the canvas.
        if (keys.a.pressed && player.position.x >= 0) {
            player.velocity.x = -5;
        } else if (keys.d.pressed && player.position.x + player.width <=
            canvas.width) {
            player.velocity.x = 5;
        } else {
            player.velocity.x = 0;
        }

        //spawn enemies after certain frames. (Minimum is 500 frames).
        if (no_of_frames % randomInterval === 0) {
            grid.push(new Grid());
            randomInterval = Math.floor(Math.random() * 500 + 500);
        }

        no_of_frames++;
    }

    //call the animate function
    animate();

    //Keydown and Keyup
    //to record the button presses
    addEventListener('keydown', ({ key }) => {
        if (game.over) return;
        switch (key) {
            case 'a':
                keys.a.pressed = true;
                break;
            case 'd':
                keys.d.pressed = true;
                break;
            case 'w':
                keys.w.pressed = true;
                break;
            case 's':
                keys.s.pressed = true;
                break;
            case ' ':
                //projectile
                //pushing the projectile into the array
                projectiles.push(new Projectile({
                    //bullet position should align with the player
                    position: {
                        x: player.position.x + 35,
                        y: player.position.y - 35
                    },
                    //bullet velocity
                    velocity: {
                        x: 0,
                        y: -15
                    }
                }));
                shootSound.play();
                keys.space.pressed = true;
                break;
        }
    })

    addEventListener('keyup', ({ key }) => {
        switch (key) {
            case 'a':
                keys.a.pressed = false;
                break;
            case 'd':
                keys.d.pressed = false;
                break;
            case 'w':
                keys.w.pressed = false;
                break;
            case 's':
                keys.s.pressed = false;
                break;
            case ' ':
                keys.space.pressed = false;
                break;
        }
    })

    //restart button
    restartButton.addEventListener('click', () => {
        window.location.reload();
    })

    async function saveScore(playerName, playerScore) {
        const url = `./PHP/save_score.php?name=${playerName}&score=${playerScore}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
            });

            if (response.ok) {
                console.log('Score saved successfully');
            } else {
                console.error('Failed to save score:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving score:', error);
        }
    }
}

