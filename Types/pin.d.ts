export type PinData = {
    id?: number;
    uid?: number;
    kind?: number;
    seeds?: string;
    type?: string;
};
export type Pin = {
    type: string;
    data?: PinData;
};
export type PinsListResponse = Pin[];
