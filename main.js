const ctx = document.getElementById('canvas').getContext('2d');

const KEYS = {LEFT:  37,
							UP:    38,
							RIGTH: 39,
							DOWN:  40};


var snake = [
	{x: 100, y: 100},
	{x: 100, y: 110},
	{x: 100, y: 120},
];

const DIR = {
    UP:    {dx:   0, dy: -10},
    RIGHT: {dx:  10, dy:   0},
    DOWN:  {dx:   0, dy:  10},
    LEFT:  {dx: -10, dy:   0}
};

let apple = {
	x: 100,
	y: 100
};

var direction = DIR.UP;
var old_direction = direction;

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

function loop () {
	update();
	render();

	//window.requestAnimationFrame(loop);
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

	if (overlap(snake[0], apple)) {
		console.log('OM-NOM-NOM!');
		//debugger;
		snake.splice(snake.length - 2, 0, {x: snake[snake.length - 2].x,
																			 y: snake[snake.length - 2].y});
		newApple();
	};

	for (let i = snake.length - 1; i > 2; i -= 1) {
		if (overlap(snake[0], snake[i])) {
			restart();
			break;
		};
	};
};

function render () {
	ctx.clearRect(0, 0, 400, 400);
	drawSnake();
	drawApple();
};

function moveSnake (direction) {
	let head = {x: snake[0].x + direction.dx, y: snake[0].y + direction.dy};

	if (head.x > 400) {
		head.x = 0;
	} else if (head.x < 0) {
		head.x = 390;
	};

	if (head.y > 400) {
		head.y = 0;
	} else if (head.y < 0) {
		head.y = 390;
	};

	snake.unshift(head);
	snake.pop();
};

function drawSnake () {
	ctx.fillStyle = 'yellow';
	for (let i = snake.length - 1; i >= 0; i -= 1) {
		ctx.fillRect(snake[i].x, snake[i].y, 10, 10);
		ctx.strokeStyle = 'black';
		ctx.strokeRect(snake[i].x, snake[i].y, 10, 10);
	};
};

function drawApple () {
	ctx.fillStyle = 'red';
	ctx.fillRect(apple.x, apple.y, 10, 10);
	ctx.strokeStyle = 'black';
	ctx.strokeRect(apple.x, apple.y, 10, 10);
};

function newApple () {
	apple.x = Math.floor( Math.random() * (39 + 0) + 0) * 10;
	apple.y = Math.floor( Math.random() * (39 + 0) + 0) * 10;
};

function restart () {
	snake = [
		{x: 100, y: 100},
		{x: 100, y: 110},
		{x: 100, y: 120},
	];

	direction = DIR.RIGHT;
	old_direction = direction;

	newApple();

};

// check 
function overlap (obj1, obj) {
	if (obj1.x === obj.x && obj1.y === obj.y) {
		return true;
	} else return false;
};

setInterval(loop, 1000/10);


window.addEventListener('keydown', onkeydown);