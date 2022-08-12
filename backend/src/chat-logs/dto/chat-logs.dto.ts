import { IsEnum, Equals, Length, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Generated } from "typeorm";
import { ChatLogs } from "../entities/chat-log.entity";


export class ChatLogsDto extends ChatLogs
{

    // userID : string;

    // text: string;

}

