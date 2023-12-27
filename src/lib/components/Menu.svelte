<script lang="ts">
    import { testdata } from "../testdata";
    import { openai_api_key, openai } from "../globalStore";
    import { createEventDispatcher } from "svelte";

    export let image = "";

    const dispatch = createEventDispatcher();

    $openai_api_key = localStorage.getItem("openai-api-key") || "";
    $openai.apiKey = $openai_api_key;

    let prompt = "";

    const createImage = async () => {
        // const response = await $openai.images.generate({
        //     model: "dall-e-2",
        //     prompt: prompt,
        //     size: "256x256",
        // 	response_format: "b64_json"
        // });

        const response = testdata;

        // console.log(response);

        // console.log(response.data);

        image = response.data[0].b64_json || "";

        dispatch("imageCreated", image);
    };
</script>

<div class="container">
    <input bind:value={prompt} placeholder="Prompt" />

    <button on:click={createImage}>Create Image</button>

    <input
        bind:value={$openai_api_key}
        placeholder="API key"
        on:input={() => {
            $openai.apiKey = $openai_api_key;
            localStorage.setItem("openai-api-key", $openai_api_key);
        }}
    />
</div>

<style>
    .container {
        width: 400px;
        height: 100%;
        padding: 16px;
        border-left: 2px solid #333;
        flex: 1;
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
