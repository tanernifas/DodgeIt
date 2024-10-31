/**
 * Фон
 */
class Background {
    constructor(imageUrl, shift) {
        this.x = shift;
        this.y = 0;

        this.image = new Image();
        this.image.src = imageUrl;
    }

    /**
     * Обновляем фон на основе другого фон
     */
    update(background) {
        //при обновлении изображение смещаем на скорость
        this.x -= backgroundSpeed;

        //если изображение ушло за край холста, то меняем положение
        if (this.x < -cvs.width) {
            //новое положение указывается с учётом второго фона
            this.x = background.x + cvs.width - backgroundSpeed;
        }
    }
}

/**
 * Персонаж
 */
class Player {
    constructor(imageUrl, x, y) {
        this.x = x;
        this.y = y;

        this.image = new Image();
        this.image.src = imageUrl;
    }

    /**
     * Обновляем местоположение по x
     */
    update() {
        this.x += speed;
    }

    /**
     * Обновляем на основе нажатых клавиш
     */
    move(v, d) {
        //перемещение по оси y
        if(v == "y") {
            this.y += d; //смещение

            //если при смещении объект выходит за края холста, то изменения откатываются
            if (this.y + this.image.height * scale > cvs.height) {
                this.y -= d;
            }

            if (this.y < 0) {
                this.y = 0;
            }
        } else {//перемещение по оси x
            this.x += d;

            if (this.x + this.image.width * scale > cvs.width) {
                this.x -= d;
            }

            if(this.x < 0) {
                this.x = 0;
            }
        }
    }
}

/**
 * Противник
 */
class Entity {
    constructor(imageUrl, x, y) {
        this.x = x;
        this.y = y;

        this.image = new Image();
        this.image.src = imageUrl;
    }
}

/**
 * Объект меню
 */
class PartMenu {
    constructor(text, x, y, rect, font) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.rect = rect;
        this.font = font;
    }

    /**
     * Написать строку
     */
    strokeText() {
        ctx.font = this.font;
        ctx.strokeText(this.text, this.x, this.y);
    }

    /**
     * Написать залитую строку
     */
    fillText() {
        ctx.font = this.font;
        ctx.fillText(this.text, this.x, this.y);
    }

    /**
     * Проверка на нажатие/наведение
     */
    move(mousePosX, mousePosY) {
        if (mousePosX >= this.rect.x && mousePosX <= this.rect.x + this.rect.w &&
            mousePosY >= this.rect.y && mousePosY <= this.rect.y + this.rect.h) {
            return true;
        }
    }

    /**
     * Проверка на уход
     */
    over(mousePosX, mousePosY) {
        if (mousePosX >= this.rect.x && mousePosX <= this.rect.x + this.rect.w &&
            mousePosY >= this.rect.y && mousePosY <= this.rect.y + this.rect.h) {
            return true;
        }
    }
}

/**
 * Кнопка для управления
 */
class GameButton {
    constructor(text, rect) {
        this.text = text;
        this.rect = rect;
    }

    /**
     * Проверка на нажатие
     */
    move(mousePosX, mousePosY) {
        if (mousePosX >= this.rect.x && mousePosX <= this.rect.x + this.rect.w &&
            mousePosY >= this.rect.y && mousePosY <= this.rect.y + this.rect.h) {
            return true;
        }
    }

    /**
     * Проверка на уход
     */
    over(mousePosX, mousePosY) {
        if (mousePosX >= this.rect.x && mousePosX <= this.rect.x + this.rect.w &&
            mousePosY >= this.rect.y && mousePosY <= this.rect.y + this.rect.h) {
            return true;
        }
    }
}

//частота обновления
UPDATE_TIME = 1000 / 60;
//запущена игра
var startGame = false;
//жизни
var health = 5;
//очки
var score = 0;
//очки для смены уровня
var levelScore = 0;
//смерть
var death = false;
//победа
var win = false;

//получение холста
var cvs = document.getElementById("canvas");
//получение контекста
var ctx = cvs.getContext("2d");
//таймер
var timer = null;

//подстраиваем холст под размер экрана при запуске
//делаем это перед инициализацией объектов сцены
resize();

//массив с фонами
var backgrounds = [
    new Background("background.png", 0),
    new Background("background.png", cvs.width)
];
//игрок
var player = new Player("car.png", cvs.width / 2, cvs.height / 2, true);
//враги
var entities = [
    new Entity("entity.png", cvs.width, 0)
];

