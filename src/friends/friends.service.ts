import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateRelation } from 'src/users/interfaces/relations.interface';
import { Friend } from './friend.intity';
import { InjectRepository } from '@nestjs/typeorm';
import { relationRepository } from 'src/friends/relation.repository';

@Injectable()
export class FriendsService {
    constructor(
        private readonly userService: UsersService,
        @InjectRepository(relationRepository)
        private readonly relationRepo : relationRepository
        ){}

    async createFriendRelation(createRelation : CreateRelation){
        const friend  = new Friend();
        try
        {
            friend.user = await this.userService.getUserById(createRelation.SecondUser.id);
            const relationExist = this.relationRepo.findOne({
                where:{
                    
                },
            })
            if (relationExist)
                return relationExist;
            
        }
        catch (err){

        }
    }

}
