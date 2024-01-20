<script lang="ts">
    import { testdata } from "../testdata";
    import { logicCanvas, renderCanvas } from "../globalStore";
    import { createEventDispatcher } from "svelte";
    import { OpenAIController } from "../OpenAIController";

    export let image = "";

    const dispatch = createEventDispatcher();

    let apiKey = localStorage.getItem("openai-api-key") || "";
    let openai = new OpenAIController(apiKey);

    let prompt = "An ocean with mountains in the background and a sunset sky.";

    const createImage = async () => {
        image = testdata.data[0].b64_json || "";

        dispatch("imageCreated", image);
    };

    const getMask = async () => {
        console.log("get mask");
        
        const maskBlob = await $logicCanvas.getMask();
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
</script>

<div class="container">
    <input bind:value={prompt} placeholder="Prompt" />

    <button on:click={createImage}>Create Image</button>

    <input
        bind:value={apiKey}
        placeholder="API key"
        on:input={() => {
            openai = new OpenAIController(apiKey);
            localStorage.setItem("openai-api-key", apiKey);
        }}
    />

    <button on:click={() => getMask()}>get mask</button>
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
