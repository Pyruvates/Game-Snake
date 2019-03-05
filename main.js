const ctx = document.getElementById('canvas').getContext('2d');

const WidthCanvas  = +ctx.canvas.getAttribute('width');
const HeightCanvas = +ctx.canvas.getAttribute('height');

let score = document.getElementById('score');
let highscore = document.getElementById('highscore');

let intermediateScore = 0;

const cell = 20;

const KEYS = {
	LEFT:  37,
	UP:    38,
	RIGTH: 39,
	DOWN:  40
};

let snake = [
	{x: cell * 5, y: cell * 5},
	{x: cell * 5, y: cell * 6},
	{x: cell * 5, y: cell * 7},
];

const DIR = {
    UP:    {dx:   0, dy: -cell},
    RIGHT: {dx:  cell, dy:   0},
    DOWN:  {dx:   0, dy:  cell},
    LEFT:  {dx: -cell, dy:   0}
};

let apple = {
	x: Math.floor( (Math.random() * (WidthCanvas/cell)  ) ) * cell, // Math.floor(Math.random() * (max - min + 1)) + min;
	y: Math.floor( (Math.random() * (HeightCanvas/cell) ) ) * cell
};

let direction     = DIR.UP;
let old_direction = direction;



setInterval(gameLoop, 1000/10);

window.addEventListener('keydown', onkeydown);



function gameLoop () {
	update();
	render();	
};

function onkeydown (event) {
	if (event.keyCode === 37) {
		direction = DIR.LEFT;
	} else if (event.keyCode === 38) {
		direction = DIR.UP;
	} else if (event.keyCode === 39) {
		direction = DIR.RIGHT;
	} else if (event.keyCode === 40) {
		direction = DIR.DOWN;
	};
};

// update of objects position and score
function update () {
	if (direction === DIR.LEFT && old_direction != DIR.RIGHT) {
		old_direction = direction;
		moveSnake(direction);
	} else if (direction === DIR.RIGHT && old_direction != DIR.LEFT) {
		old_direction = direction;
		moveSnake(direction);
	} else if (direction === DIR.UP && old_direction != DIR.DOWN) {
		old_direction = direction;
		moveSnake(direction);
	} else if (direction === DIR.DOWN && old_direction != DIR.UP) {
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
		intermediateScore += 10;
		drawScore();
	};
	// overlap check: snake and tail
	for (let i = snake.length - 1; i > 4; i -= 1) {
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
	drawCell();
};

function moveSnake (direction) {
	let head = {
		x: snake[0].x + direction.dx,
		y: snake[0].y + direction.dy
	};

	if (head.x >= WidthCanvas) {
		head.x = 0;
	} else if (head.x < 0) {
		head.x = WidthCanvas - cell;
	};

	if (head.y >= HeightCanvas) {
		head.y = 0;
	} else if (head.y < 0) {
		head.y = HeightCanvas - cell;
	};

	snake.pop();
	snake.unshift(head);	
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

function drawCell () {
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

function drawScore () {
	score.innerHTML = 'Score: ' + intermediateScore;
};

function respawnApple () {
	apple.x = Math.floor( (Math.random() * (WidthCanvas/cell)  ) ) * cell;
	apple.y = Math.floor( (Math.random() * (HeightCanvas/cell) ) ) * cell;

	for (let i = snake.length - 1; i >= 0; i -=1) {
	 	if (apple.x === snake[i].x && apple.y === snake[i].y) {
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

	respawnApple();
	intermediateScore = 0;
	drawScore();
};

// overlap check. For example: snake and apple
function overlap (obj1, obj) {
	if (obj1.x === obj.x && obj1.y === obj.y) 
		return true;
	else 
		return false;
};