/**
 * Персонаж
 */
class Player {
    //жизни
    health = 5;
    //смерть
    death = false;
    //победа
    win = false;
    //коэффициент размера персонажа
    scale = 0;
    //скорость персонажа
    speed = 5;
    //скорость подъема персонажа
    upSpeed = 3;

    constructor(imageUrl, x, y, inputHandler) {
        this.x = x;
        this.y = y;

        this.image = new Image();
        this.image.src = imageUrl;

        inputHandler = new InputHandler(this);
        this.inputHandler = inputHandler;
    }

    /**
     * Обновляем на основе нажатых клавиш
     */
    move(v, d) {
        //перемещение по оси y
        if (v === "y") {
            this.y += d; //смещение

            //если при смещении объект выходит за края холста, то изменения откатываются
            if (this.y + this.image.height * this.scale > cvs.height) {
                this.y -= d;
            }

            if (this.y < 0) {
                this.y = 0;
            }
        } else {//перемещение по оси x
            this.x += d;

            if (this.x + this.image.width * this.scale > cvs.width) {
                this.x -= d;
            }

            if (this.x < 0) {
                this.x = 0;
            }
        }
    }

    getHealth() {
        return this.health;
    }

    setHealth(value) {
        this.health = value;
    }

    isDeath() {
        return this.death;
    }

    setDeath(value) {
        this.death = value;
    }

    isWin() {
        return this.win;
    }

    setWin(value) {
        this.win = value;
    }

    getScale() {
        return this.scale;
    }

    setScale(value) {
        this.scale = value;
    }

    getSpeed() {
        return this.speed;
    }

    setSpeed(value) {
        this.speed = value;
    }

    getUpSpeed() {
        return this.upSpeed;
    }

    setUpSpeed(value) {
        this.upSpeed = value;
    }

    getInputHandler() {
        return this.inputHandler;
    }

    setInputHandler(value) {
        this.inputHandler = value;
    }
}