<script lang="ts">
    import { testdata } from "../testdata";
    import { logicCanvas, renderCanvas } from "../globalStore";
    import { createEventDispatcher } from "svelte";
    import { OpenAIController } from "../OpenAIController";

    const dispatch = createEventDispatcher();

    let apiKey = localStorage.getItem("openai-api-key") || "";
    let openai = new OpenAIController(apiKey);

    let prompt = "An ocean with mountains in the background and a sunset sky.";

    const createImage = async () => {
        let image = testdata.data[0].b64_json || "";

        dispatch("createCanvas", image);
    };

    const generateFrame = async () => {
        console.log("generate frame");

        const maskBlob = await $logicCanvas.getBlob();
        if (maskBlob) {
            let newImage = await openai.outpaint(maskBlob, prompt);
            if (newImage) {
                $renderCanvas.updateHiddenCanvas(newImage);
            } else {
                console.log("no new image");
            }
        } else {
            console.log("no blob");
        }
    };

    let fileInput: HTMLInputElement;
    const loadFile = (event: any) => {
        console.log(event.target.files[0]);
        

        dispatch("imageCreated", event.target.files[0]);
    };
</script>

<div class="container">
    <button on:click={createImage}>Create test image</button>

    <span>API key</span>
    <input
        bind:value={apiKey}
        placeholder="API key"
        on:input={() => {
            openai = new OpenAIController(apiKey);
            localStorage.setItem("openai-api-key", apiKey);
        }}
    />

    <input
        type="file"
        bind:this={fileInput}
        accept="image/*"
        name="image"
        id="file"
        on:change={loadFile}
        style="display: none;"
    />
    <button
        on:click={() => {
            fileInput.click();
        }}>Upload picture</button
    >

    <span>Prompt</span>
    <input bind:value={prompt} placeholder="Prompt" />
    <button on:click={() => generateFrame()}>Generate</button>
</div>

<style>
    .container {
        width: 400px;
        height: 100%;
        padding: 16px;
        border-left: 2px solid #333;
        flex: 1;
        user-select: none;
    }

    input {
        width: 100%;
        padding: 8px;
        border: 2px solid #333;
        border-radius: 4px;
        font-size: 16px;
    }

    button {
        width: 100%;
        padding: 8px;
        border: 2px solid #333;
        border-radius: 4px;
        font-size: 16px;
        margin: 8px 0;
    }
</style>
