const ctx = document.getElementById('canvas').getContext('2d');

const WidthCanvas  = +ctx.canvas.getAttribute('width');
const HeightCanvas = +ctx.canvas.getAttribute('height');

let scoreText = document.getElementById('score');
let highscoreText = document.getElementById('highscore');

let score     = 0;
// load highscore
let highscore = localStorage['highscore'] || 0;

scoreText.innerHTML = 'Score: ' + score;
highscoreText.innerHTML = 'Highscore: ' + highscore;

// cell size
const cell = 20;

let snake = [
	{x: cell * 5, y: cell * 5},
	{x: cell * 5, y: cell * 6},
	{x: cell * 5, y: cell * 7},
];

const DIR = {
    up:    {dx:   0, dy: -cell},
    right: {dx:  cell, dy:   0},
    down:  {dx:   0, dy:  cell},
    left:  {dx: -cell, dy:   0}
};

let apple = {
	x: Math.floor( (Math.random() * (WidthCanvas/cell)  ) ) * cell, // Math.floor(Math.random() * (max - min + 1)) + min;
	y: Math.floor( (Math.random() * (HeightCanvas/cell) ) ) * cell
};

let direction     = DIR.up;
let old_direction = direction;



setInterval(gameLoop, 1000/10);

addEventListener('keydown', onKeyDown);



function gameLoop () {
	update();
	render();	
};

function onKeyDown (event) {
	if (event.keyCode        === 37) {
		direction = DIR.left;
	} else if (event.keyCode === 38) {
		direction = DIR.up;
	} else if (event.keyCode === 39) {
		direction = DIR.right;
	} else if (event.keyCode === 40) {
		direction = DIR.down;
	};
};

// update of objects position and score
function update () {
	if ( direction === DIR.left  && old_direction != DIR.right ) {
		old_direction = direction;
		moveSnake(direction);
	} else if ( direction === DIR.right && old_direction != DIR.left ) {
		old_direction = direction;
		moveSnake(direction);
	} else if ( direction === DIR.up    && old_direction != DIR.down ) {
		old_direction = direction;
		moveSnake(direction);
	} else if ( direction === DIR.down  && old_direction != DIR.up ) {
		old_direction = direction;
		moveSnake(direction);
	} else {
		moveSnake(old_direction);
	};

	// growth snake
	if ( overlap(snake[0], apple) ) {
		console.log('OM-NOM-NOM!');		
		snake.splice( snake.length - 2, 0, { x: snake[snake.length - 2].x, y: snake[snake.length - 2].y } );		
		respawnApple();

		// keep score
		score += 10;
		scoreText.innerHTML = 'Score: ' + score;
	};
	// overlap check: snake head and tail
	for (let i = snake.length - 1; i > 3; i -= 1) {
		if ( overlap(snake[0], snake[i]) ) {
			restartGame();
			break;
		};
	};
};

function render () {
	ctx.clearRect(0, 0, WidthCanvas, HeightCanvas);
	drawCanvasBackground();
	drawSnake();
	drawApple();
	drawNet();
};

function moveSnake (direction) {
	let head = {
		x: snake[0].x + direction.dx,
		y: snake[0].y + direction.dy
	};

	if (head.x >= WidthCanvas) {
		head.x = 0 - cell;
	} else if (head.x < 0) {
		head.x = WidthCanvas - cell;
	};

	if (head.y >= HeightCanvas) {
		head.y = 0 - cell;
	} else if (head.y < 0) {
		head.y = HeightCanvas - cell;
	};

	snake.pop();
	snake.unshift(head);	
};

// overlap check. For example: snake and apple
function overlap (obj1, obj2) {
	if (obj1.x === obj2.x && obj1.y === obj2.y) 
		return true;
};

function drawSnake () {
	ctx.fillStyle = '#003300';
	ctx.fillRect(snake[0].x, snake[0].y, cell, cell);

	ctx.fillStyle = '#009900';
	for (let i = snake.length - 1; i > 0; i -= 1) {
		ctx.fillRect(snake[i].x, snake[i].y, cell, cell);
	};
};

function drawApple () {
	ctx.fillStyle = '#e60000';
	ctx.fillRect(apple.x, apple.y, cell, cell);
};

function drawNet () {
	ctx.strokeStyle = 'black';
	for (let i = WidthCanvas/cell; i >= 0; i -= 1) {
		for (let j = HeightCanvas/cell; j >= 0; j -= 1) {
			ctx.strokeRect(i * cell, j * cell, cell, cell);
		};
	};
};

function drawCanvasBackground () {
	ctx.fillStyle = '#cce6ff';
	ctx.fillRect(0, 0, WidthCanvas, HeightCanvas);
};

function respawnApple () {
	apple.x = Math.floor( (Math.random() * (WidthCanvas/cell)  ) ) * cell;
	apple.y = Math.floor( (Math.random() * (HeightCanvas/cell) ) ) * cell;

	for (let i = snake.length - 1; i >= 0; i -=1) {
	 	if ( apple.x === snake[i].x && apple.y === snake[i].y ) {
	 		apple.x = snake[snake.length - 1].x;
	 		apple.y = snake[snake.length - 1].y;
	 		break;
	  };
	};
};

function restartGame () {
	snake = [
		{x: cell * 5, y: cell * 5},
		{x: cell * 5, y: cell * 6},
		{x: cell * 5, y: cell * 7}
	];

	direction     = DIR.up;
	old_direction = direction;
	
	// save highscore in cache
	if (score > highscore) {
		localStorage['highscore'] = score;
		highscore = localStorage['highscore'];
		highscoreText.innerHTML = 'Highscore: ' + highscore;
	};

	score = 0;
	scoreText.innerHTML = 'Score: ' + 0;	
	respawnApple();
};