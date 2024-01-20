import { Canvas } from "./Canvas";
import type { CanvasImage } from "./CanvasImage";
import type { LogicCanvas } from "./LogicCanvas";
import { images } from "./globalStore";
import { get } from "svelte/store";

export class RenderCanvas extends Canvas {
    logicCanvas: LogicCanvas;
    private imageCache: { [key: number]: HTMLImageElement } = {};
    private drawingFrame = get(images).find(
        (image) => image.identifier === -1
    )!;

    constructor(
        canvas: HTMLCanvasElement,
        logicCanvas: LogicCanvas,
        borderWidth: number = 1,
        borderColor: string = "black"
    ) {
        super(canvas, borderWidth, borderColor);
        this.logicCanvas = logicCanvas;
    }

    drawImages = (selectedImage: CanvasImage | null) => {
        const sortByLayer = get(images).sort((a, b) => a.layer - b.layer);

        this.clear();
        this.logicCanvas.clear();

        /**
         * Draw images by layer with low to higher
         * Draw selected image and drawing frame above the other images
         */
        sortByLayer.forEach((image) => {
            if (image === this.drawingFrame || image === selectedImage) return;

            this.drawImage(image, false);
        });
        this.drawImage(this.drawingFrame, this.drawingFrame === selectedImage);
        if (selectedImage) this.drawImage(selectedImage, true);
    };

    drawImage = (image: CanvasImage, border: boolean = false) => {
        let img = this.imageCache[image.identifier];

        if (!img) {
            new Promise((resolve, reject) => {
                img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => {
                    console.log("error loading image");
                    reject;
                };
                img.src = image.imageString;
                this.imageCache[image.identifier] = img;
            });
        }
        if (border) {
            this.logicCanvas.drawBorder(image);
            this.logicCanvas.drawCorners(image);
        }
        if (image === this.drawingFrame) {
            this.logicCanvas.drawBorder(image);
        }

        this.context.drawImage(
            img,
            image.x,
            image.y,
            image.width,
            image.height
        );
    };
}
