// Some redundancies and inefficiencies in the codes, spent a little too much time on the unnecessary 
// stuffs.  Needed to move on to next projects. May come back to add some more interesting things in 
// the future. Ex,originally wanting to have the heart appear randomly but stuck on some issues i 
// created. So, took the easy way out, the heart shows up every round which loses the wow factor,lol.

// Enemy characters
var character = ['enemy-bug', 'char-cat-girl', 'char-horn-girl', 'char-pink-girl', 'char-princess-girl'];

// ** Enemy Class ** Enemies our player must avoid
var Enemy = function(x, y) {
    this.x = x;
    this.y = y;
    //Random speed & enemy characters
    this.speed = Math.floor(Math.random() * 300) + 100;
    this.sprite = 'images/' + character[Math.floor(Math.random() * character.length)] +'.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x > 505) {
        this.x = 0; 
    }
    // if player overlap enemies
    if (player.x < this.x + 60 && player.x + 30 > this.x && player.y < this.y + 25 && 30 + player.y > this.y) {
        dead = 1;
        deadplayer.x = player.x;
        deadplayer.y = player.y;
        hidePlayer();  // hide live player to avoid loop of -lives.  
        impact.play();      
        setTimeout(resetAll, 1200);
        live = live - 1;
        if (live === 0) {
            hidePlayer();
            setTimeout(newGame, 500);
         }
     }
};

// Draw the enemy on the screen, required method for game, also draw scores & # of lives left.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.font = "22px Snap ITC, Tahoma";
    ctx.fillStyle = "#A2A2A2";
    ctx.fillText("Score:  " + score + "   Lives:  " + live, 110, 45);      
};

// ** Player Class **
var Player = function(x, y, steps) {
    this.x = x;
    this.y = y;
    this.steps = steps;
    this.sprite = 'images/char-boy.png';
};

// Reset position,image of player when dead
Player.prototype.reset = function() {
    this.x = 202;  // reset to starting location
    this.y = 383;
    this.sprite = 'images/char-boy.png';
};

// Player scores/add lives and resets game ONLY if they carry heart or star.
Player.prototype.update = function() {

if (this.y < 0 && this.sprite == 'images/char-boy-heart.png') {
    win.play(); 
    live = live + 1;
    resetAll();
    }

if (this.y < 0 && this.sprite == 'images/char-boy-star.png'){
    win.play(); 
    score = score + 100;
    resetAll();
    }

if (this.y < 0 && this.sprite == 'images/char-boy-star-heart.png') {
    win.play(); 
    score = score + 100;
    live = live + 1;
    resetAll();
    }
};

// Draw the player on the screen, required method for game.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//Each step taken will occupy exactly 1 box (left,right+20)
//Keeps player within screen & disble movements when dead
Player.prototype.handleInput = function(keyPress) {
    if (keyPress == 'left' && dead == 0) {
        player.x -= player.steps + 20;
    }
    if (keyPress == 'up' && dead == 0) {
        player.y -= player.steps;
        backmusic.play(); //music play for chrome browser
    }
    if (keyPress == 'right' && dead == 0) {
        player.x += player.steps + 20;
    }
    if (keyPress == 'down' && dead == 0) {
        player.y += player.steps;
    }
    if (player.y > 383 && dead == 0) {
        player.y = 383;
    }
    if (player.y < 0 && dead == 0 && player.sprite == 'images/char-boy.png') {
        player.y = 63;
        deny.play();
    }      
    if (player.y < 0 && dead == 0 && (player.sprite =='images/char-boy-star.png' || player.sprite == 'images/char-boy-heart.png' || player.sprite == 'images/char-boy-star-heart.png')) {
        player.y = -10;  
    }
    if (player.x > 400 && dead == 0) {
        player.x = 400;
    }
    if (player.x < 2.5 && dead == 0) {
        player.x = 2.5;
    }
};

// ** Star Class **
// Generate random X,Y Star location 
var Star = function(x,y) {
    this.x = 100 * Math.floor(Math.random() * 5);
    this.y = [70,155,235][Math.floor(Math.random()*3)];
    this.sprite = 'images/star.png';
};
// Picking up star would show different image 
Star.prototype.update = function () {
    if (player.x < this.x + 60 && player.x + 30 > this.x && player.y < this.y + 25 && 30 + player.y > this.y) {
     hideStar();
     if (player.sprite == 'images/char-boy.png'){
        player.sprite = 'images/char-boy-star.png';
        pickup.play();
     }
     if (player.sprite == 'images/char-boy-heart.png'){
        player.sprite = 'images/char-boy-star-heart.png'; 
        pickup.play();   
     }
    }
};

