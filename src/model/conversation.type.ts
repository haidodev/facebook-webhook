export interface Conversation {
    participants: {
        data: {
            id: string;
            name: string;
        }[];
    }
    unread_count: number;
    updated_time: string;
    id: string;
    snippet: string;
}