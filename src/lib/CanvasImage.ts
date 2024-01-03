export class CanvasImage {
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
    imageString: string;
    layer: number = 0;
    identifier: number = 0;
    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        imageString: string,
        layer: number,
        identifier: number
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.imageString = `data:image/png;base64,${imageString}`;
        this.layer = layer;
        this.identifier = identifier;
    }
}
