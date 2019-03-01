const ctx = document.getElementById('canvas').getContext('2d');

const WIDTH  = +ctx.canvas.getAttribute('width');
const HEIGHT = +ctx.canvas.getAttribute('height');

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
	x: cell * 5,
	y: cell * 9
};

let direction = DIR.UP;
let old_direction = direction;

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

function gameLoop () {

	update();
	render();
	
};

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
	};

	for (let i = snake.length - 1; i > 4; i -= 1) {
		if ( overlap(snake[0], snake[i]) ) {
			restart();
			break;
		};
	};
};

// draw objects
function render () {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	drawBackground();
	drawSnake();
	drawApple();
	drawCell();
};

function moveSnake (direction) {
	let head = {
		x: snake[0].x + direction.dx,
		y: snake[0].y + direction.dy
	};

	if (head.x >= WIDTH) {
		head.x = 0;
	} else if (head.x < 0) {
		head.x = WIDTH - cell;
	};

	if (head.y >= HEIGHT) {
		head.y = 0;
	} else if (head.y < 0) {
		head.y = HEIGHT - cell;
	};

	snake.unshift(head);
	snake.pop();
};

function drawSnake () {
	ctx.fillStyle = 'green';
	for (let i = snake.length - 1; i >= 0; i -= 1) {
		ctx.fillRect(snake[i].x, snake[i].y, cell, cell);
		//ctx.strokeStyle = 'black';
		//ctx.strokeRect(snake[i].x, snake[i].y, cell, cell);
	};
};

function drawApple () {
	ctx.fillStyle = '#e60000';
	ctx.fillRect(apple.x, apple.y, cell, cell);
	//ctx.strokeStyle = 'black';
	//ctx.strokeRect(apple.x, apple.y, cell, cell);
};

function drawCell () {
	ctx.strokeStyle = 'black';

	for (let i = WIDTH/cell; i >= 0; i -= 1) {
		for (let j = HEIGHT/cell; j >= 0; j -= 1) {
			ctx.strokeRect(i * cell, j * cell, cell, cell);
		};
	};
};

function drawBackground () {
	ctx.fillStyle = '#cce6ff';
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
};

function respawnApple () {
	apple.x = Math.floor( (Math.random() * (WIDTH/cell)  ) ) * cell; // Math.floor(Math.random() * (max - min + 1)) + min;
	apple.y = Math.floor( (Math.random() * (HEIGHT/cell) ) ) * cell;

	 for (let i = snake.length - 1; i >= 0; i -=1) {
	 	if (apple.x === snake[i].x && apple.y === snake[i].y) {
	 		apple.x = snake[snake.length - 1].x;
	 		apple.y = snake[snake.length - 1].y;
	 		break;
	  };
	 };
};

function restart () {
	snake = [
		{x: cell * 5, y: cell * 5},
		{x: cell * 5, y: cell * 6},
		{x: cell * 5, y: cell * 7}
	];

	direction = DIR.RIGHT;
	old_direction = direction;

	respawnApple();
};

// проверка на совпадение клеток. Например: змеи и яблока
function overlap (obj1, obj) {
	if (obj1.x === obj.x && obj1.y === obj.y) {
		return true;
	} else return false;
};

setInterval(gameLoop, 1000/10);


window.addEventListener('keydown', onkeydown);