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
     * Обновляем на основе нажатых клавиш
     */
    move(v, d) {
        //перемещение по оси y
        if (v === "y") {
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

            if (this.x < 0) {
                this.x = 0;
            }
        }
    }
}