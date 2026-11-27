type QueueContext = {
    description?: string;
    id?: string;
    type: string;
};
type Queue = {
    id: string;
    context: QueueContext;
    initialContext?: QueueContext;
    modified: string;
};
export type QueuesResponse = {
    queues: Queue[];
};
type QueueTrack = {
    trackId: string;
    albumId: string;
    from: string;
};
export type QueueResponse = {
    id: string;
    context: QueueContext;
    initialContext?: QueueContext;
    from: string;
    tracks: QueueTrack[];
    currentIndex?: number;
    modified: string;
};
export {};
