<template>
  <!-- <div id="app" @mousedown="addKeyPress" @mouseup="keyReleased"> -->
  <v-touch @press="addKeyPress" @pressup="keyReleased">
    <div id="app">
      <!-- <button @mousedown="addKeyPress" @mouseup="keyReleased">Press Me</button> -->

      <img v-show="false" ref="stickImg" src="./assets/yellow-circle.png" alt />

      <div class="score_wrapper">{{ score }}</div>

      <div id="game_window"></div>
    </div>
  </v-touch>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",

      score: 0,

      imageObj: new Image(),
      stickImageObj: new Image(),

      moveMyBasePiece2ToDefaultMyBasePiece1: false,
      moveMyBasePiece2ToNewPos: false,

      gameControls: true,

      renderedGamePiece: false,
      renderedStickPiece: false,

      myGameArea: {
        canvas: document.createElement("canvas"),
        start: () => {
          var that = this;
          console.log("this of myGameArea start", this);
          console.log("this of that Global", that);

          // this.myGameArea.canvas.width = 480;
          // this.myGameArea.canvas.height = 600;
          this.myGameArea.canvas.width = window.innerWidth;
          this.myGameArea.canvas.height = window.innerHeight;
          this.myGameArea.context = this.myGameArea.canvas.getContext("2d");
          // document.body.insertBefore(this.canvas, document.body.childNodes[0]);

          var app = document.querySelector("#game_window");
          console.log("game app", app);
          app.appendChild(this.myGameArea.canvas);
          // return

          // set background image
          /* var background = new Image();
                // background.src = "http://www.samskirrow.com/background.png";
                background.src = "https://i.pinimg.com/originals/7d/09/5a/7d095ae81e099c20e7db776ea1a6e2ea.gif";

                // Make sure the image is loaded first otherwise nothing will draw.
                background.onload = function(){
                    that.myGameArea.context.drawImage(background,0,0);
                }

                var canvas = document.querySelector("canvas")
                canvas.style.backgroundImage = "url('https://upload.wikimedia.org/wikipedia/commons/d/d7/Parallax_scroll.gif')";
                canvas.style.backgroundPosition = 'cover' */

          this.myGameArea.frameNo = 0;
          this.myGameArea.interval = setInterval(this.updateGameArea, 20);

          // Keyboard Even Listener
          window.addEventListener("keydown", function (e) {
            that.myGameArea.keys = that.myGameArea.keys || [];
            that.myGameArea.keys[e.keyCode] = e.type == "keydown";
          });
          window.addEventListener("keyup", function (e) {
            that.myGameArea.keys[e.keyCode] = e.type == "keydown";
            that.myGameArea.keyReleased = true;
          });
        },
        stop: function () {
          clearInterval(this.interval);
        },
        clear: () => {
          this.myGameArea.context.clearRect(
            0,
            0,
            this.myGameArea.canvas.width,
            this.myGameArea.canvas.height
          );
        },
      },

      myGamePiece: {
        type: "type",
        width: window.innerWidth / 10,
        height: window.innerHeight / 15,
        x: 60,
        y: 60,
        speedX: 0,
        speedY: 0,
        gravity: 0.5,
        gravitySpeed: 0,
        moved: false,
        needMove: false,
        color: "transparent",
        update: () => {
          var color = this.myGamePiece.color;
          var ctx = this.myGameArea.context;
          if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);

            // Test for image component
            // var imageObj = new Image();
            // imageObj.onload = function () {
            //     ctx.drawImage(imageObj, 0, 0, 50, 100);
            // };
            // imageObj.src = 'https://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';
          } else {
            ctx.fillStyle = color;
            ctx.fillRect(
              this.myGamePiece.x,
              this.myGamePiece.y,
              this.myGamePiece.width,
              this.myGamePiece.height
            );

            // Test for image component
            if (this.renderedGamePiece == false) {
              // var imageObj = new Image();
              var that = this;
              this.imageObj.onload = function () {
                ctx.drawImage(
                  that.imageObj,
                  that.myGamePiece.x,
                  that.myGamePiece.y,
                  that.myGamePiece.width,
                  that.myGamePiece.height
                );
              };
              // this.imageObj.src = 'https://s3.amazonaws.com/gameartpartnersimagehost/wp-content/uploads/edd/2015/08/Featured-Image5.png';
              // this.imageObj.src = 'http://54.153.23.209/hive_vue/hg/Featured-Image5-iloveimg-cropped.png';
              // this.imageObj.src = 'http://54.153.23.209/hive_vue/hg/convertible-iloveimg-cropped.png';
              this.imageObj.src =
                "https://www.pinclipart.com/picdir/big/8-89484_different-perspective-cliparts-toy-car-clipart-png-download.png";
              this.renderedGamePiece = true;
            }
            ctx.drawImage(
              this.imageObj,
              this.myGamePiece.x,
              this.myGamePiece.y,
              this.myGamePiece.width,
              this.myGamePiece.height
            );
          }
        },
        rotate: function () {
          ctx = stickPiece.context;
          //ctx.rotate(10);
          ctx.rotate((20 * Math.PI) / 180);
        },
        newPos: () => {
          this.myGamePiece.gravitySpeed += this.myGamePiece.gravity;
          this.myGamePiece.x += this.myGamePiece.speedX;
          this.myGamePiece.y +=
            this.myGamePiece.speedY + this.myGamePiece.gravitySpeed;
          this.myGamePiece.hitBottom();
        },
        hitBottom: () => {
          if (this.myGamePiece.type != "base") {
            var rockbottom =
              this.myGameArea.canvas.height - this.myGamePiece.height - 50;
            if (this.myGamePiece.y > rockbottom) {
              this.myGamePiece.y = rockbottom;
            }
          }
          if (this.myGamePiece.type == "base") {
            var rockbottom =
              this.myGameArea.canvas.height - this.myGamePiece.height;
            if (this.myGamePiece.y > rockbottom) {
              this.myGamePiece.y = rockbottom;
            }
          }
        },
        crashWith: (otherobj) => {
          var myleft = this.myGamePiece.x;
          var myright = this.myGamePiece.x + this.myGamePiece.width;
          var mytop = this.myGamePiece.y;
          var mybottom = this.myGamePiece.y + this.myGamePiece.height;
          var otherleft = otherobj.x;
          var otherright = otherobj.x + otherobj.width;
          var othertop = otherobj.y;
          var otherbottom = otherobj.y + otherobj.height;
          var crash = true;
          if (
            mybottom < othertop ||
            mytop > otherbottom ||
            myright < otherleft ||
            myright - 20 > otherright ||
            myleft > otherright ||
            myleft + 20 < otherleft
          ) {
            crash = false;
          }
          console.log("crashhhhh", crash);

          return crash;
        },
        move: () => {
          if (
            this.myGamePiece.x <=
            this.myStickPiece.width +
              this.myGamePiece.width +
              this.myGamePiece.width / 2
          ) {
            // console.log(
            //   "moving myGamePiece",
            //   this.myGamePiece.x,
            //   this.myStickPiece.width,
            //   parseInt(
            //     this.myStickPiece.width +
            //       this.myGamePiece.width +
            //       this.myGamePiece.width / 2
            //   )
            // );

            this.myGamePiece.x += 5;

            if (
              // this.myGamePiece.x ==
              this.myGamePiece.x >=
              parseInt(
                this.myStickPiece.width +
                  this.myGamePiece.width +
                  this.myGamePiece.width / 2
              )
            ) {
              this.myGamePiece.moved = true;
              this.myGamePiece.needMove = false;
              // enable controls
              this.gameControls = true;
            } else {
              this.myGamePiece.moved = false;
              this.gameControls = false;
            }

            if (
              this.myGamePiece.moved == true &&
              this.myGamePiece.crashWith(this.myBasePiece2)
            ) {
              console.log("myGamePiece landed on basePiece2");

              // Move Stick piece to end of game piece
              this.myStickPiece.x = this.myGamePiece.x + this.myGamePiece.width;
              // Set Stick Piece width to default
              this.myStickPiece.width = 10;
              // Set Stick Piece height to default
              this.myStickPiece.height = 10;

              this.resetGame();

              // Update score
              this.score += 1;

              // Move mybasepiece2 to mybasepiece1
              this.moveMyBasePiece2ToDefaultMyBasePiece1 = true;
            } else if (
              this.myGamePiece.moved == true &&
              !this.myGamePiece.crashWith(this.myBasePiece2)
            ) {
              console.log("myGamePiece not landed on basePiece2");

              // Alert Game over
              alert("game over");
              // this.resetGame()
              location.reload();
            }
          }
        },
      },

      myBasePiece: {
        type: "base",
        width: window.innerWidth / 10 + 10,
        height: 50,
        x: 55,
        y: 200,
        speedX: 0,
        speedY: 0,
        gravity: 0.5,
        gravitySpeed: 0,
        moved: false,
        needMove: false,
        color: "#0c3c54",
        update: () => {
          var color = this.myBasePiece.color;
          var ctx = this.myGameArea.context;
          if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);

            // Test for image component
            // var imageObj = new Image();
            // imageObj.onload = function () {
            //     ctx.drawImage(imageObj, 0, 0, 50, 100);
            // };
            // imageObj.src = 'https://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';
          } else {
            ctx.fillStyle = color;
            ctx.fillRect(
              this.myBasePiece.x,
              this.myBasePiece.y,
              this.myBasePiece.width,
              this.myBasePiece.height
            );
          }
        },
        rotate: function () {
          ctx = stickPiece.context;
          //ctx.rotate(10);
          ctx.rotate((20 * Math.PI) / 180);
        },
        newPos: () => {
          this.myBasePiece.gravitySpeed += this.myBasePiece.gravity;
          this.myBasePiece.x += this.myBasePiece.speedX;
          this.myBasePiece.y +=
            this.myBasePiece.speedY + this.myBasePiece.gravitySpeed;
          this.myBasePiece.hitBottom();
        },
        hitBottom: () => {
          if (this.myBasePiece.type != "base") {
            var rockbottom =
              this.myGameArea.canvas.height - this.myBasePiece.height - 50;
            if (this.myBasePiece.y > rockbottom) {
              this.myBasePiece.y = rockbottom;
            }
          }
          if (this.myBasePiece.type == "base") {
            var rockbottom =
              this.myGameArea.canvas.height - this.myBasePiece.height;
            if (this.myBasePiece.y > rockbottom) {
              this.myBasePiece.y = rockbottom;
            }
          }
        },
        crashWith: function (otherobj) {
          var myleft = this.x;
          var myright = this.x + this.width;
          var mytop = this.y;
          var mybottom = this.y + this.height;
          var otherleft = otherobj.x;
          var otherright = otherobj.x + otherobj.width;
          var othertop = otherobj.y;
          var otherbottom = otherobj.y + otherobj.height;
          var crash = true;
          if (
            mybottom < othertop ||
            mytop > otherbottom ||
            myright - 30 < otherleft ||
            myleft + 30 > otherright
          ) {
            crash = false;
          }
          return crash;
        },
        move: function () {
          if (this.x <= stickPiece.width + this.width * 3.5) {
            console.log("moving myBasePiece", this.x, stickPiece.width);
            this.x += 1;
            if (this.x == stickPiece.width + this.width * 3.5) {
              this.moved = true;
              this.needMove = false;
            } else {
              this.moved = false;
            }

            if (this.moved == true && this.crashWith(basePiece2)) {
              console.log("myBasePiece landed on basePiece2");

              // Move Stick piece to end of game piece
              stickPiece.x = this.x + this.width;
              // Set Stick Piece width to default
              stickPiece.width = 10;
              // Set Stick Piece height to default
              stickPiece.height = 20;
            } else if (this.moved == true && !this.crashWith(basePiece2)) {
              console.log("myBasePiece not landed on basePiece2");

              // Alert Game over
              alert("game over");
              location.reload();
            }
          }
        },
      },

      myBasePiece2: {
        type: "base",
        width: window.innerWidth / 10 + 100,
        height: 50,
        x: 355,
        y: 200,
        speedX: 0,
        speedY: 0,
        gravity: 0.5,
        gravitySpeed: 0,
        moved: false,
        needMove: false,
        color: "#0c3c54",
        update: () => {
          var color = this.myBasePiece2.color;
          var ctx = this.myGameArea.context;
          if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);

            // Test for image component
            // var imageObj = new Image();
            // imageObj.onload = function () {
            //     ctx.drawImage(imageObj, 0, 0, 50, 100);
            // };
            // imageObj.src = 'https://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';
          } else {
            ctx.fillStyle = color;
            ctx.fillRect(
              this.myBasePiece2.x,
              this.myBasePiece2.y,
              this.myBasePiece2.width,
              this.myBasePiece2.height
            );
          }
        },
        rotate: function () {
          ctx = stickPiece.context;
          //ctx.rotate(10);
          ctx.rotate((20 * Math.PI) / 180);
        },
        newPos: () => {
          this.myBasePiece2.gravitySpeed += this.myBasePiece2.gravity;
          this.myBasePiece2.x += this.myBasePiece2.speedX;
          this.myBasePiece2.y +=
            this.myBasePiece2.speedY + this.myBasePiece2.gravitySpeed;
          this.myBasePiece2.hitBottom();
        },
        hitBottom: () => {
          if (this.myBasePiece2.type != "base") {
            var rockbottom =
              this.myGameArea.canvas.height - this.myBasePiece2.height - 50;
            if (this.myBasePiece2.y > rockbottom) {
              this.myBasePiece2.y = rockbottom;
            }
          }
          if (this.myBasePiece2.type == "base") {
            var rockbottom =
              this.myGameArea.canvas.height - this.myBasePiece2.height;
            if (this.myBasePiece2.y > rockbottom) {
              this.myBasePiece2.y = rockbottom;
            }
          }
        },
        crashWith: function (otherobj) {
          var myleft = this.x;
          var myright = this.x + this.width;
          var mytop = this.y;
          var mybottom = this.y + this.height;
          var otherleft = otherobj.x;
          var otherright = otherobj.x + otherobj.width;
          var othertop = otherobj.y;
          var otherbottom = otherobj.y + otherobj.height;
          var crash = true;
          if (
            mybottom < othertop ||
            mytop > otherbottom ||
            myright - 30 < otherleft ||
            myleft + 30 > otherright
          ) {
            crash = false;
          }
          return crash;
        },
        move: function () {
          if (this.x <= stickPiece.width + this.width * 3.5) {
            console.log("moving myBasePiece2", this.x, stickPiece.width);
            this.x += 1;
            if (this.x == stickPiece.width + this.width * 3.5) {
              this.moved = true;
              this.needMove = false;
            } else {
              this.moved = false;
            }

            if (this.moved == true && this.crashWith(basePiece2)) {
              console.log("myBasePiece2 landed on basePiece2");

              // Move Stick piece to end of game piece
              stickPiece.x = this.x + this.width;
              // Set Stick Piece width to default
              stickPiece.width = 10;
              // Set Stick Piece height to default
              stickPiece.height = 20;
            } else if (this.moved == true && !this.crashWith(basePiece2)) {
              console.log("myBasePiece2 not landed on basePiece2");

              // Alert Game over
              alert("game over");
              location.reload();
            }
          }
        },
      },

      myStickPiece: {
        type: "stick",
        width: 10,
        height: 10,
        x: window.innerWidth / 10 + 60, //this.myGamePiece.width + this.myGamePiece.x,
        y: 60,
        speedX: 0,
        speedY: 0,
        gravity: 0.5,
        gravitySpeed: 0,
        moved: false,
        needMove: false,
        color: "transparent",
        update: () => {
          var color = this.myStickPiece.color;
          var ctx = this.myGameArea.context;
          if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);

            // Test for image component
            // var imageObj = new Image();
            // imageObj.onload = function () {
            //     ctx.drawImage(imageObj, 0, 0, 50, 100);
            // };
            // imageObj.src = 'https://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';
          } else {
            ctx.fillStyle = color;
            ctx.fillRect(
              this.myStickPiece.x,
              this.myStickPiece.y,
              this.myStickPiece.width,
              this.myStickPiece.height
            );

            // Test for image component
            if (this.renderedStickPiece == false) {
              // var imageObj = new Image();
              var that = this;
              this.stickImageObj.onload = function () {
                ctx.drawImage(
                  that.stickImageObj,
                  that.myStickPiece.x,
                  that.myStickPiece.y,
                  that.myStickPiece.width,
                  that.myStickPiece.height
                );
              };
              // this.stickImageObj.src = 'http://54.153.23.209/hive_vue/hg/Gold_circle.svg.png';
              // this.stickImageObj.src = "./assets/yellow-circle.png";
              this.stickImageObj.src =
                "https://clipartart.com/images/yellow-circle-png-clipart-1.jpg";
              this.renderedStickPiece = true;
            }
            ctx.drawImage(
              this.stickImageObj,
              this.myStickPiece.x,
              this.myStickPiece.y,
              this.myStickPiece.width,
              this.myStickPiece.height
            );
          }
        },
        rotate: function () {
          ctx = stickPiece.context;
          //ctx.rotate(10);
          ctx.rotate((20 * Math.PI) / 180);
        },
        newPos: () => {
          this.myStickPiece.gravitySpeed += this.myStickPiece.gravity;
          this.myStickPiece.x += this.myStickPiece.speedX;
          this.myStickPiece.y +=
            this.myStickPiece.speedY + this.myStickPiece.gravitySpeed;
          this.myStickPiece.hitBottom();
        },
        hitBottom: () => {
          if (this.myStickPiece.type != "base") {
            var rockbottom =
              this.myGameArea.canvas.height - this.myStickPiece.height - 50;
            if (this.myStickPiece.y > rockbottom) {
              this.myStickPiece.y = rockbottom;
            }
          }
          if (this.myStickPiece.type == "base") {
            var rockbottom =
              this.myGameArea.canvas.height - this.myStickPiece.height;
            if (this.myStickPiece.y > rockbottom) {
              this.myStickPiece.y = rockbottom;
            }
          }
        },
        crashWith: function (otherobj) {
          var myleft = this.x;
          var myright = this.x + this.width;
          var mytop = this.y;
          var mybottom = this.y + this.height;
          var otherleft = otherobj.x;
          var otherright = otherobj.x + otherobj.width;
          var othertop = otherobj.y;
          var otherbottom = otherobj.y + otherobj.height;
          var crash = true;
          if (
            mybottom < othertop ||
            mytop > otherbottom ||
            myright - 30 < otherleft ||
            myleft + 30 > otherright
          ) {
            crash = false;
          }
          return crash;
        },
        move: function () {
          if (this.x <= stickPiece.width + this.width * 3.5) {
            console.log("moving myStickPiece", this.x, stickPiece.width);
            this.x += 1;
            if (this.x == stickPiece.width + this.width * 3.5) {
              this.moved = true;
              this.needMove = false;
            } else {
              this.moved = false;
            }

            if (this.moved == true && this.crashWith(basePiece2)) {
              console.log("myStickPiece landed on basePiece2");

              // Move Stick piece to end of game piece
              stickPiece.x = this.x + this.width;
              // Set Stick Piece width to default
              stickPiece.width = 10;
              // Set Stick Piece height to default
              stickPiece.height = 20;

              this.resetGame();
            } else if (this.moved == true && !this.crashWith(basePiece2)) {
              console.log("myStickPiece not landed on basePiece2");

              // Alert Game over
              alert("game over");
              this.resetGame();

              // location.reload();
            }
          }
        },
      },
    };
  },

  methods: {
    testPress(e) {
      console.log("press", e);
    },

    startGame() {
      // myGamePiece = new component(30, 30, "red", 80, 60);
      // stickPiece = new component(10, 20, "yellow", myGamePiece.width + myGamePiece.x, 60);
      // basePiece = new component(60, 50, "black", 55, 200, 'base');
      // basePiece2 = new component(60, 50, "blue", 325, 100, 'base');

      // myScore = new component(60, 50, "green", 130, 150, "text");

      // ctx = myGameArea.context;
      // var imageObj = new Image();
      // imageObj.onload = function () {
      //     ctx.drawImage(imageObj, 69, 50);
      // };
      // imageObj.src = 'https://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';

      this.myGameArea.start();
    },

    // Update Game Area

    updateGameArea() {
      // console.log("updateGameArea running");
      this.myGameArea.clear();

      if (this.myGameArea.keys && this.myGameArea.keys[39]) {
        if (this.gameControls == true) {
          this.myStickPiece.height += 5;
          if (this.myStickPiece.width != 10) this.myStickPiece.width = 10;
        }
      }

      if (this.myGameArea.keyReleased == true) {
        if (this.gameControls == true) {
          this.myStickPiece.height += 1;
          //this.myStickPiece.rotate();
          this.myStickPiece.width = this.myStickPiece.height;
          this.myStickPiece.height = 10;
          this.myGameArea.keyReleased = false;

          this.myGamePiece.needMove = true;
          this.myGamePiece.move();
        }
      }

      if (
        this.myGamePiece.moved == false &&
        this.myGamePiece.needMove == true
      ) {
        // console.log("this.myGamePiece cur obj ", this.myGamePiece);
        this.myGamePiece.move();
        // this.myGameArea.stop();
      }

      this.myGamePiece.newPos();
      this.myGamePiece.update();

      this.myBasePiece.newPos();
      this.myBasePiece.update();

      this.myBasePiece2.newPos();
      this.myBasePiece2.update();

      this.myStickPiece.newPos();
      this.myStickPiece.update();
    },

    // Add key to coltroll
    addKeyPress(e) {
      e.preventDefault();
      console.log("key pressssssd");

      this.myGameArea.keys = this.myGameArea.keys || [];
      this.myGameArea.keys[39] = "keydown"; //(e.type == "keydown");
    },

    keyReleased(e) {
      e.preventDefault();
      this.myGameArea.keys[39] = "keydown"; //(e.type == "keydown");
      this.myGameArea.keyReleased = true;
      this.myGameArea.keys = [];
    },

    // Reset Game
    resetGame() {
      // console.log("Reset game");
      this.myGamePiece.x = 60;
      this.myBasePiece2.x =
        this.myBasePiece.x +
        this.myBasePiece.width +
        this.getRandomArbitrary(100, 560);
      this.myBasePiece2.width = this.getRandomArbitrary(
        window.innerWidth / 10,
        window.innerWidth / 5
      );
      this.myStickPiece.x = window.innerWidth / 10 + 60;
      this.myStickPiece.y = 60;
      this.myStickPiece.width = 10;
      this.myStickPiece.height = 10;
    },

    getRandomArbitrary(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
  },

  mounted() {
    this.startGame();
  },
};
</script>

<style>
div {
  user-select: none;
}

canvas {
  border: 1px solid black;
  background-image: url("https://upload.wikimedia.org/wikipedia/commons/d/d7/Parallax_scroll.gif");
  /* background-image: url('https://s3.amazonaws.com/gameartpartnersimagehost/wp-content/uploads/edd/2015/08/Featured-Image5.png'); */
  background-repeat: no-repeat;
  background-size: cover;
  background-position: bottom;
  background-color: #ccffff;
  width: 100% !important;
  height: 100% !important;
  /* max-width: 450px !important;
  max-height: 550px !important; */
}

.score_wrapper {
  position: absolute;
  /* top: 40%; */
  left: 0;
  right: 0;
  margin: auto;
  width: 100%;
  font-size: 150px;
  /* height: 100%; */
  opacity: 0.4;
  padding-top: 100px;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

h1,
h2 {
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
/*
@media only screen and (min-width: 500px) {
  canvas {
    max-width: 450px !important;
    max-height: 550px !important;
  }
}

@media only screen and (min-device-width: 375px) and (max-device-height: 667px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2) {
  canvas {
    max-width: 100% !important;
    max-height: 100% !important;
  }
} */
</style>
