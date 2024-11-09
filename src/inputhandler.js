/**
 * Обработчик нажатий для персонажа
 */
class InputHandler {

    //переменные для определения нажатых кнопок
    leftPress = false;
    rightPress = false;
    upPress = false;
    downPress = false;

    constructor(player) {
        this.player = player;
    }

    /**
     * Движения персонажа
     * На основе нажатых кнопок
     */
    move() {
        if (this.leftPress) {
            this.player.move("x", -this.player.getSpeed());
        }

        if (this.rightPress) {
            this.player.move("x", +this.player.getSpeed());
        }

        if (this.upPress) {
            this.player.move("y", -this.player.getUpSpeed());
        }

        if (this.downPress) {
            this.player.move("y", +this.player.getUpSpeed());
        }
    }

    isLeftPress() {
        return this.leftPress;
    }

    setLeftPress(value) {
        this.leftPress = value;
    }

    isRightPress() {
        return this.rightPress;
    }

    setRightPress(value) {
        this.rightPress = value;
    }

    isUpPress() {
        return this.upPress;
    }

    setUpPress(value) {
        this.upPress = value;
    }

    isDownPress() {
        return this.downPress;
    }

    setDownPress(value) {
        this.downPress = value;
    }
}