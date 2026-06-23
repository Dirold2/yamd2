export type Credit = {
    name: string;
    role: string;
    participants?: Array<{
        name: string;
        role: string;
    }>;
};
export type CreditsResponse = Credit[];
