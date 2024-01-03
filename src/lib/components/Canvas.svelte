<script lang="ts">
    import { onMount } from "svelte";
    import { CanvasImage } from "../CanvasImage";
    import { testdata } from "../testdata";
    import { RenderCanvas } from "../RenderCanvas";
    import { LogicCanvas } from "../LogicCanvas";

    export let width: number, height: number;

    let drawCanvasElement: HTMLCanvasElement,
        logicCanvasElement: HTMLCanvasElement;
    let renderCanvas: RenderCanvas, logicCanvas: LogicCanvas;

    const BORDER_WIDTH = 10;
    const BORDER_COLOR = "red";

    let image = new CanvasImage(0, 0, 256, 256, "");

    export const createCanvas = (imageString: string) => {
        image = new CanvasImage(200, 200, 256, 256, imageString);

        renderCanvas.drawImage(image, false);
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
    on:mousemove={(e) => logicCanvas.drag(e, image)}
    on:mouseup={(e) => logicCanvas.stopDragging(e, image)}
/>

<canvas bind:this={drawCanvasElement} {width} {height}></canvas>
<canvas
    bind:this={logicCanvasElement}
    {width}
    {height}
    on:click={(e) => logicCanvas.selectImage(e, image)}
    on:mousedown={(e) => logicCanvas.startDragging(e, image)}
></canvas>

<style>
    canvas {
        position: absolute;
        top: 0;
        left: 0;
    }
</style>
