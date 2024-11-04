/**
 * Противник
 */
class Entity {
    //коэффициент размера врагов
    entityScale = 0;

    constructor(imageUrl, x, y) {
        this.x = x;
        this.y = y;

        this.image = new Image();
        this.image.src = imageUrl;
    }

    getEntityScale() {
        return this.entityScale;
    }

    setEntityScale(value) {
        this.entityScale = value;
    }
}