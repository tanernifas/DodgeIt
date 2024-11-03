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