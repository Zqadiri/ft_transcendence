import { ChatsService } from './chats.service';
export declare class ChatsController {
    private readonly chatService;
    constructor(chatService: ChatsService);
    DM(res: any): Promise<void>;
}
