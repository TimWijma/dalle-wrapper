import { get } from "svelte/store";
import { images } from "./globalStore";


export class Canvas {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    borderWidth: number;
    borderColor: string;
    drawingFrame = get(images).find(
        (image) => image.identifier === -1
    )!;

    constructor(
        canvas: HTMLCanvasElement,
        borderWidth: number = 1,
        borderColor: string = "black"
    ) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d", { willReadFrequently: true })!;
        this.borderWidth = borderWidth;
        this.borderColor = borderColor;
    }

    clear = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    resize(container: HTMLElement) {
        let imageData = this.context.getImageData(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;

        this.context.putImageData(imageData, 0, 0);
    };
}
