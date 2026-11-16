const app = new PIXI.Application();
const meteoriteList = [];

const gameContainer = document.getElementById('game-container');
if (gameContainer) {
    gameContainer.appendChild(app.view);
} else {
    document.body.appendChild(app.view);
}

document.body.style.margin = '0';
document.body.style.overflow = 'hidden';

const background = PIXI.Sprite.from('assets/background.png');
background.width = app.renderer.width;
background.height = app.renderer.height;
app.stage.addChild(background);

let score = 0;
const scoreText = new PIXI.Text('Score: 0', {
    fontFamily: 'Pixelify Sans',
    fontSize: 24,
    fill: 0xffffff, 
    align: 'left'
});
scoreText.x = 20;
scoreText.y = 20;
app.stage.addChild(scoreText);



let lives = 3; 


const livesText = new PIXI.Text('Lives: ❤️❤️❤️', {
    fontFamily: 'Pixelify Sans',
    fontSize: 24,
    fill: 0xff4757,
    fontWeight: 'bold'
});


livesText.x = 20;
livesText.y = 50;
app.stage.addChild(livesText);


function updateLivesDisplay() {
    let hearts = '';
    for (let i = 0; i < lives; i++) {
        hearts += '❤️';
    }
    
    livesText.text = 'Lives: ' + (hearts || '💀');
}

const backgroundMusic = new Audio('assets/music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.4; 
backgroundMusic.play().catch(error => {
    console.log("Autoplay blockiert – Musik startet beim ersten Tastendruck.");
});


const laserSound = new Audio('assets/laser.mp3'); 
laserSound.volume = 0.3; 

const rocket = PIXI.Sprite.from('assets/rocket.png');
rocket.x = 350;
rocket.y = 470;
rocket.scale.x = 0.09;
rocket.scale.y = 0.09;
app.stage.addChild(rocket);


let isInvulnerable = false;

gameInterval(function(){
    const meteorite = PIXI.Sprite.from('assets/meteorite' + random(1,2) + '.png');
    meteorite.x = random(0, 700);
    meteorite.y = -25;
    meteorite.scale.x = 0.13;
    meteorite.scale.y = 0.13;
    app.stage.addChild(meteorite);
    meteoriteList.push(meteorite);
    flyDown(meteorite, 1);

    waitForCollision(meteorite, rocket).then(function(){
        
        app.stage.removeChild(meteorite);
        const index = meteoriteList.indexOf(meteorite);
        if (index > -1) {
            meteoriteList.splice(index, 1);
        }

        
        if (isInvulnerable) return;

        
        lives -= 1;
        updateLivesDisplay();

        if (lives <= 0) {
            
            app.stage.removeChild(rocket);
            stopGame();
            if (typeof backgroundMusic !== 'undefined') {
                backgroundMusic.pause();
            }

            const gameOverText = new PIXI.Text('GAME OVER', {
                fontFamily: 'Pixelify Sans',
                fontSize: 48,
                fill: 0xff0000,
                fontWeight: 'bold'
            });
            gameOverText.x = (app.renderer.width - gameOverText.width) / 2;
            gameOverText.y = (app.renderer.height - gameOverText.height) / 2;
            app.stage.addChild(gameOverText);
        } else {
            
            isInvulnerable = true;

            let blinkCount = 0;
            const blinkInterval = setInterval(function() {
                
                rocket.alpha = (rocket.alpha === 1) ? 0.3 : 1;
                blinkCount++;

                
                if (blinkCount >= 10) {
                    clearInterval(blinkInterval);
                    rocket.alpha = 1;      
                    isInvulnerable = false; 
                }
            }, 150);
        }
    });

}, 1000);

function leftKeyPressed(){
    
    if (rocket.x > 0) {
        rocket.x = rocket.x - 5;
    }
}

function rightKeyPressed(){
    
    if (rocket.x < app.renderer.width - 50) {
        rocket.x = rocket.x + 5;
    }
}

function upKeyPressed(){
    
    if (rocket.y > 0) {
        rocket.y = rocket.y - 5;
    }
}

function downKeyPressed(){
    
    if (rocket.y < app.renderer.height - 70) {
        rocket.y = rocket.y + 5;
    }
}

function spaceKeyPressed(){
    backgroundMusic.play().catch(() => {});

    
    laserSound.currentTime = 0; 
    laserSound.play().catch(() => {});

     const bulletLeft = PIXI.Sprite.from('assets/bullet.png');
    
    bulletLeft.x = rocket.x + 5;
    bulletLeft.y = rocket.y; 
    bulletLeft.scale.x = 0.02;
    bulletLeft.scale.y = 0.02;
    app.stage.addChild(bulletLeft);
    flyUp(bulletLeft); 

    waitForCollision(bulletLeft, meteoriteList).then(function([bullet, meteorite]){
        app.stage.removeChild(bullet);
        app.stage.removeChild(meteorite);  

        const index = meteoriteList.indexOf(meteorite);
        if (index > -1) {
            meteoriteList.splice(index, 1);
        }

        score += 1;
        scoreText.text = 'Score: ' + score;
    });

    
    const bulletRight = PIXI.Sprite.from('assets/bullet.png');
    
    bulletRight.x = rocket.x + 45;
    bulletRight.y = rocket.y;
    bulletRight.scale.x = 0.02;
    bulletRight.scale.y = 0.02;
    app.stage.addChild(bulletRight);
    flyUp(bulletRight); 

    waitForCollision(bulletRight, meteoriteList).then(function([bullet, meteorite]){
        app.stage.removeChild(bullet);
        app.stage.removeChild(meteorite);  

        const index = meteoriteList.indexOf(meteorite);
        if (index > -1) {
            meteoriteList.splice(index, 1);
        }

        score += 1;
        scoreText.text = 'Score: ' + score;
    });
}
