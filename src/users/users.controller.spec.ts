import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '@prisma/client';

const userId = '1';
const testEmail1 = 'user1@example.com';
const testName1 = 'Test User 1';

describe('Users Controller', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            users: jest.fn().mockResolvedValue([
              {
                id: BigInt(userId),
                email: testEmail1,
                name: testName1,
              },
              {
                id: BigInt('2'),
                email: 'user2@example.com',
                name: 'Test User 2',
              },
              {
                id: BigInt('3'),
                email: 'user3@example.com',
                name: 'Test User 3',
              },
            ]),
            user: jest.fn(
              (
                userWhereUniqueInput: Prisma.UserWhereUniqueInput,
              ): Promise<User> =>
                Promise.resolve({
                  id: BigInt(userWhereUniqueInput.id),
                  email: testEmail1,
                  name: testName1,
                }),
            ),
            createUser: jest.fn((user: Prisma.UserCreateInput) =>
              Promise.resolve({ id: BigInt(userId), ...user }),
            ),
            updateUser: jest.fn(
              (params: {
                where: Prisma.UserWhereUniqueInput;
                data: Prisma.UserUpdateInput;
              }) =>
                Promise.resolve({
                  id: BigInt(params.where.id),
                  ...params.data,
                }),
            ),
            deleteUser: jest.fn(
              (userWhereUniqueInput: Prisma.UserWhereUniqueInput) =>
                Promise.resolve({
                  id: BigInt(userWhereUniqueInput.id),
                  email: testEmail1,
                  name: testName1,
                }),
            ),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should get an array of users', async () => {
      await expect(controller.findAll()).resolves.toEqual([
        {
          id: BigInt(userId),
          email: testEmail1,
          name: testName1,
        },
        {
          id: BigInt('2'),
          email: 'user2@example.com',
          name: 'Test User 2',
        },
        {
          id: BigInt('3'),
          email: 'user3@example.com',
          name: 'Test User 3',
        },
      ]);
    });
  });
  describe('findOne', () => {
    it('should get a single user', async () => {
      await expect(controller.findOne(userId)).resolves.toEqual({
        id: BigInt(userId),
        email: testEmail1,
        name: testName1,
      });
      await expect(controller.findOne('3')).resolves.toEqual({
        id: BigInt('3'),
        email: testEmail1,
        name: testName1,
      });
    });
  });
  describe('createUser', () => {
    it('should create a new user', async () => {
      const newUserDTO: CreateUserDto = {
        email: 'user1@example.com',
        name: 'New User 1',
      };
      await expect(controller.create(newUserDTO)).resolves.toEqual({
        id: BigInt(userId),
        ...newUserDTO,
      });
    });
  });
  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserDTO: UpdateUserDto = {
        email: 'user1@example.com',
        name: 'New User 1',
      };
      await expect(controller.update(userId, updateUserDTO)).resolves.toEqual({
        id: BigInt(userId),
        ...updateUserDTO,
      });
    });
  });
  describe('deleteUser', () => {
    it('should return deleted user', async () => {
      await expect(controller.remove(userId)).resolves.toEqual({
        id: BigInt(userId),
        email: 'user1@example.com',
        name: 'Test User 1',
      });
    });
  });
});
