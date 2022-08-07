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
    id: number;
    name: string;
    uuid: string;
    isPLaying: Boolean;
    isActive: boolean;
    userID: string[];
    AdminsID: string[];
    mutedID: string[];
    createdAt: Date;
    updatedAt: Date;
    ownerID: string;
    type: string;
    status: string;
    password: string;
}
