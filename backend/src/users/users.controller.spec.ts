import { Test, TestingModule } from '@nestjs/testing';
<<<<<<< HEAD:backend/src/friends/friends.controller.spec.ts
import { FriendsController } from './friends.controller';
=======
import { PlayersController } from './users.controller';
>>>>>>> origin/chat-branch:backend/src/users/users.controller.spec.ts

describe('FriendsController', () => {
  let controller: FriendsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendsController],
    }).compile();

    controller = module.get<FriendsController>(FriendsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