//коэффициент размера персонажа
var scale = 1;
//коэффициент размера врагов
var entityScale = 0.5;
//скорость
var speed = 5;
//скорость фона
var backgroundSpeed = 4;
//скорость подъема
var upSpeed = 3;
//коэффициент гравитации
var gravity = 0.5;

//использовать кнопки графического интерфейса для управления
var useGuiButtons = false;

var leftPress = false;
var rightPress = false;
var upPress = false;
var downPress = false;

//а также при изменении экрана
window.addEventListener("resize", resize);

window.addEventListener("keydown", keyDownHandler, false);
window.addEventListener("keyup", keyUpHandler, false);

createMenu();

////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////MENU///////////////////////////////////
////////////////////////////////////////////////////////////////////////////

/**
 * Создание меню
 */
function createMenu() {
    //итеративная функция распределения компонентов
    function getStartMenuYPos() {
        startMenuYPos += cvs.height / (3 * 2);
        return startMenuYPos;
    }

    //запустим игру
    startGame = false;

    //размер шрифта
    var fontSize = 48;
    ctx.font = fontSize + "px serif";

    //актуализация размеров экрана
    resize();

    //позиция компонента по X
    startMenuXPos = cvs.width / 2;
    //позиция компонента по Y
    startMenuYPos = cvs.height / (3 * 2);
    //положение текста по x
    ctx.textAlign = "center";

    playMenu = new PartMenu("Play", startMenuXPos, getStartMenuYPos(), {
        x: startMenuXPos - ((cvs.width / 4) / 2),
        y: startMenuYPos - fontSize,
        w: cvs.width / 4,
        h: cvs.height / (3 * 2)
    }, fontSize + "px serif");

    recordsMenu = new PartMenu("Records", startMenuXPos, getStartMenuYPos(), {
        x: startMenuXPos - ((cvs.width / 4) / 2),
        y: startMenuYPos - fontSize,
        w: cvs.width / 4,
        h: cvs.height / (3 * 2)
    }, fontSize + "px serif");

    shareMenu = new PartMenu("Share", startMenuXPos, getStartMenuYPos(), {
        x: startMenuXPos - ((cvs.width / 4) / 2),
        y: startMenuYPos - fontSize,
        w: cvs.width / 4,
        h: cvs.height / (3 * 2)
    }, fontSize + "px serif");

    //изначальная отрисовка меню
    playMenu.strokeText();
    recordsMenu.strokeText();
    shareMenu.strokeText();

    cvs.addEventListener('click', checkClick, false);
    cvs.addEventListener('mousemove', checkMove, false);
}

/**
 * Функция срабатывает при нажатии на левую кнопку мыши
 * Используется для меню
 */
function checkClick(e) {
    var mousePosX = e.clientX;
    var mousePosY = e.clientY;

    if (playMenu.move(mousePosX, mousePosY))
        play();

    if (recordsMenu.move(mousePosX, mousePosY))
        records();

    if (shareMenu.move(mousePosX, mousePosY))
        share();
}

/**
 * Функция срабатывает при наведении
 * Используется для меню
 */
function checkMove(e) {
    var mousePosX = e.clientX;
    var mousePosY = e.clientY;

    if (playMenu.move(mousePosX, mousePosY)) {
        //очистим экран
        clearCanvas();

        playMenu.fillText();
        recordsMenu.strokeText();
        shareMenu.strokeText();
    }

    if (recordsMenu.move(mousePosX, mousePosY)) {
        //очистим экран
        clearCanvas();

        playMenu.strokeText();
        recordsMenu.fillText();
        shareMenu.strokeText();
    }

    if (shareMenu.move(mousePosX, mousePosY)) {
        //очистим экран
        clearCanvas();

        playMenu.strokeText();
        recordsMenu.strokeText();
        shareMenu.fillText();
    }
}

/**
 * Запуск игры
 */
function play() {
    clear();

    resize();

    //запустим игру
    startGame = true;

    if (useGuiButtons) {
        //нопки для управления
        var buttonSize = cvs.width / 7;

        rectXPos = cvs.width * 0.05;
        rectYPos = cvs.height * 0.70;

        upButton = new GameButton("up", {
            x: rectXPos + buttonSize,
            y: rectYPos,
            w: buttonSize,
            h: buttonSize
        });
        downButton = new GameButton("down", {
            x: rectXPos + buttonSize,
            y: rectYPos + buttonSize,
            w: buttonSize,
            h: buttonSize
        });
        leftButton = new GameButton("left", {
            x: rectXPos,
            y: rectYPos + buttonSize,
            w: buttonSize,
            h: buttonSize
        });
        rightButton = new GameButton("right", {
            x: rectXPos + 2 * buttonSize,
            y: rectYPos + buttonSize,
            w: buttonSize,
            h: buttonSize
        });

	//для мыши    
        cvs.addEventListener('mousedown', checkPlayButtonDown, false);
        cvs.addEventListener('mouseup', checkPlayButtonUp, false);
	//для экрана
        cvs.addEventListener('touchstart', checkPlayButtonDown, false);
        cvs.addEventListener('touchend', checkPlayButtonUp, false);
    }

    timer = setInterval(update, UPDATE_TIME);
}

