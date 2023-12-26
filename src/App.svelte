<script lang="ts">
    import OpenAi from "openai";

    const openai = new OpenAi();

    const createImage = async () => {
        const image = await openai.images.generate({
            model: "dall-e-2",
            prompt: "Create an image of a white cat",
            size: "256x256",
			response_format: "b64_json"
        });

		console.log(image);
		
		console.log(image.data);
		
    };
</script>

hello

<button on:click={createImage}>Create Image</button>