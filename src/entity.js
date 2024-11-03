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