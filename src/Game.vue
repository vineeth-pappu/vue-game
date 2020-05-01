<template>
  <div id="app">
   
   <div id="gamewindow">

   </div>
   
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',

    myGamePiece: null,
    myObstacles: [],
    myBasePiece: [],
    myScore: null,

    stickPiece: null,
    basePiece: null,
    basePiece2: null,


    myGameArea : {
        canvas : document.createElement("canvas"),
        start : () => {
            console.log('this of myGameArea', this)
            this.myGameArea.canvas.width = 480;
            this.myGameArea.canvas.height = 600;
            this.myGameArea.context = this.myGameArea.canvas.getContext("2d");
            var app = document.querySelector('#gamewindow');
            console.log('game app', app)
            app.appendChild(this.myGameArea.canvas);
            // document.body.insertBefore(this.canvas, document.body.childNodes[1]);
            // document.body.insertBefore(this.canvas, document.body.childNodes[1]);
            this.frameNo = 0;
            this.interval = setInterval(this.updateGameArea, 20);        
            
            // Keyboard Even Listener
            var that = this
            console.log('that of myGameArea', that)
            window.addEventListener('keydown', function (e) {
                that.myGameArea.keys = (that.myGameArea.keys || []);
                that.myGameArea.keys[e.keyCode] = (e.type == "keydown");
            })
            window.addEventListener('keyup', function (e) {
                that.myGameArea.keys[e.keyCode] = (e.type == "keydown");            
                that.myGameArea.keyReleased = true;            
            })

            
        },
        stop : function() {
            clearInterval(this.interval);
        },    
        clear : function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }




    }
  },

    methods: {

        // Start Game
        startGame() {
            this.myGamePiece = new this.component(30, 30, "red", 80, 60);
            this.stickPiece = new this.component(10, 20, "yellow", this.myGamePiece.width + this.myGamePiece.x, 60);
            this.basePiece = new this.component(60, 50, "black", 55, 200, 'base');
            this.basePiece2 = new this.component(60, 50, "blue", 325, 100, 'base');

            this.myScore = new this.component(60, 50, "green", 130, 150, "text");

            this.myGameArea.start();
        },

        // Create Component
        component : function(width, height, color, x, y, type) {
            console.log('this of component methos', this)
            var that = this

            this.type = type;
            this.width = width;
            this.height = height;
            this.x = x;
            this.y = y;    
            this.speedX = 0;
            this.speedY = 0;    
            this.gravity = 0.5;
            this.gravitySpeed = 0;
            this.moved = false;
            this.needMove = false;
            this.update = function() {
                ctx = that.myGameArea.context;
                if (this.type == "text") 
                {
                    ctx.font = this.width + " " + this.height;
                    ctx.fillStyle = color;
                    ctx.fillText(this.text, this.x, this.y);

                    // Test for image component
                    // var imageObj = new Image();
                    // imageObj.onload = function () {
                    //     ctx.drawImage(imageObj, 0, 0, 50, 100);
                    // };
                    // imageObj.src = 'https://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';


                } 
                else 
                {
                    ctx.fillStyle = color;
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                }
            }
            this.rotate = function() {
                ctx = that.stickPiece.context;
                //ctx.rotate(10);
                ctx.rotate(20*Math.PI/180);
            }
            this.newPos = function() {
                this.gravitySpeed += this.gravity;
                this.x += this.speedX;
                this.y += this.speedY + this.gravitySpeed;
                this.hitBottom();
            }
            this.hitBottom = () => {
                if(this.type != 'base')
                {
                var rockbottom = that.myGameArea.canvas.height - this.height-50;
                if (this.y > rockbottom) {
                    this.y = rockbottom;
                }
                }
                if(this.type == 'base')
                {
                var rockbottom = that.myGameArea.canvas.height - this.height;
                if (this.y > rockbottom) {
                    this.y = rockbottom;
                }
                }
            }
            this.crashWith = function(otherobj) {
                var myleft = this.x;
                var myright = this.x + (this.width);
                var mytop = this.y;
                var mybottom = this.y + (this.height);
                var otherleft = otherobj.x;
                var otherright = otherobj.x + (otherobj.width);
                var othertop = otherobj.y;
                var otherbottom = otherobj.y + (otherobj.height);
                var crash = true;
                if ((mybottom < othertop) || (mytop > otherbottom) || (myright-30 < otherleft) || (myleft+30 > otherright)) {
                    crash = false;
                }
                return crash;
            }
            this.move = function() {
                if(this.x <= this.stickPiece.width+(this.width*3.5)) {
                    console.log('moving myGamePiece', this.x, this.stickPiece.width)
                    this.x += 1;
                    if(this.x == this.stickPiece.width+(this.width*3.5)) {
                        this.moved = true
                        this.needMove = false;
                    } else {
                        this.moved = false
                    }

                    if (this.moved == true && this.crashWith(this.basePiece2)) {
                        console.log('myGamePiece landed on basePiece2')

                        // Move Stick piece to end of game piece
                        this.stickPiece.x = this.x + this.width;
                        // Set Stick Piece width to default
                        this.stickPiece.width = 10;
                        // Set Stick Piece height to default
                        this.stickPiece.height = 20;


                    } else if (this.moved == true && !this.crashWith(this.basePiece2)) {
                        console.log('myGamePiece not landed on basePiece2');

                        // Alert Game over
                        alert('game over');
                        location.reload();

                    }
                }
            }

        },


        // Update Game Area

        updateGameArea: function() {
            this.myGameArea.clear();

            if (this.stickPiece.crashWith(this.basePiece2) && this.myGamePiece.moved == false) {
                console.log('hit base');
                console.log('myGamePiece cur obj ', this.myGamePiece)
                this.myGamePiece.move();
                // this.myGameArea.stop();
            }

            if (this.myGamePiece.moved == false && this.myGamePiece.needMove == true) {
                console.log('this.myGamePiece cur obj ', this.myGamePiece)
                this.myGamePiece.move();
                // this.myGameArea.stop();
            }

            if (this.myGameArea.keys && this.myGameArea.keys[39]) {
                this.stickPiece.height += 2; 
                if(this.stickPiece.width != 10) this.stickPiece.width = 10; 
            }

            if (this.myGameArea.keyReleased == true) 
            {
                this.stickPiece.height += 1;
                //this.stickPiece.rotate();
                this.stickPiece.width = this.stickPiece.height;
                this.stickPiece.height = 10;
                this.myGameArea.keyReleased = false;

                this.myGamePiece.needMove = true;
            }



            // myGamePiece.newPos();
            // myGamePiece.update();


            this.basePiece.newPos();
            this.basePiece.update();
            this.basePiece2.newPos();
            this.basePiece2.update();
            this.stickPiece.newPos();
            this.stickPiece.update();



            /* var x, y;
            for (i = 0; i < myObstacles.length; i += 1) {
                if (myGamePiece.crashWith(myObstacles[i])) {
                    this.myGameArea.stop();
                    return;
                }
            }
            // this.myGameArea.clear();
            this.myGameArea.frameNo += 1;
            if (this.myGameArea.frameNo == 1 || everyinterval(150)) {
                x = this.myGameArea.canvas.width;
                y = this.myGameArea.canvas.height - 45;
                myObstacles.push(new component(10, 100, "green", x, y));
            }
            for (i = 0; i < myObstacles.length; i += 1) {
                myObstacles[i].x += -0.5;
                myObstacles[i].update();
            }
            // myGamePiece.newPos();
            // myGamePiece.update(); */



            // My Base Pieces
            var x, y;
            for (i = 0; i < this.myBasePieces.length; i += 1) {
                if (myGamePiece.crashWith(this.myBasePieces[i])) {
                    console.log(`myGamePiece crashWith this.myBasePieces ${[i]}`)
                    this.myGameArea.stop();
                    // return;
                }
            }
            // this.myGameArea.clear();
            this.myGameArea.frameNo += 1;
            if (this.myGameArea.frameNo == 1 || everyinterval(1050)) {
                x = this.myGameArea.canvas.width - 100;
                y = this.myGameArea.canvas.height - 50;
                this.myBasePieces.push(new component(getRandomArbitrary(48, 50), getRandomArbitrary(50, 80), "skyblue", x, y));
            }
            for (i = 0; i < this.myBasePieces.length; i += 1) {
                // control direction speed
                this.myBasePieces[i].x += -0.3;
                this.myBasePieces[i].update();
            }
            this.myGamePiece.newPos();
            this.myGamePiece.update();
                



            this.myScore.text = "SCORE: " + this.myGameArea.frameNo;
            // console.log('mygame area frame no.', this.myGameArea.frameNo, Math.floor(this.myGameArea.frameNo / 100))
            this.myScore.update();



        },
        


        everyinterval(n) {
            if ((this.myGameArea.frameNo / n) % 1 == 0) { return true; }
            return false;
        },


        getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        },


        grow() {
            console.log('fghjk');
            this.stickPiece.height += 1; 
        },


        clearmove() {
            this.stickPiece.height += 1; 
            this.stickPiece.height += 1; 
        },






    },

    mounted() {

        this.startGame()

    },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
