import { get, writable, type Writable } from "svelte/store";
import OpenAi from "openai";

export const openai_api_key: Writable<string> = writable("");
export const openai: Writable<OpenAi> = writable(
    new OpenAi({
        apiKey: get(openai_api_key),
        dangerouslyAllowBrowser: true,
    })
);
