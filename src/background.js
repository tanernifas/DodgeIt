/**
 * Фон
 */
class Background {
    //скорость фона/ стоячих врагов
    backgroundSpeed = 4;
    
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

    getBackgroundSpeed() {
        return this.backgroundSpeed;
    }

    setBackgroundSpeed(value) {
        this.backgroundSpeed = value;
}
