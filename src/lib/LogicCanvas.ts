import { Canvas } from "./Canvas";
import type { CanvasImage } from "./CanvasImage";
import type { RenderCanvas } from "./RenderCanvas";

export class LogicCanvas extends Canvas {
    renderCanvas: RenderCanvas;
    isDragging: boolean = false;
    startX: number = 0;
    startY: number = 0;

    constructor(
        canvas: HTMLCanvasElement,
        renderCanvas: RenderCanvas,
        borderWidth: number = 1,
        borderColor: string = "black"
    ) {
        super(canvas, borderWidth, borderColor);
        this.renderCanvas = renderCanvas;
    }

    drawBorder = (image: CanvasImage) => {
        this.context.beginPath();
        this.context.strokeStyle = this.borderColor;
        this.context.strokeRect(image.x, image.y, image.width, image.height);
    };

    drawCorners = (image: CanvasImage) => {
        this.context.beginPath();
        this.context.fillStyle = this.borderColor;
        this.context.fillRect(
            image.x - this.borderWidth / 2,
            image.y - this.borderWidth / 2,
            this.borderWidth,
            this.borderWidth
        );

        this.context.fillRect(
            image.x + image.width - this.borderWidth / 2,
            image.y - this.borderWidth / 2,
            this.borderWidth,
            this.borderWidth
        );

        this.context.fillRect(
            image.x - this.borderWidth / 2,
            image.y + image.height - this.borderWidth / 2,
            this.borderWidth,
            this.borderWidth
        );

        this.context.fillRect(
            image.x + image.width - this.borderWidth / 2,
            image.y + image.height - this.borderWidth / 2,
            this.borderWidth,
            this.borderWidth
        );
    };

    selectImage = (e: MouseEvent, image: CanvasImage) => {
        if (!this.renderCanvas.checkImage(e, image)) {
            this.renderCanvas.drawImage(image, false);
        } else {
            this.renderCanvas.drawImage(image, true);
        }
    };

    startDragging = (e: MouseEvent, image: CanvasImage) => {
        if (!this.renderCanvas.checkImage(e, image)) return;

        this.isDragging = true;

        this.startX = e.offsetX - image.x;
        this.startY = e.offsetY - image.y;
    };

    drag = (e: MouseEvent, image: CanvasImage) => {
        if (!this.isDragging) return;

        image.x = e.clientX - this.startX;
        image.y = e.clientY - this.startY;

        this.renderCanvas.drawImage(image, true);
    };

    stopDragging = (e: MouseEvent, image: CanvasImage) => {
        if (!this.isDragging) return;

        this.isDragging = false;

        this.renderCanvas.drawImage(image, false);
        console.log("stop dragging");
    };
}
