<script lang="ts">
    import { onMount } from "svelte";
    import Canvas from "./lib/components/Canvas.svelte";
    import Menu from "./lib/components/Menu.svelte";
    import { images } from "./lib/globalStore";

    let image = "";

    let canvas: Canvas;
    let canvasContainer: HTMLDivElement;
    let width = 0, height = 0;

    $images = [];

    const createImage = (e: any) => {
        image = e.detail;
        canvas.createCanvas(image);
    };

    onMount(() => {
        width = canvasContainer.offsetWidth;
        height = canvasContainer.offsetHeight;
    });
</script>

<div class="container">
    <!-- <div class="canvas"> -->
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <!-- <img src="data:image/png;base64,{image}" alt="DALL-E Generated image" /> -->
    <!-- </div> -->
    <div class="canvas" bind:this={canvasContainer}>
        <Canvas bind:this={canvas} width={width - 10} height={height - 10} />
    </div>
    <div class="menu">
        <Menu bind:image on:imageCreated={createImage} />
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }

    .canvas {
        flex: 1;
    }
</style>


<!-- const startDrawing = (e: MouseEvent) => {
    isDrawing = true;
    draw(e);
};

const draw = (e: MouseEvent) => {
    if (!isDrawing) return;

    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
};

const stopDrawing = () => {
    isDrawing = false;
    ctx.beginPath();
}; -->