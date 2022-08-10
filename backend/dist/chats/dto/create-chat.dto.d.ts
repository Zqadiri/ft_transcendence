export declare enum RoomStatus {
    PUBLIC = "public",
    PRIVATE = "private",
    PROTECTED = "protected"
}
export declare enum ChatTypes {
    CHATROOM = "chatRoom",
    DM = "dm"
}
export declare class CreateDmDto {
    name: string;
    type: string;
}
export declare class CreateRoomDto {
    name: string;
    status: string;
    password: string;
}
