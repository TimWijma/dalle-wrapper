<script lang="ts">
    import { onMount } from "svelte";
    import { CanvasImage } from "../CanvasImage";

    export let width: number, height: number;

    let drawCanvas: HTMLCanvasElement;
    let logicCanvas: HTMLCanvasElement;
    let drawCtx: CanvasRenderingContext2D;
    let logicCtx: CanvasRenderingContext2D;
    let isDragging = false;

    let image = new CanvasImage(0, 0, 256, 256, "");

    export const createCanvas = (imageString: string) => {
        image = new CanvasImage(200, 200, 256, 256, imageString);

        drawImage(image);
    };

    const drawImage = (image: CanvasImage) => {
        const img = new Image();

        img.onload = () => {
            clearCanvas();
            drawBorder(image);
            drawCtx.drawImage(img, image.x, image.y, image.width, image.height);
        };

        img.src = image.imageString;
    };

    const drawBorder = (image: CanvasImage) => {
        logicCtx.beginPath();
        logicCtx.strokeStyle = "red";
        logicCtx.strokeRect(image.x, image.y, image.width, image.height);
    };

    const clearCanvas = () => {
        drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
        logicCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    };

    const checkImage = (e: any): boolean => {
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

    let startX = 0;
    let startY = 0;
    const startDragging = (e: MouseEvent) => {
        if (!checkImage(e)) return;

        isDragging = true;

        startX = e.offsetX - image.x;
        startY = e.offsetY - image.y;
    };

    const drag = (e: MouseEvent) => {
        if (!isDragging) return;

        image.x = e.clientX - startX;
        image.y = e.clientY - startY;

        drawImage(image);
    };

    const stopDragging = () => {
        isDragging = false;
    };

    onMount(() => {
        drawCtx = drawCanvas.getContext("2d")!;
        logicCtx = logicCanvas.getContext("2d")!;
    });
</script>

<svelte:window on:mousemove={drag} on:mouseup={stopDragging} />

<canvas bind:this={drawCanvas} {width} {height}></canvas>
<canvas bind:this={logicCanvas} {width} {height} on:mousedown={startDragging}
></canvas>

<style>
    canvas {
        position: absolute;
        top: 0;
        left: 0;
    }
</style>
