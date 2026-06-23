export type MusicHistoryItemId = {
    trackId?: string;
    albumId?: string;
};
export type MusicHistoryItem = {
    id: MusicHistoryItemId;
    timestamp: string;
};
export type MusicHistoryGroup = {
    items: MusicHistoryItem[];
    day?: string;
};
export type MusicHistoryTab = {
    groups: MusicHistoryGroup[];
    id?: string;
    title?: string;
};
export type MusicHistoryResponse = {
    tabs: MusicHistoryTab[];
};
export type MusicHistoryItemsResponse = {
    items: MusicHistoryItem[];
};
