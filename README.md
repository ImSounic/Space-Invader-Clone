## Creating Space Shooter Game using HTML 5 canvas.

## REQUIREMENTS:
The University Apache server, PHP with PDO enabled for PostgreSQL (uncomment extension dir and pgsql extension in php.ini).

## HOW TO RUN THE PROJECT:
1. Open this project in IntelliJ.
2. Configure PHP Interpreter.
3. Configure your database credentials in a PHP File.
4. Link the path of your DB Credentials in get_db_connections.php file.
5. Create Table game_leaderboard in your database. SQL Query -> CREATE TABLE leaderboard (id SERIAL PRIMARY KEY,
                                                                                          name VARCHAR(255) NOT NULL,
                                                                                          score INT NOT NULL);
6. Run index.html and the scores will be saved in your Database.
7. To view the TOP 10 SCORES just visit leaderboards.html through the navbar.
8. Double check all the required assets (images, sounds).
9. ENJOY!  


## REFERENCES:
1. Starter Template: https://www.youtube.com/watch?v=MCVU0w73uKI&t=4933s - Chris Courses
2. Spaceship Images - https://www.opengameart.org
3. Audio/SFX - https://www.opengameart.org
4. Player Death Sound - Sound Effect from - https://pixabay.com/sound-effects/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=90398
5. PHP Files Provided in Practicals for database connections.
6. Canvas Background - https://www.freepik.com
7. Custom Fonts - https://fonts.google.com/

## Changes from Original:
1. Added Game UI.
2. Added Sounds.
3. Added Images.
4. Added Canvas Background Image
5. Used bullet images instead of drawing circles as bullets for Player and Enemies.
6. Added Lives Functionality in the game to make it user-friendly to beginners.
7. Used setTimeout while destroying enemies to remove flickering of enemies when shot.
8. Added Leaderboards, using PostgreSQL as Database.

## Steps in which Project was Done:
1. Project Setup - Done
2. Creating A Player - Done
3. Movement of the Player - Done
4. Creating Bullets - Done
5. Creating Enemies to Shoot - Done **
6. Creating a Spawn Pattern (Grid) - Done
7. Increasing Difficulty Over Time (Increase Enemy Spawn Rate)
8. Shooting Enemies using collision detection.
    PROBLEMS ALONG THE WAY:
    a. The enemy is flickering when it is removed.
    b. The bullet is not completely in contact with the enemy
    c. The enemy grid is bouncing off the canvas at the original width of the grid and not the new grid formed after enemies are shot
9. Enemies Shoot the player - Done
10. Creating a Background (Space) - DONE
11. Lose Condition - DONE
12. Score Functionality - DONE
13. Adding Leaderboard using PostgreSQL. - DONE
14. Enhancing the HTML using attributes like NavBar, User Authentication (if Time Persists) - Done
    A. NavBar added
    B. Added Extra CSS to make the website look attractive.

**Included Garbage Collection in the Animate function by removing the bullets once they are out of frame by adjusting the projectile array and removing the bullets that have already been shot.
