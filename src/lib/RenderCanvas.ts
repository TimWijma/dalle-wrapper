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
    private hiddenCanvas: Canvas;

    constructor(
        canvas: HTMLCanvasElement,
        logicCanvas: LogicCanvas,
        borderWidth: number = 1,
        borderColor: string = "black",
        hiddenCanvas: Canvas
    ) {
        super(canvas, borderWidth, borderColor);
        this.logicCanvas = logicCanvas;
        this.hiddenCanvas = hiddenCanvas;
    }

    private getImageSrc = (image: CanvasImage): HTMLImageElement => {
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

        return img;
    };

    public drawImages = (selectedImage: CanvasImage | null) => {
        const sortByLayer = get(images).sort((a, b) => a.layer - b.layer);

        this.clear();
        this.logicCanvas.clear();

        this.drawImageFromHiddenCanvas();

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

    public drawImage = (image: CanvasImage, border: boolean = false) => {
        let img = this.getImageSrc(image);

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

    public updateHiddenCanvas = (newImage: string) => {
        const { width, height, x, y } = this.drawingFrame;
        const hiddenCtx = this.hiddenCanvas.context;

        // Get images which are contained in the drawing frame
        let containedImages: CanvasImage[] = [];
        get(images).forEach((image) => {
            if (image === this.drawingFrame) return;

            let overlapsLeft = image.x > x + width || x > image.x + image.width;
            let overlapsTop =
                image.y > y + height || y > image.y + image.height;

            if (overlapsLeft || overlapsTop) return;

            containedImages.push(image);
        });

        const sortByLayer = containedImages.sort((a, b) => a.layer - b.layer);

        // Once the image has been used for editting, it cant be moved around anymore because its not a proper rectangle anymore
        sortByLayer.forEach((image) => {
            let img = this.getImageSrc(image);

            hiddenCtx.drawImage(
                img,
                image.x,
                image.y,
                image.width,
                image.height
            );

            images.set(
                get(images).filter((i) => i.identifier !== image.identifier)
            );
        });

        let img = new Image();
        img.src = `data:image/png;base64,${newImage}`;
        img.onload = () => {
            hiddenCtx.drawImage(img, x, y, width, height);
            this.drawImages(this.drawingFrame);
        };

        console.log("hidden canvas updated");
    };

    private drawImageFromHiddenCanvas = () => {
        console.log("drawing from hidden canvas");

        this.context.drawImage(this.hiddenCanvas.canvas, 0, 0);
    };
}
