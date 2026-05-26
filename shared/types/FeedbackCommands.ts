export interface CreateFeedbackCommand {
    message: string;
    type?: 'feedback' | 'bug' | 'idea';
    variant?: 'manual' | 'popup';
    email?: string;
    metadata: {
        route: string;
        year?: number;
        month?: number;
        accountId?: string;
    };
}
