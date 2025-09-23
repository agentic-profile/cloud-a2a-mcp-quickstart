import { StoreItem } from "../../stores/types.js";

export interface WalletItem extends StoreItem {
    key: string;    // keeps per-owner items separate, must be unique per owner
    ownerDid: string;
    credential: any;
}