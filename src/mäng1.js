/**
 * Allikas/Autor: Caio Paiola (https://codepen.io/CaioPaiola/pen/nojJmQ)
 */
var Game      = Game      || {};
var Keyboard  = Keyboard  || {}; 
var Component = Component || {};

/**
 * Klaviatuuri koodide ja suundade vastavus (Keyboard Map)
 */
Keyboard.Keymap = {
  37: 'left', // Vasak nooleklahv
  38: 'up',   // Üles nooleklahv
  39: 'right', // Parem nooleklahv
  40: 'down'  // Alla nooleklahv
};

/**
 * Klaviatuuri sündmuste kontroller
 */
Keyboard.ControllerEvents = function() {
  
  // Seaded
  var self      = this;
  this.pressKey = null; // Hoia viimati vajutatud klahvi koodi
  this.keymap   = Keyboard.Keymap;
  
  // Klaviatuuri allavajutamise sündmus
  document.onkeydown = function(event) {
    self.pressKey = event.which; // Salvesta vajutatud klahvi kood (event.which)
  };
  
  // Tagastab suuna (nt 'left', 'up'), mis vastab vajutatud klahvile
  this.getKey = function() {
    return this.keymap[this.pressKey];
  };
};

/**
 * Mängukomponendi Lava (Stage)
 */
Component.Stage = function(canvas, conf) {  
  
  // Seaded
  this.keyEvent  = new Keyboard.ControllerEvents();
  this.width     = canvas.width;  // Lõuendi laius
  this.height    = canvas.height; // Lõuendi kõrgus
  this.length    = [];            // Ussi segmentide massiiv (keha pikkus)
  this.food      = {};            // Toidu koordinaadid
  this.score     = 0;             // Praegune skoor
  this.direction = 'right';       // Ussi algsuund
  this.conf      = {
    cw   : 10,  // Ühe ploki (lahtri) laius
    size : 5,   // Ussi algpikkus
    fps  : 1000 // Kaadreid sekundis (määrab liikumiskiiruse)
  };
  
  // Konfiguratsiooni ühendamine (Merge Conf)
  if (typeof conf == 'object') {
    for (var key in conf) {
      if (conf.hasOwnProperty(key)) {
        this.conf[key] = conf[key];
      }
    }
  }
  
};

/**
 * Mängukomponendi Uss (Snake)
 */
Component.Snake = function(canvas, conf) {
  
  // Mängu lava loomine
  this.stage = new Component.Stage(canvas, conf);
  
  // Ussi initsialiseerimine
  this.initSnake = function() {
    
    // Loob ussi vastavalt algsuurusele
    for (var i = 0; i < this.stage.conf.size; i++) {
      
      // Lisab ussi segmendid (x ja y koordinaadid)
      this.stage.length.push({x: i, y:0});
    }
  };
  
  // Kutsu ussi initsialiseerimine
  this.initSnake();
  
  // Toidu initsialiseerimine  
  this.initFood = function() {
    
    // Lisab toidu juhuslikule positsioonile laval
    this.stage.food = {
      // Juhuslik x-koordinaat lava piirides (lahtri kaupa)
      x: Math.round(Math.random() * (this.stage.width - this.stage.conf.cw) / this.stage.conf.cw), 
      // Juhuslik y-koordinaat lava piirides (lahtri kaupa)
      y: Math.round(Math.random() * (this.stage.height - this.stage.conf.cw) / this.stage.conf.cw), 
    };
  };
  
  // Kutsu toidu initsialiseerimine
  this.initFood();
  
  // Mängu taaskäivitamine
  this.restart = function() {
    this.stage.length            = [];
    this.stage.food              = {};
    this.stage.score             = 0;
    this.stage.direction         = 'right';
    this.stage.keyEvent.pressKey = null;
    this.initSnake();
    this.initFood();
  };
};

/**
 * Mängu joonistamine
 */
