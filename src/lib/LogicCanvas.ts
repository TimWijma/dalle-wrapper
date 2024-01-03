import { get } from "svelte/store";
import { Canvas } from "./Canvas";
import type { CanvasImage } from "./CanvasImage";
import type { RenderCanvas } from "./RenderCanvas";
import { images } from "./globalStore";

export class LogicCanvas extends Canvas {
    private renderCanvas: RenderCanvas;
    private isDragging: boolean = false;
    private isResizing: boolean = false;
    private resizeDirection: string = "";
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

        this.checkHover(e, false);
    };

    startDragging = (e: MouseEvent) => {
        console.log("starting");

        this.checkHover(e, true);

        if (this.resizeDirection !== "") {
            this.isResizing = true;
            return;
        }

        console.log("not resizing");

        this.selectImage(e);
        if (!this.selectedImage) return;
        if (!this.checkImage(e, this.selectedImage)) return;

        this.isDragging = true;

        this.startX = e.offsetX - this.selectedImage.x;
        this.startY = e.offsetY - this.selectedImage.y;
    };

    drag = (e: MouseEvent) => {
        if (!this.selectedImage) return;

        if (this.isResizing) {
            this.resizeImage(e);
            return;
        }

        this.dragImage(e);
    };

    dragImage = (e: MouseEvent) => {
        if (!this.selectedImage || !this.isDragging) return;

        this.selectedImage.x = e.offsetX - this.startX;
        this.selectedImage.y = e.offsetY - this.startY;

        this.renderCanvas.drawImages(this.selectedImage);
    };

    resizeImage = (e: MouseEvent) => {
        if (!this.selectedImage || !this.isResizing) return;
        console.log("resizing");

        const { x, y, width, height } = this.selectedImage;
        const aspectRatio = width / height;

        let newWidth = 0;
        let newHeight = 0;

        if (this.resizeDirection === "nw") {
            newWidth = Math.max(
                width + (x - e.offsetX),
                width + (y - e.offsetY) * aspectRatio
            );
            newHeight = newWidth / aspectRatio;
            this.selectedImage.x = x + (width - newWidth);
            this.selectedImage.y = y + (height - newHeight);
        } else if (this.resizeDirection === "ne") {
            newWidth = Math.max(
                e.offsetX - x,
                width + (y - e.offsetY) * aspectRatio
            );
            newHeight = newWidth / aspectRatio;
            this.selectedImage.y = y + (height - newHeight);
        } else if (this.resizeDirection === "sw") {
            newWidth = Math.max(
                width + (x - e.offsetX),
                (e.offsetY - y) * aspectRatio
            );
            newHeight = newWidth / aspectRatio;
            this.selectedImage.x = x + (width - newWidth);
        } else if (this.resizeDirection === "se") {
            newWidth = Math.max(e.offsetX - x, (e.offsetY - y) * aspectRatio);
            newHeight = newWidth / aspectRatio;
        }

        this.selectedImage.width = newWidth;
        this.selectedImage.height = newHeight;
        this.renderCanvas.drawImages(this.selectedImage);
    };

    stopDragging = () => {
        console.log("stopping");

        if (!this.isDragging && !this.isResizing) return;

        this.isDragging = false;
        this.isResizing = false;
        this.resizeDirection = "";

        this.renderCanvas.drawImages(this.selectedImage);
    };

    isMouseOnCorner = (e: MouseEvent, x: number, y: number): boolean => {
        return (
            e.offsetX >= x - this.borderWidth &&
            e.offsetX <= x + this.borderWidth &&
            e.offsetY >= y - this.borderWidth &&
            e.offsetY <= y + this.borderWidth
        );
    };

    checkHover = (e: MouseEvent, setDirection: boolean = false) => {
        if (!this.selectedImage) return;

        const { x, y, width, height } = this.selectedImage;

        let direction = "";

        if (this.isMouseOnCorner(e, x, y)) {
            this.canvas.style.cursor = "nw-resize";
            direction = "nw";
        } else if (this.isMouseOnCorner(e, x + width, y)) {
            this.canvas.style.cursor = "ne-resize";
            direction = "ne";
        } else if (this.isMouseOnCorner(e, x, y + height)) {
            this.canvas.style.cursor = "sw-resize";
            direction = "sw";
        } else if (this.isMouseOnCorner(e, x + width, y + height)) {
            this.canvas.style.cursor = "se-resize";
            direction = "se";
        } else if (this.checkImage(e, this.selectedImage)) {
            this.canvas.style.cursor = "move";
            direction = "";
        } else {
            this.canvas.style.cursor = "default";
            direction = "";
        }

        if (setDirection) {
            this.resizeDirection = direction;
        }
    };
}
