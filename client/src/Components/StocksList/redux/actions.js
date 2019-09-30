import { SELECT_ASSET } from "./types";

export function selectAsset(payload) {
    return { type: SELECT_ASSET, payload}
}