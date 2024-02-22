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
    const BORDER_COLOR = "red";

    let canvasContainer: HTMLDivElement;

    export const createCanvas = (imageString: string) => {
        $images = $images.filter((image) => image.identifier === -1);

        addImage(200, 200, imageString);
    };

    export const uploadImage = (image: File) => {
        let reader = new FileReader();

        reader.onload = () => {
            let img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
                let maxWidth = 450;
                let maxHeight = 450;

                if (img.width > maxWidth || img.height > maxHeight) {
                    let scale = Math.min(
                        maxWidth / img.width,
                        maxHeight / img.height
                    );
                    let newWidth = img.width * scale;
                    let newHeight = img.height * scale;

                    addImage(newWidth, newHeight, reader.result as string);
                } else {
                    addImage(img.width, img.height, reader.result as string);
                }
            };
        };

        reader.readAsDataURL(image);
    };

    const addImage = (width: number, height: number, imageString: string) => {
        const currentLayer = Math.max(...$images.map((i) => i.layer), -1);

        const image = new CanvasImage(
            200,
            350 - height / 2,
            width,
            height,
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

        $renderCanvas.drawImages($renderCanvas.drawingFrame);
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
