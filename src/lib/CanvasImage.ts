export class CanvasImage {
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
    imageString: string;
    constructor(x: number, y: number, width: number, height: number, imageString: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.imageString = `data:image/png;base64,${imageString}`;
    }
}