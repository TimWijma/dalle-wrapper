import { get } from "svelte/store";
import { Canvas } from "./Canvas";
import type { CanvasImage } from "./CanvasImage";
import type { RenderCanvas } from "./RenderCanvas";
import { images } from "./globalStore";

export class LogicCanvas extends Canvas {
    private renderCanvas: RenderCanvas;
    private isDragging: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private selectedImage: CanvasImage | null = null;

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

    checkImage = (e: MouseEvent, image: CanvasImage): boolean => {
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

    selectImage = (e: MouseEvent) => {
        let clickedImages = get(images).filter((image) =>
            this.checkImage(e, image)
        );

        if (clickedImages.length === 0) {
            this.selectedImage = null;
            this.renderCanvas.drawImages(null);
            return;
        }

        const clickedImage = clickedImages.reduce((highest, image) =>
            highest.layer > image.layer ? highest : image
        );

        let image = get(images).find((image) => image === clickedImage);
        if (image) {
            image.layer =
                Math.max(...get(images).map((image) => image.layer)) + 1;
        }

        if (image) {
            this.renderCanvas.drawImages(image);
        }

        this.selectedImage = image ?? null;

        this.checkHover(e);
    };

    startDragging = (e: MouseEvent) => {
        this.selectImage(e);
        if (!this.selectedImage) return;
        if (!this.checkImage(e, this.selectedImage)) return;

        this.isDragging = true;

        this.startX = e.offsetX - this.selectedImage.x;
        this.startY = e.offsetY - this.selectedImage.y;
    };

    drag = (e: MouseEvent) => {
        if (!this.isDragging || !this.selectedImage) return;

        this.selectedImage.x = e.clientX - this.startX;
        this.selectedImage.y = e.clientY - this.startY;

        // this.renderCanvas.drawImage(image, true);
        this.renderCanvas.drawImages(this.selectedImage);
    };

    stopDragging = () => {
        if (!this.isDragging) return;

        this.isDragging = false;

        this.renderCanvas.drawImages(this.selectedImage);
    };

    checkHover = (e: MouseEvent) => {
        if (!this.selectedImage) return;

        // if (
        //     e.offsetX >= this.selectedImage.x - 5 &&
        //     e.offsetX <= this.selectedImage.x + 5
        // ) {
        //     this.canvas.style.cursor = "w-resize";
        //     console.log("w-resize");
        // } else if (
        //     e.offsetX >= this.selectedImage.x + this.selectedImage.width - 5 &&
        //     e.offsetX <= this.selectedImage.x + this.selectedImage.width + 5
        // ) {
        //     this.canvas.style.cursor = "e-resize";
        //     console.log("e-resize");
        // } else if (
        //     e.offsetY >= this.selectedImage.y - 5 &&
        //     e.offsetY <= this.selectedImage.y + 5
        // ) {
        //     this.canvas.style.cursor = "n-resize";
        //     console.log("n-resize");
        // } else if (
        //     e.offsetY >= this.selectedImage.y + this.selectedImage.height - 5 &&
        //     e.offsetY <= this.selectedImage.y + this.selectedImage.height + 5
        // ) {
        //     this.canvas.style.cursor = "s-resize";
        //     console.log("s-resize");
        // } else if (this.checkImage(e, this.selectedImage)) {
        //     this.canvas.style.cursor = "move";
        // } else {
        //     this.canvas.style.cursor = "default";
        // }
    };
}
