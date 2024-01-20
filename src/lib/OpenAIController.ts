import OpenAI, { toFile } from "openai";
import type { ResponseLike } from "openai/uploads.mjs";

export class OpenAIController {
    private openai: OpenAI;

    constructor(apiKey: string) {
        this.openai = new OpenAI({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true,
        });
    }

    async outpaint(blob: Blob, prompt: string) {
        let array = await blob.arrayBuffer();

        let file = await toFile(array, "test.png");

        const response = await this.openai.images.edit({
            image: file,
            prompt: prompt,
            model: "dall-e-2",
            response_format: "b64_json",
            size: "256x256"
        })

        return response.data[0].b64_json;
    }
}
