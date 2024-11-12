//частота обновления
UPDATE_TIME = 1000 / 60;
//таймер
let timer = null;

//получение холста
const cvs = document.getElementById("canvas");
//получение контекста
const ctx = cvs.getContext("2d");

let player = null;
let entities = null;

//подстраиваем холст под размер экрана при запуске
//делаем это перед инициализацией объектов сцены
resize();

//массив с фонами
const backgrounds = [
    new Background("src/sprites/background.png", 0),
    new Background("src/sprites/background.png", cvs.width)
];
//игрок
player = new Player("src/sprites/car.png", cvs.width / 2, cvs.height / 2);
//враги
entities = [
    new Entity("src/sprites/entity.png", cvs.width, 0)
];

//меню
let playMenu;
let recordsMenu;
let shareMenu;

window.addEventListener("keydown", keyDownHandler, false);
window.addEventListener("keyup", keyUpHandler, false);
window.addEventListener("resize", resize);
window.addEventListener("load", setActualScale);

game = new Game();

createMenu();

/**
 * Создание меню
 */
function createMenu() {
    //количество кнопок меню 
    const menuButtonsCount = 3;

    //запустим игру
    game.setStartGame(false);

    //размер шрифта
    const fontSize = cvs.width / 25;
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
        y: startMenuYPos - cvs.width / 25,
        w: cvs.width / menuButtonsCount + 1,
        h: cvs.height / (menuButtonsCount * 2)
    }, cvs.width / 25 + "px serif");

    recordsMenu = new PartMenu("Records", startMenuXPos, getStartMenuYPos(), {
        x: startMenuXPos - ((cvs.width / menuButtonsCount + 1) / 2),
        y: startMenuYPos - cvs.width / 25,
        w: cvs.width / menuButtonsCount + 1,
        h: cvs.height / (menuButtonsCount * 2)
    }, cvs.width / 25 + "px serif");

    shareMenu = new PartMenu("Share", startMenuXPos, getStartMenuYPos(), {
        x: startMenuXPos - ((cvs.width / menuButtonsCount + 1) / 2),
        y: startMenuYPos - fontSize,
        w: cvs.width / menuButtonsCount + 1,
        h: cvs.height / (menuButtonsCount * 2)
    }, cvs.width / 25 + "px serif");

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
 * Обработка событий по нажатию клавиш
 */
function keyDownHandler(e) {
    switch (e.keyCode) {
        case 37: //Влево
            player.getInputHandler().setLeftPress(true);
            break;
        case 39: //Вправо
            player.getInputHandler().setRightPress(true);
            break;
        case 38: //Вверх
            player.getInputHandler().setUpPress(true);
            break;
        case 40: //Вниз
            player.getInputHandler().setDownPress(true);
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
            player.getInputHandler().setLeftPress(false);
            break;
        case 39: //Вправо
            player.getInputHandler().setRightPress(false);
            break;
        case 38: //Вверх
            player.getInputHandler().setUpPress(false);
            break;
        case 40: //Вниз
            player.getInputHandler().setDownPress(false);
            break;
        case 27: //Esc
            break;
    }
}

/**
 * Запуск игры
 */
function play() {
    clear();

    resize();

    //запустим игру
    game.setStartGame(true);

    timer = setInterval(update, UPDATE_TIME);
}

/**
 * Рекорды
 */
function records() {
    clear();

    //отключим игру
    game.setStartGame(false);
}

/**
 * Поделиться
 */
function share() {
    clear();

    //отключим игру
    game.setStartGame(false);
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
    game.setStartGame(false);

    if (player.isDeath()) {
        ctx.font = (cvs.width / 40) +"px serif";
        ctx.textAlign = "center";
        ctx.strokeText("DEATH", cvs.width / 2, cvs.height / 2);
    }

    if (player.isWin()) {
        ctx.font = (cvs.width / 40) + "px serif";
        ctx.textAlign = "center";
        ctx.strokeText("WIN", cvs.width / 2, cvs.height / 2);
    }
}

/**
 * Пауза
 */