/**
 * Рекорды
 */
function records() {
    clear();

    //отключим игру
    startGame = false;
}

/**
 * Поделиться
 */
function share() {
    clear();

    //отключим игру
    startGame = false;
}

/**
 * Очистка всего
 */
function clear() {
    //очистим экран
    clearCanvas();

    //удалим листенеры
    cvs.removeEventListener('click', checkClick, false);
    cvs.removeEventListener('mousemove', checkMove, false);
    cvs.addEventListener('mousedown', checkPlayButtonDown, false);
    cvs.addEventListener('mouseup', checkPlayButtonUp, false);
    cvs.addEventListener('touchstart', checkPlayButtonDown, false);
    cvs.addEventListener('touchend', checkPlayButtonUp, false);
}

/**
 * Очистка экрана
 */
function clearCanvas() {
    //очистим экран
    ctx.clearRect(0, 0, cvs.width, cvs.height);
}

/**
 * Остановка
 */
function stop() {
    clearCanvas()

    //останавливаем
    clearInterval(timer);
	timer = null;

	//отключим игру
    startGame = false;

    if (death) {
        ctx.font = "32px serif";
	ctx.textAlign = "center";
        ctx.strokeText("DEATH", cvs.width / 2, cvs.height / 2);
    }

     if (win) {
        ctx.font = "32px serif";
	ctx.textAlign = "center";
        ctx.strokeText("HAPPY BIRTHDAY", cvs.width / 2, cvs.height / 2);
    }
}

/**
 * Пауза
 */
function pause() {

}

/**
 * Нажата кнопка мыши над кнопкой
 */
function checkPlayButtonDown(e) {
    var mousePosX = e.clientX;
    var mousePosY = e.clientY;

    if (upButton.move(mousePosX, mousePosY)) {
        upPress = true;
    }

    if (downButton.move(mousePosX, mousePosY)) {
        downPress = true;
    }

    if (leftButton.move(mousePosX, mousePosY)) {
        leftPress = true;
    }

    if (rightButton.move(mousePosX, mousePosY)) {
        rightPress = true;
    }
}

/**
 * Опущена кнопка мыши над кнопкой
 */
function checkPlayButtonUp(e) {
    var mousePosX = e.clientX;
    var mousePosY = e.clientY;

    if (upButton.over(mousePosX, mousePosY)) {
        upPress = false;
    }

        if (downButton.move(mousePosX, mousePosY)) {
        downPress = false;
    }

    if (leftButton.move(mousePosX, mousePosY)) {
        leftPress = false
    }

    if (rightButton.move(mousePosX, mousePosY)) {
        rightPress = false;
    }
}

////////////////////////////////////////////////////////////////////////////
/////////////////////////////////GAME_LOGIC/////////////////////////////////
////////////////////////////////////////////////////////////////////////////

/**
 * Обновление кадра
 * Главный метод (с него всё начинается)
 */
function update() {
    backgrounds[0].update(backgrounds[1]);
    backgrounds[1].update(backgrounds[0]);

    draw();

    move();

        //экран смерти
    if (health <= 0) {
       death = true;
       stop(); // Перезагрузка страницы
    }

    if (score >= 50) {
       win = true;
       stop();
    }
}

/**
 * Отрисовка всего во время игры
 */
function draw() {
    //очистка холста от предыдущего кадра
    clearCanvas();

    for (var i = 0; i < backgrounds.length; i++) {
        drawBackground(backgrounds[i]);
    }

    drawPlayer(player);

    for (var i = 0; i < entities.length; i++) {
        drawEntity(entities[i], cvs.width, entities[i].y);

        // Отслеживание прикосновений
        if (player.x + (player.image.width * scale) >= entities[i].x
            && player.x <= entities[i].x + (entities[i].image.width  * entityScale)
            && player.y <= entities[i].y + (entities[i].image.height * entityScale)
            && player.y + (player.image.height * scale) >= entities[i].y) {
            //health--;
            score++;
	    levelScore++;
	    if (levelScore >= 10) {
		    levelScore = 0;
		    backgroundSpeed += 0.5;
	    }

            entities[i].x = cvs.width;
            entities[i].y =  Math.floor(Math.random() * (cvs.height - (entities[i].image.height * entityScale)));
        }
    }

    drawHealth();

    drawScore();

    if (useGuiButtons)
    	drawGameButtons();
}