Star.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// **Heart Class**
// Generate random X,Y Heart location 
var Heart = function(x,y) {
    this.x = 100 * Math.floor(Math.random() * 5);
    this.y = [70,155,235][Math.floor(Math.random()*3)];
    this.sprite = 'images/heart.png';
};
// Picking up heart would show different image 
Heart.prototype.update = function () {
    if (player.x < this.x + 60 && player.x + 30 > this.x && player.y < this.y + 25 && 30 + player.y > this.y) {
     hideHeart();     
     if (player.sprite == 'images/char-boy.png'){
        player.sprite = 'images/char-boy-heart.png';
        pickup.play();
     }
     if (player.sprite == 'images/char-boy-star.png'){
        player.sprite = 'images/char-boy-star-heart.png';
        pickup.play();
     }
    }
};

Heart.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

// **DeadPlayer Class** uses when player dies
var DeadPlayer = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/dead-char-boy.png';
};

DeadPlayer.prototype.update = function() {
};

// Shows different deadplayer images depending if or what was picked up
DeadPlayer.prototype.render = function() {
    if (player.sprite == 'images/char-boy.png'){
      ctx.drawImage(Resources.get(deadplayer.sprite), this.x, this.y);
    }
    if (player.sprite == 'images/char-boy-star.png'){
      ctx.drawImage(Resources.get(deadplayerstar.sprite), this.x, this.y);
    }
    if (player.sprite == 'images/char-boy-heart.png'){
      ctx.drawImage(Resources.get(deadplayerheart.sprite), this.x, this.y);
    }
    if (player.sprite == 'images/char-boy-star-heart.png'){
      ctx.drawImage(Resources.get(deadplayerstarheart.sprite), this.x, this.y); 
    }
};

// *Other additional DeadPlayer classes*
var DeadPlayerStar = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/dead-char-boy-star.png';
};

var DeadPlayerHeart = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/dead-char-boy-heart.png';
};

var DeadPlayerStarHeart = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/dead-char-boy-star-heart.png';
};

// New game, restarts score, lives
function newGame() {  
    alert("Game Over!  Your score is: " + score +".   Click OK to Restart Game");
    hideAllDeadPlayers();
    player.reset();
    live = 5;
    score = 0;
}

// Resets if player dies, populate random star & heart 
function resetAll() {         
    hideAllDeadPlayers(); 
    player.reset();
    dead = 0;
    starPopulate();
    heartPopulate();
}

// Populate heart once dead
function heartPopulate() {
    heart.x = 100 * Math.floor(Math.random() * 5);
    heart.y = [70,155,235][Math.floor(Math.random() * 3)];
}
// Populate star once dead
function starPopulate() {
    star.x = 100 * Math.floor(Math.random() * 5);
    star.y = [70,155,235][Math.floor(Math.random() * 3)];
}

// Hide objects at location 1000(offscreen)
function hideAllDeadPlayers() {
    deadplayer.x = 1000;
    deadplayer.y = 1000;
    deadplayerheart.x = 1000;
    deadplayerheart.y = 1000;
    deadplayerstar.x = 1000;
    deadplayerstar.y = 1000;
    deadplayerstarheart.x = 1000;
    deadplayerstarheart.y = 1000;
}

function hidePlayer() {
    player.x = 1000;
    player.y = 1000;
}

function hideStar() {
    star.x = 1000;
    star.y = 1000;
}

function hideHeart() {
    heart.x = 1000;
    heart.y = 1000;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = []; 
var score = 0;
var live = 5;
var dead = 0;
var j = 0;

// Background Music & sound effects
var backmusic = new Audio('sound/backmusic.mp3');
var pickup = new Audio('sound/pickup.mp3');
var impact = new Audio('sound/impact.mp3');
var win = new Audio('sound/win.mp3');
var deny = new Audio('sound/deny.mp3');
backmusic.loop = true;
backmusic.play();

// Player object variable. Also added additional object variables: 
// star, heart, deadplayer, deadplayerheart, deadplayerstar, deadplayerstarheart
var player = new Player(202, 383, 80);
var star = new Star(100, 400);
var heart = new Heart(100, 400);
var deadplayer = new DeadPlayer(1000, 1000);
var deadplayerheart = new DeadPlayerHeart(1000, 1000);
var deadplayerstar = new DeadPlayerStar(1000, 1000);
var deadplayerstarheart = new DeadPlayerStarHeart(1000, 1000);

for (var i = 0; i <= 2; i++) {
    var enemy = new Enemy(0, j = j + 75);
    allEnemies.push(enemy);
}

 // This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});