export class CanvasImage {
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
    image: string;
    constructor(x: number, y: number, width: number, height: number, image: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = `data:image/png;base64,${image}`;
    }
}