<script lang="ts">
    import { onMount } from "svelte";

    export let width: number, height: number;

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let isDrawing = false;

    export const createCanvas = (image: string) => {
        const base64img = `data:image/png;base64,${image}`;

        const img = new Image();

        img.onload = () => {
            ctx.drawImage(img, 0, 0, 256, 256);
        };

        img.src = base64img;
    };

    const startDrawing = (e: MouseEvent) => {
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
    };

    onMount(() => {
        ctx = canvas.getContext("2d")!;
    });
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<canvas
    bind:this={canvas}
    on:mousedown={startDrawing}
    on:mousemove={draw}
    on:mouseup={stopDrawing}
    on:mouseout={stopDrawing}
    {width}
    {height}
></canvas>
