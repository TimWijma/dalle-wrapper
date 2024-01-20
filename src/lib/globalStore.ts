import { get, writable, type Writable } from "svelte/store";
import OpenAi from "openai";
import { CanvasImage } from "./CanvasImage";
import type { LogicCanvas } from "./LogicCanvas";
import type { RenderCanvas } from "./RenderCanvas";

export const openai_api_key: Writable<string> = writable("");
export const openai: Writable<OpenAi> = writable(
    new OpenAi({
        apiKey: get(openai_api_key),
        dangerouslyAllowBrowser: true,
    })
);

export const images: Writable<CanvasImage[]> = writable([]);
get(images).push(
    new CanvasImage(
        0,
        0,
        256,
        256,
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        -1,
        -1
    )
);

export const logicCanvas: Writable<LogicCanvas> = writable();
export const renderCanvas: Writable<RenderCanvas> = writable();