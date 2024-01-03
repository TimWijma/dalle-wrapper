import { Canvas } from "./Canvas";
import type { CanvasImage } from "./CanvasImage";
import type { LogicCanvas } from "./LogicCanvas";

export class RenderCanvas extends Canvas {
    logicCanvas: LogicCanvas;

    constructor(
        canvas: HTMLCanvasElement,
        logicCanvas: LogicCanvas,
        borderWidth: number = 1,
        borderColor: string = "black"
    ) {
        super(canvas, borderWidth, borderColor);
        this.logicCanvas = logicCanvas;
    }

    drawImage = (image: CanvasImage, border: boolean = false) => {
        const img = new Image();

        img.onload = () => {
            this.clear();
            this.logicCanvas.clear();

            if (border) {
                this.logicCanvas.drawBorder(image);
                this.logicCanvas.drawCorners(image);
            }

            this.context.drawImage(
                img,
                image.x,
                image.y,
                image.width,
                image.height
            );
        };

        img.src = image.imageString;
    };

    checkImage = (e: MouseEvent, image: CanvasImage): boolean => {
        if (!image) return false;

        if (
            e.offsetX >= image.x &&
            e.offsetX <= image.x + image.width &&
            e.offsetY >= image.y &&
            e.offsetY <= image.y + image.height
        ) {
            return true;
        }

        return false;
    };
}
