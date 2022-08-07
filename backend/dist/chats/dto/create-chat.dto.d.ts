export declare enum RoomStatus {
    PUBLIC = "public",
    PRIVATE = "private",
    PROTECTED = "protected"
}
export declare enum ChatTypes {
    DM = "dm",
    CHATROOM = "chatRoom"
}
export declare class CreateDmDto {
    name: string;
    type: string;
}
export declare class CreateRoomDto {
    name: string;
    type: string;
    status: string;
    password: string;
}