function pause() {
    if (game.isStartGame()) {
        game.setStartGame(false);
        clearInterval(timer);

        ctx.textAlign = "center";
        ctx.font = (cvs.width / 40) + "px serif";
        ctx.strokeText("PAUSE", cvs.width / 2, cvs.height / 2);
    } else {
        game.setStartGame(true);
        timer = setInterval(update, UPDATE_TIME);
    }
}

/**
 * Обновление кадра
 * Главный метод (с него всё начинается)
 */
function update() {
    if (player.getScale() === 0)
        return;

    backgrounds[0].update(backgrounds[1]);
    backgrounds[1].update(backgrounds[0]);

    draw();

    player.getInputHandler().move();

    //экран смерти
    if (player.getHealth() <= 0) {
        player.setDeath(true);
        stop(); // Перезагрузка страницы
    }

    if (game.getScore() >= game.getScoreToWin()) {
        player.setWin(true);
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

    let background;
    for (i = 0; i < backgrounds.length; i++) {
        background = backgrounds[i];
        drawBackground(background);

        if (game.getLevelScore >= 10) {
            background.setSpeed(background.getSpeed() + 0.5);
        }
    }

    drawPlayer(player);

    let entity;
    for (i = 0; i < entities.length; i++) {
        entity = entities[i];

        drawEntity(entity);

        // Отслеживание прикосновений
        if (player.x + (player.image.width * player.getScale()) >= entities[i].x
            && player.x <= entity.x + (entities[i].image.width * entity.getEntityScale())
            && player.y <= entity.y + (entities[i].image.height * entity.getEntityScale())
            && player.y + (player.image.height * player.getScale()) >= entities[i].y) {

            game.setScore(game.getScore() + 1);
            game.setLevelScore(game.getLevelScore() + 1);
            if (game.getLevelScore >= 10) {
                game.setLevelScore(0);
                entity.setEntityScale(entity.getEntityScale() + 0.5);
            }

            entity.x = cvs.width;
            entity.y = Math.floor(Math.random() * (cvs.height - (entities[i].image.height * entity.getEntityScale())));
        }
    }

    drawUi();
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
        cvs.height
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
        player.image.width * player.getScale(),
        player.image.height * player.getScale()
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
        entity.image.width * entity.getEntityScale(),
        entity.image.height * entity.getEntityScale()
    );

    //постройки двигаются синхронно с фоном
    entity.x = entity.x - entity.getSpeed();

    //если врага больше не видно (за границей экрана), выставляем его заново
    if (entity.x <= -entity.image.width * entity.getEntityScale()) {
        entity.x = cvs.width;
        entity.y = Math.floor(Math.random() * (cvs.height - (entity.image.height * entity.getEntityScale())));
        player.setHealth(player.getHealth() - 1);
    }
}

/**
 * Отрисовка UI
 */
function drawUi() {
    drawHealth();
    drawScore();
}

/**
 * Отрисовка жизней
 */
function drawHealth() {
    if (player.getHealth() > 0) {
        ctx.font = (cvs.width / 50) + "px serif";
        ctx.strokeText("HEALTH " + player.getHealth(), cvs.width * 0.10, cvs.width / 25);
    }
}

/**
 * Отрисовка жизней
 */
function drawScore() {
    if (player.getHealth() > 0) {
        ctx.font = (cvs.width / 50) + "px serif";
        ctx.strokeText("SCORE " + game.getScore(), cvs.width * 0.8, cvs.width / 25);
    }
}

/**
 * Подстраиваемся под размер экрана
 */
function resize() {
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;

    setActualScale();
}

/**
 * Устанавливаем актуальный коэффициент
 */
function setActualScale() {
    if (player != null && entities != null) {
        player.setScale(cvs.width / 7.5 / player.image.width);
        //корректируем скорость относительно размера экрана
        player.setSpeed(2.8 + (1920 / cvs.width) * 0.2);

        let entity;
        if (entities.length !== 0) {
            for (let i = 0; i < entities.length; i++) {
                entity = entities[i];

                entity.setEntityScale(cvs.width / 6 / entity.image.width);
            }
        }
    }
}
