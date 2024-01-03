import { Canvas } from "./Canvas";
import type { CanvasImage } from "./CanvasImage";
import type { LogicCanvas } from "./LogicCanvas";
import { images } from "./globalStore";
import { get } from "svelte/store";

export class RenderCanvas extends Canvas {
    private logicCanvas: LogicCanvas;
    private imageCache: { [key: number]: HTMLImageElement } = {};

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

        sortByLayer.forEach((image) => {
            if (image === selectedImage) {
                this.drawImage(image, true);
            } else {
                this.drawImage(image, false);
            }
        });
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

        this.context.drawImage(
            img,
            image.x,
            image.y,
            image.width,
            image.height
        );
    };
}
