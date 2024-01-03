export class Canvas {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    borderWidth: number;
    borderColor: string;

    constructor(canvas: HTMLCanvasElement, borderWidth: number = 1, borderColor: string = 'black') {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
        this.borderWidth = borderWidth;
        this.borderColor = borderColor;
    }

    clear = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}