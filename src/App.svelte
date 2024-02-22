<script lang="ts">
    import Canvas from "./lib/components/Canvas.svelte";
    import Menu from "./lib/components/Menu.svelte";
    import { images } from "./lib/globalStore";

    let canvas: Canvas;

    $images = $images.filter((image) => image.identifier === -1);

    const createImage = (e: any) => {
        let image = e.detail;

        canvas.uploadImage(image);
    };
</script>

<div class="container">
    <div class="canvas">
        <Canvas bind:this={canvas} />
    </div>
    <div class="menu">
        <Menu on:imageCreated={createImage} on:createCanvas={(e) => canvas.createCanvas(e.detail)} />
    </div>
</div>

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
        overflow: hidden;
    }

    .menu {
        z-index: 2;
    }
</style>
