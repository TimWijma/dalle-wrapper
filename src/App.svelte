<script lang="ts">
    import OpenAi from "openai";

    let apiKey = localStorage.getItem("openai-api-key") || "";

    const openai = new OpenAi({
        apiKey,
        dangerouslyAllowBrowser: true,
    });

    let image = "";

    const createImage = async () => {
        const response = await openai.images.generate({
            model: "dall-e-2",
            prompt: "A bowl of soup that is also a portal to another dimension, digital art",
            size: "256x256",
			response_format: "b64_json"
        });

		console.log(response);
		
		console.log(response.data);

        image = response.data[0].b64_json || "";
    };
</script>

<input bind:value={apiKey} on:input={() => {
    openai.apiKey = apiKey
    localStorage.setItem("openai-api-key", apiKey)
}} />

<button on:click={createImage}>Create Image</button>

<!-- svelte-ignore a11y-img-redundant-alt -->
<img src="data:image/png;base64,{image}" alt="DALL-E Generated image" />