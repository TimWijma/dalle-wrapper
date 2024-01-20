<script lang="ts">
    import { onMount } from "svelte";
    import { CanvasImage } from "../CanvasImage";
    import { RenderCanvas } from "../RenderCanvas";
    import { LogicCanvas } from "../LogicCanvas";
    import { images, logicCanvas, renderCanvas } from "../globalStore";

    export let width: number, height: number;

    let drawCanvasElement: HTMLCanvasElement,
        logicCanvasElement: HTMLCanvasElement;

    const BORDER_WIDTH = 10;
    const BORDER_COLOR = "red";

    export const createCanvas = (imageString: string) => {
        $images = $images.filter((image) => image.identifier === -1);
        addImage(250, 250, imageString);
        // addImage(200, 200, imageString);
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
        $renderCanvas = new RenderCanvas(
            drawCanvasElement,
            $logicCanvas,
            BORDER_WIDTH,
            BORDER_COLOR
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
/>

<canvas bind:this={drawCanvasElement} {width} {height}></canvas>
<canvas
    {width}
    {height}
    bind:this={logicCanvasElement}
    on:mousedown={$logicCanvas.startDragging}
    on:mousemove={(e) => $logicCanvas.checkHover(e, false)}
    ></canvas>
    
<style>
    canvas {
        position: absolute;
        top: 0;
        left: 0;
    }
</style>
