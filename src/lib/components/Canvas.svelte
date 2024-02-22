<script lang="ts">
    import { onMount, tick } from "svelte";
    import { CanvasImage } from "../CanvasImage";
    import { RenderCanvas } from "../RenderCanvas";
    import { LogicCanvas } from "../LogicCanvas";
    import { images, logicCanvas, renderCanvas } from "../globalStore";
    import { Canvas } from "../Canvas";

    // export let width: number, height: number;

    let width: number, height: number;

    let renderCanvasElement: HTMLCanvasElement,
        logicCanvasElement: HTMLCanvasElement,
        hiddenCanvasElement: HTMLCanvasElement;

    let hiddenCanvas: Canvas;

    const BORDER_WIDTH = 10;
    const BORDER_COLOR = "red"

    let canvasContainer: HTMLDivElement;

    export const createCanvas = (imageString: string) => {
        $images = $images.filter((image) => image.identifier === -1);
        addImage(250, 250, imageString);
        // addImage(200, 200, imageString);

        $renderCanvas.drawImages(null);
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

        $images.push(image);
        $renderCanvas.drawImages(null);
    };

    onMount(() => {
        width = logicCanvasElement.clientWidth;
        height = logicCanvasElement.clientHeight;

        hiddenCanvas = new Canvas(
            hiddenCanvasElement,
            BORDER_WIDTH,
            BORDER_COLOR
        );

        $renderCanvas = new RenderCanvas(
            renderCanvasElement,
            $logicCanvas,
            BORDER_WIDTH,
            BORDER_COLOR,
            hiddenCanvas
        );

        $logicCanvas = new LogicCanvas(
            logicCanvasElement,
            $renderCanvas,
            BORDER_WIDTH,
            BORDER_COLOR
        );
        $renderCanvas.logicCanvas = $logicCanvas;
    });
</script>

<svelte:window
    on:mousemove={$logicCanvas.drag}
    on:mouseup={$logicCanvas.stopDragging}
    on:resize={() => {
        $logicCanvas.resize(logicCanvasElement);
        $renderCanvas.resize(logicCanvasElement);
        hiddenCanvas.resize(logicCanvasElement);
    }}
/>

<div class="canvasContainer" bind:this={canvasContainer}>
    <canvas bind:this={renderCanvasElement} {width} {height}></canvas>
    <canvas
        bind:this={logicCanvasElement}
        on:mousedown={$logicCanvas.startDragging}
        on:mousemove={(e) => $logicCanvas.checkHover(e, false)}
        {width}
        {height}
    ></canvas>
    <canvas
        bind:this={hiddenCanvasElement}
        {width}
        {height}
        style="display: none;"
    ></canvas>
</div>

<style>
    canvas {
        position: absolute;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
    }

    .canvasContainer {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>
