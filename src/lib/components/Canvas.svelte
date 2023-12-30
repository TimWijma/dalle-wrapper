<script lang="ts">
    import { onMount } from "svelte";
    import { CanvasImage } from "../CanvasImage";

    export let width: number, height: number;

    let drawCanvas: HTMLCanvasElement;
    let logicCanvas: HTMLCanvasElement;
    let drawCtx: CanvasRenderingContext2D;
    let logicCtx: CanvasRenderingContext2D;
    let isDrawing = false;

    let image: CanvasImage;

    export const createCanvas = (imageString: string) => {
        image = new CanvasImage(0, 0, 256, 256, imageString);

        drawImage(image);
    };

    const drawImage = (image: CanvasImage) => {
        const img = new Image();

        img.onload = () => {
            drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
            drawCtx.beginPath();
            drawCtx.strokeStyle = "red";
            drawCtx.strokeRect(image.x, image.y, image.width, image.height);
            drawCtx.drawImage(img, image.x, image.y, image.width, image.height);
        };

        img.src = image.image;
    };

    const checkImage = (e: any) => {
        console.log(e);

        console.log("Width range", image.x, image.x + image.width);
        console.log("Height range", image.y, image.y + image.height);
        console.log("Clicked at", e.offsetX, e.offsetY);

        if (!image) return;

        if (
            e.offsetX >= image.x &&
            e.offsetX <= image.x + image.width &&
            e.offsetY >= image.y &&
            e.offsetY <= image.y + image.height
        ) {
        }

        image.x = e.offsetX;
        image.y = e.offsetY;
        drawImage(image);
    };

    // const startDrawing = (e: MouseEvent) => {
    //     isDrawing = true;
    //     draw(e);
    // };

    // const draw = (e: MouseEvent) => {
    //     if (!isDrawing) return;

    //     ctx.lineWidth = 10;
    //     ctx.lineCap = "round";
    //     ctx.strokeStyle = "#000000";

    //     const rect = canvas.getBoundingClientRect();
    //     const x = e.clientX - rect.left;
    //     const y = e.clientY - rect.top;

    //     ctx.lineTo(x, y);
    //     ctx.stroke();
    //     ctx.beginPath();
    //     ctx.moveTo(x, y);
    // };

    // const stopDrawing = () => {
    //     isDrawing = false;
    //     ctx.beginPath();
    // };

    onMount(() => {
        drawCtx = drawCanvas.getContext("2d")!;
        logicCtx = logicCanvas.getContext("2d")!;
    });
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- <canvas
    bind:this={canvas}
    on:mousedown={startDrawing}
    on:mousemove={draw}
    on:mouseup={stopDrawing}
    on:mouseout={stopDrawing}
    {width}
    {height}
></canvas> -->

<canvas bind:this={drawCanvas} {width} {height}></canvas>

<canvas bind:this={logicCanvas} {width} {height} on:click={checkImage}></canvas>
