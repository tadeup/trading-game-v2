import { SELECT_ASSET } from "./types";

export const initialState = { selectedAsset: null };

export function reducer(state = initialState, action) {
    switch (action.type) {
        case SELECT_ASSET:
            return { ...state, selectedAsset: action.payload };
        default:
            return state
    }
}