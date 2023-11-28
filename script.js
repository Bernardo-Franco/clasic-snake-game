class Game {
  snake = [];
  food = null;
  stage = null;
  direction = 2;
  sizeSquare = 10;
  canvas = null;

  head = new Image();
  tail = new Image();
  cookie = new Image();
  lose = new Image();
  victory = new Image();
  bite = new Audio('./images and sounds/sonidoMordisco.m4a');
  loseSound = new Audio('./images and sounds/loseSound.m4a');
  victorySound = new Audio('./images and sounds/victorySound.m4a');

  isLost = false;
  isVictory = false;

  detailDirection = ['', 'Arriba', 'Derecha', 'Abajo', 'Izquierda'];

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    this.head.src = '/images and sounds/snakeHead.PNG';
    this.tail.src = '/images and sounds/snakebody.png';
    this.cookie.src = '/images and sounds/rat.PNG';
    this.lose.src = '/images and sounds/perdiste.PNG';
    this.victory.src = '/images and sounds/victory.PNG';
  }
  start() {
    let square = new Object();
    square.X = 15;
    square.Y = 15;
    square.X_old = 15;
    square.Y_old = 15;
    this.snake.push(square);

    document.addEventListener('keypress', (e) => {
      switch (e.key) {
        case 'w':
          if (this.direction != 3) this.direction = 1;
          break;

        case 'd':
          if (this.direction != 4) this.direction = 2;
          break;

        case 's':
          if (this.direction != 1) this.direction = 3;
          break;

        case 'a':
          if (this.direction != 2) this.direction = 4;
          break;
      }
    });

    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (this.direction != 3) this.direction = 1;
          break;

        case 'ArrowRight':
          if (this.direction != 4) this.direction = 2;
          break;

        case 'ArrowDown':
          if (this.direction != 1) this.direction = 3;
          break;

        case 'ArrowLeft':
          if (this.direction != 2) this.direction = 4;
          break;
      }
    });
    this.stage = setInterval(() => {
      this.rules();
      if (this.isVictory) {
        this.victorySound.play();
        clearInterval(this.stage);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.victory, 0, 0, 576, 718, 0, 0, 300, 300);
      } else if (!this.isLost) {
        this.next();
        this.show();
      } else {
        this.loseSound.play();
        clearInterval(this.stage);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.lose, 288, 160, 300, 70, 47, 90, 200, 104);
      }
    }, 100);
  }

  next() {
    if (this.food == null) this.getFood();

    this.snake.map((square) => {
      square.X_old = square.X;
      square.Y_old = square.Y;
    });
    // new position of the head
    switch (this.direction) {
      case 1:
        this.snake[0].Y--;
        break;
      case 2:
        this.snake[0].X++;
        break;
      case 3:
        this.snake[0].Y++;
        break;
      case 4:
        this.snake[0].X--;
        break;
    }

    this.snake.map((square, index, snake_) => {
      if (index != 0) {
        square.X = snake_[index - 1].X_old;
        square.Y = snake_[index - 1].Y_old;
      }
    });

    if (this.food != null) {
      this.isEating();
    }
  }

  show() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.snake.map((square, i) => {
      if (i == 0) {
        this.ctx.drawImage(
          this.head,
          square.X * this.sizeSquare,
          square.Y * this.sizeSquare,
          10, //tamaño X imagen en el canvas
          10 //tamaño Y imagen en el canvas
        );
      } else {
        this.ctx.drawImage(
          this.tail,
          square.X * this.sizeSquare,
          square.Y * this.sizeSquare,
          10, //tamaño X imagen en el canvas
          10 //tamaño Y imagen en el canvas
        );
      }
      if (this.food != null) {
        this.ctx.drawImage(
          this.cookie,
          0,
          0,
          281,
          220,
          this.food.X * this.sizeSquare,
          this.food.Y * this.sizeSquare,
          21,
          16.5
        );
      }
    });
  }

  rules() {
    // check head collision with the body
    // for (let i = 0; i < this.snake.length; i++) {
    //   for (let j = 0; j < this.snake.length; j++) {
    //     if (i != j) {
    //       if (
    //         this.snake[i].X == this.snake[j].X &&
    //         this.snake[i].Y == this.snake[j].Y
    //       ) {
    //         this.isLost = true;
    //       }
    //     }
    //   }
    // }

    // check head collision with the body (optimized)
    for (let i = 0; i < this.snake.length; i++) {
      if (i != 0) {
        if (
          this.snake[0].X == this.snake[i].X &&
          this.snake[0].Y == this.snake[i].Y
        ) {
          this.isLost = true;
        }
      }
    }

    // if you get out of the area, you lose
    if (
      this.snake[0].X >= 30 ||
      this.snake[0].X < 0 ||
      this.snake[0].Y >= 30 ||
      this.snake[0].Y < 0
    ) {
      this.isLost = true;
    }
    if (this.snake.length == 140) {
      this.isVictory = true;
    }
  }

  isEating() {
    if (this.snake[0].X === this.food.X && this.snake[0].Y === this.food.Y) {
      this.bite.play();
      this.food = null;
      let square = new Object();
      square.X = this.snake[this.snake.length - 1].X_old;
      square.Y = this.snake[this.snake.length - 1].Y_old;

      this.snake.push(square);
    }
  }

  getFood() {
    let square = new Object();
    let generateRandomfoodPosition = () => {
      square.X = Math.floor(Math.random() * 28);
      square.Y = Math.floor(Math.random() * 28);
    };
    generateRandomfoodPosition();
    // if the food position is the same as the current position of the snake, rerun the genare random food position
    for (let i = 0; i < this.snake.length; i++) {
      if (this.snake[i].X == square.X && this.snake[i].Y == square.Y) {
        generateRandomfoodPosition();
        i = 0;
      }
    }
    this.food = square;
  }
}

// -------------------------------------------------------

let game = new Game(document.getElementById('canvas'));

game.start();