Game.Draw = function(context, snake) {
  
  // Lava joonistamine (mängutsükkel)
  this.drawStage = function() {
    
    // Kontrollib klahvivajutust ja määrab ussi uue suuna
    var keyPress = snake.stage.keyEvent.getKey(); 
    if (typeof(keyPress) != 'undefined') {
      snake.stage.direction = keyPress;
    }
    
    // Joonistab valge tausta
    context.fillStyle = "white";
    context.fillRect(0, 0, snake.stage.width, snake.stage.height);
    
    // Ussi pea praegused koordinaadid
    var nx = snake.stage.length[0].x;
    var ny = snake.stage.length[0].y;
    
    // Arvutab uue pea positsiooni vastavalt suunale
    switch (snake.stage.direction) {
      case 'right':
        nx++;
        break;
      case 'left':
        nx--;
        break;
      case 'up':
        ny--;
        break;
      case 'down':
        ny++;
        break;
    }
    
    // Kontrollib kokkupõrget (seinte või iseendaga)
    if (this.collision(nx, ny) == true) {
      snake.restart(); // Kokkupõrke korral taaskäivita mäng
      return;
    }
    
    // Ussi toitumise loogika
    if (nx == snake.stage.food.x && ny == snake.stage.food.y) {
      var tail = {x: nx, y: ny}; // Uus saba segment on uus pea positsioon
      snake.stage.score++;       // Suurenda skoori
      snake.initFood();          // Loo uus toit
    } else {
      var tail = snake.stage.length.pop(); // Eemaldab viimase saba segmendi
      tail.x   = nx;                     // Liigutab saba segmendi uuele pea positsioonile
      tail.y   = ny;  
    }
    snake.stage.length.unshift(tail); // Lisab uue segmendi ussi massiivi algusesse (saab uueks peaks)
    
    // Joonistab ussi
    for (var i = 0; i < snake.stage.length.length; i++) {
      var cell = snake.stage.length[i];
      this.drawCell(cell.x, cell.y); // Joonistab iga ussi segmendi
    }
    
    // Joonistab toidu
    this.drawCell(snake.stage.food.x, snake.stage.food.y);
    
    // Joonistab skoori lõuendi alaossa
    context.fillText('Score: ' + snake.stage.score, 5, (snake.stage.height - 5));
  };
  
  // Lahtri/segmendi joonistamine
  this.drawCell = function(x, y) {
    context.fillStyle = 'rgb(170, 170, 170)'; // Hall värv
    context.beginPath();
    // Joonistab ringi (ussil on ümarad punktid)
    context.arc((x * snake.stage.conf.cw + 6), (y * snake.stage.conf.cw + 6), 4, 0, 2*Math.PI, false);    
    context.fill();
  };
  
  // Kontrollib kokkupõrget seina või iseendaga
  this.collision = function(nx, ny) {  
    // Kontrollib, kas uus pea positsioon on väljaspool lava piire
    if (nx == -1 || nx == (snake.stage.width / snake.stage.conf.cw) || ny == -1 || ny == (snake.stage.height / snake.stage.conf.cw)) {
      return true; // Kokkupõrge seinaga
    }
    
    // Kontrollib kokkupõrget iseendaga (pole siin koodis implementeeritud, aga oleks siin)
    
    return false;    
  }
};


/**
 * Mängu Uss initsialiseerimine
 */
Game.Snake = function(elementId, conf) {
  
  // Seaded
  var canvas   = document.getElementById(elementId); // Lõuendi element
  var context  = canvas.getContext("2d");          // 2D joonistuskontekst
  var snake    = new Component.Snake(canvas, conf); // Ussi objekti loomine
  var gameDraw = new Game.Draw(context, snake);    // Joonistusobjekti loomine
  
  // Mängutsükli intervall (kutsub drawStage pidevalt välja)
  setInterval(function() {gameDraw.drawStage();}, snake.stage.conf.fps);
};


/**
 * Akna laadimisel käivitatav funktsioon
 */
window.onload = function() {
  // Loob uue Ussimängu eksemplari lõuendil 'stage' kiiruse 100ms ja algpikkusega 4
  var snake = new Game.Snake('stage', {fps: 100, size: 4});
};