/**
 * Отрисовка фона
 */
function drawBackground(background) {
    ctx.drawImage
    (
        //изображение для отрисовки
        background.image,
        //начальное положение по оси X на изображении
        0,
        //начальное положение по оси Y на изображении
        0,
        //ширина изображения
        background.image.width,
        //высота изображения
        background.image.height,
        //положение по оси X на холсте
        background.x,
        //положение по оси Y на холсте
        background.y,
        //ширина изображения на холсте
        cvs.width,
        //так как ширина и высота фона одинаковые, в качестве высоты указывается ширина
        cvs.width
    );
}

/**
 * Отрисовка персонажа
 */
function drawPlayer(player) {
	ctx.drawImage
	(
		player.image,
		0,
		0,
		player.image.width,
		player.image.height,
		player.x,
		player.y,
		player.image.width * scale,
		player.image.height * scale
	);
}

/**
 * Отрисовка врагов
 */
function drawEntity(entity, x, y) {
    ctx.drawImage
    (
        entity.image,
        0,
        0,
        entity.image.width,
        entity.image.height,
        entity.x,
        entity.y,
        entity.image.width * entityScale,
        entity.image.height * entityScale
    );

    //постройки двигаются синхронно с фоном
    entity.x = entity.x - backgroundSpeed;

    //если врага больше не видно (за границей экрана), выставляем его заново
    if (entity.x <= -entity.image.width * entityScale) {
        entity.x = cvs.width;
        entity.y =  Math.floor(Math.random() * (cvs.height - (entity.image.height * entityScale)));
        health--;
    }
}

/**
 * Отрисовка жизней
 */
function drawHealth() {
    if (health > 0) {
        ctx.font = "32px serif";
        ctx.strokeText("HEALTH " + health, cvs.width * 0.15, 50);
    }
}

/**
 * Отрисовка жизней
 */
function drawScore() {
    if (health > 0) {
        ctx.font = "32px serif";
        ctx.strokeText("SCORE " + score, cvs.width * 0.85, 50);
    }
}

/**
 * Отрисовка кнопок
 */
function drawGameButtons() {
    ctx.rect(upButton.rect.x, upButton.rect.y, upButton.rect.w, upButton.rect.h);
    ctx.rect(downButton.rect.x, downButton.rect.y, downButton.rect.w, downButton.rect.h);
    ctx.rect(leftButton.rect.x, leftButton.rect.y, leftButton.rect.w, leftButton.rect.h);
    ctx.rect(rightButton.rect.x, rightButton.rect.y, rightButton.rect.w, rightButton.rect.h);

    ctx.stroke();
}

/**
 * Обработка событий по нажатию клавиш
 */
function keyDownHandler(e) {
    switch(e.keyCode)
    {
        case 37: //Влево
            leftPress = true;
            break;
        case 39: //Вправо
            rightPress = true;
            break;
        case 38: //Вверх
            upPress = true;
            break;
        case 40: //Вниз
            downPress = true;
            break;

        case 27: //Esc
            break;
    }
}

/**
 * Обработка событий по отпусканию клавиш
 */
function keyUpHandler(e) {
    switch(e.keyCode)
    {
        case 37: //Влево
            leftPress = false;
            break;
        case 39: //Вправо
            rightPress = false;
            break;
        case 38: //Вверх
            upPress = false;
            break;
        case 40: //Вниз
            downPress = false;
            break;

        case 27: //Esc
            break;
    }
}

/**
 * Движения персонажа
 * На основе нажатых кнопок
 */
function move() {
    if (leftPress) {
        player.move("x", -speed);
    }

    if (rightPress) {
        player.move("x", +speed);
    }

    if (upPress) {
        player.move("y", -upSpeed);
    }

    if (downPress) {
        player.move("y", +upSpeed);
    }
}

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////OTHER///////////////////////////////////
////////////////////////////////////////////////////////////////////////////

/**
 * Подстраиваемся под размер экрана
 */
function resize()
{
	cvs.width = window.innerWidth;
	cvs.height = window.innerHeight;
}
