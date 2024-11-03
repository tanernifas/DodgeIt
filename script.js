//частота обновления
UPDATE_TIME = 1000 / 60;
//таймер
let timer = null;

//запущена игра
let startGame = false;
//жизни
let health = 5;
//очки
let score = 0;
//очки для смены уровня
let levelScore = 0;
//количество очков для окончания игры
const scoreToWin = 75;
//смерть
let death = false;
//победа
let win = false;

//получение холста
const cvs = document.getElementById("canvas");
//получение контекста
const ctx = cvs.getContext("2d");

//подстраиваем холст под размер экрана при запуске
//делаем это перед инициализацией объектов сцены
resize();

//массив с фонами
const backgrounds = [
    new Background("src/sprites/background.png", 0),
    new Background("src/sprites/background.png", cvs.width)
];
//игрок
const player = new Player("src/sprites/car.png", cvs.width / 2, cvs.height / 2, true);
//враги
const entities = [
    new Entity("src/sprites/entity.png", cvs.width, 0)
];

//коэффициент размера персонажа
const scale = 1;
//скорость персонажа
const speed = 5;
//скорость подъема персонажа
const upSpeed = 3;

//коэффициент размера врагов
const entityScale = 0.5;
//скорость фона/ стоячих врагов
let backgroundSpeed = 4;

//использовать кнопки графического интерфейса для управления
const useGuiButtons = false;

//меню
let playMenu;
let recordsMenu;
let shareMenu;

//ui-кнопки
let rectXPos;
let rectYPos;
let upButton;
let downButton;
let leftButton;
let rightButton;

//переменные для определения нажатых кнопок
let leftPress = false;
let rightPress = false;
let upPress = false;
let downPress = false;

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
    //количество кнопок меню 
    const menuButtonsCount = 3;

    //запустим игру
    startGame = false;

    //размер шрифта
    const fontSize = 48;
    ctx.font = fontSize + "px serif";

    //актуализация размеров экрана
    resize();

    //позиция компонента по X
    let startMenuXPos = cvs.width / 2;
    //позиция компонента по Y
    let startMenuYPos = cvs.height / (menuButtonsCount * 2);

    //итеративная функция распределения компонентов
    function getStartMenuYPos() {
        startMenuYPos += cvs.height / (menuButtonsCount * 2);
        return startMenuYPos;
    }

    //положение текста по x
    ctx.textAlign = "center";

    playMenu = new PartMenu("Play", startMenuXPos, getStartMenuYPos(), {
        x: startMenuXPos - ((cvs.width / menuButtonsCount + 1) / 2),
        y: startMenuYPos - fontSize,
        w: cvs.width / menuButtonsCount + 1,
        h: cvs.height / (menuButtonsCount * 2)
    }, fontSize + "px serif");

    recordsMenu = new PartMenu("Records", startMenuXPos, getStartMenuYPos(), {
        x: startMenuXPos - ((cvs.width / menuButtonsCount + 1) / 2),
        y: startMenuYPos - fontSize,
        w: cvs.width / menuButtonsCount + 1,
        h: cvs.height / (menuButtonsCount * 2)
    }, fontSize + "px serif");

    shareMenu = new PartMenu("Share", startMenuXPos, getStartMenuYPos(), {
        x: startMenuXPos - ((cvs.width / menuButtonsCount + 1) / 2),
        y: startMenuYPos - fontSize,
        w: cvs.width / menuButtonsCount + 1,
        h: cvs.height / (menuButtonsCount * 2)
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
    const mousePosX = e.clientX;
    const mousePosY = e.clientY;

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
    const mousePosX = e.clientX;
    const mousePosY = e.clientY;

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
        const buttonSize = cvs.width / 7;

        rectXPos = cvs.width * 0.05;
        rectYPos = cvs.height * 0.70;

        upButton = new GameButton({
            x: rectXPos + buttonSize,
            y: rectYPos,
            w: buttonSize,
            h: buttonSize
        });
        downButton = new GameButton({
            x: rectXPos + buttonSize,
            y: rectYPos + buttonSize,
            w: buttonSize,
            h: buttonSize
        });
        leftButton = new GameButton({
            x: rectXPos,
            y: rectYPos + buttonSize,
            w: buttonSize,
            h: buttonSize
        });
        rightButton = new GameButton({
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
    if (useGuiButtons) {
        cvs.addEventListener('mousedown', checkPlayButtonDown, false);
        cvs.addEventListener('mouseup', checkPlayButtonUp, false);
        cvs.addEventListener('touchstart', checkPlayButtonDown, false);
        cvs.addEventListener('touchend', checkPlayButtonUp, false);
    }
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
    if (startGame) {
        startGame = false;
        clearInterval(timer);
    } else {
        startGame = true;
        timer = setInterval(update, UPDATE_TIME);
    }
}

/**
 * Нажата кнопка мыши над кнопкой
 */
function checkPlayButtonDown(e) {
    const mousePosX = e.clientX;
    const mousePosY = e.clientY;

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
    const mousePosX = e.clientX;
    const mousePosY = e.clientY;

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

    if (score >= scoreToWin) {
        win = true;
        stop();
    }
}

/**
 * Отрисовка всего во время игры
 */
function draw() {
    let i;
//очистка холста от предыдущего кадра
    clearCanvas();

    for (i = 0; i < backgrounds.length; i++) {
        drawBackground(backgrounds[i]);
    }

    drawPlayer(player);

    for (i = 0; i < entities.length; i++) {
        drawEntity(entities[i]);

        // Отслеживание прикосновений
        if (player.x + (player.image.width * scale) >= entities[i].x
            && player.x <= entities[i].x + (entities[i].image.width * entityScale)
            && player.y <= entities[i].y + (entities[i].image.height * entityScale)
            && player.y + (player.image.height * scale) >= entities[i].y) {

            score++;
            levelScore++;
            if (levelScore >= 10) {
                levelScore = 0;
                backgroundSpeed += 0.5;
            }

            entities[i].x = cvs.width;
            entities[i].y = Math.floor(Math.random() * (cvs.height - (entities[i].image.height * entityScale)));
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
function drawEntity(entity) {
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
        entity.y = Math.floor(Math.random() * (cvs.height - (entity.image.height * entityScale)));
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
    switch (e.keyCode) {
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
            pause();
            break;
    }
}

/**
 * Обработка событий по отпусканию клавиш
 */
function keyUpHandler(e) {
    switch (e.keyCode) {
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
function resize() {
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
}
