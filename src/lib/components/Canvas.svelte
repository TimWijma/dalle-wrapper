<script lang="ts">
    import { onMount } from "svelte";
    import { CanvasImage } from "../CanvasImage";
    import { testdata } from "../testdata";
    import { RenderCanvas } from "../RenderCanvas";
    import { LogicCanvas } from "../LogicCanvas";
    import { images } from "../globalStore";

    export let width: number, height: number;

    let drawCanvasElement: HTMLCanvasElement,
        logicCanvasElement: HTMLCanvasElement,
        offScreenCanvasElement: HTMLCanvasElement;
    let renderCanvas: RenderCanvas,
        logicCanvas: LogicCanvas,
        offScreenCanvas: RenderCanvas;

    const BORDER_WIDTH = 10;
    const BORDER_COLOR = "red";

    let image = new CanvasImage(0, 0, 256, 256, "", 0, 0);

    export const createCanvas = (imageString: string) => {
        $images = [];
        addImage(250, 250, imageString);
        addImage(200, 200, imageString);
    };

    const addImage = (x: number, y: number, imageString: string) => {
        const currentLayer = Math.max(...$images.map((i) => i.layer), -1);

        const image = new CanvasImage(
            x,
            y,
            256,
            256,
            imageString,
            currentLayer + 1,
            $images.length
        );

        $images = [...$images, image];

        renderCanvas.drawImages(null);
    };

    onMount(() => {
        renderCanvas = new RenderCanvas(
            drawCanvasElement,
            logicCanvas,
            BORDER_WIDTH,
            BORDER_COLOR
        );
        logicCanvas = new LogicCanvas(
            logicCanvasElement,
            renderCanvas,
            BORDER_WIDTH,
            BORDER_COLOR
        );
        renderCanvas.logicCanvas = logicCanvas;
    });
</script>

<svelte:window
    on:mousemove={logicCanvas.drag}
    on:mouseup={logicCanvas.stopDragging}
/>

<div class="container">
    <canvas bind:this={drawCanvasElement} {width} {height}></canvas>
    <canvas
        bind:this={logicCanvasElement}
        {width}
        {height}
        on:click={logicCanvas.selectImage}
        on:mousedown={logicCanvas.startDragging}
        on:mousemove={logicCanvas.checkHover}
    ></canvas>
</div>

<canvas class="offscreen" bind:this={offScreenCanvasElement} {width} {height}
></canvas>

<style>
    .container {
        position: relative;
    }

    .container canvas {
        position: absolute;
        top: 0;
        left: 0;
    }

    .offscreen {
        display: none;
    }
</style>
