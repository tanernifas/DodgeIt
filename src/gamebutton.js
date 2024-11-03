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