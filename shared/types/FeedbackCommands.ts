export interface CreateFeedbackCommand {
    message: string;
    email?: string;
    metadata: {
        route: string;
        year?: number;
        month?: number;
        accountId?: string;
    };
}
