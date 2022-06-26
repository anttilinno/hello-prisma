import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from './users.service';

const testEmail = 'user1@example.com';
const testName = 'Test User 1';

const userArray = [
  { email: testEmail, name: testName },
  { email: 'user2@example.com', name: 'Test User 2' },
  { email: 'user3@example.com', name: 'Test User 3' },
];

const oneUser = userArray[0];

const db = {
  user: {
    findMany: jest.fn().mockResolvedValue(userArray),
    findUnique: jest.fn().mockResolvedValue(oneUser),
    findFirst: jest.fn().mockResolvedValue(oneUser),
    create: jest.fn().mockReturnValue(oneUser),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(oneUser),
    delete: jest.fn().mockResolvedValue(oneUser),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const users = await service.users({});
      expect(users).toEqual(userArray);
    });
  });

  describe('getOne', () => {
    it('should return a single user', () => {
      expect(service.user({ email: 'user1@example.com' })).resolves.toEqual(
        oneUser,
      );
    });
  });

  describe('insertOne', () => {
    it('should successfully insert a user', () => {
      expect(
        service.createUser({
          email: testEmail,
          name: testName,
        }),
      ).resolves.toEqual(oneUser);
    });
  });

  describe('updateOne', () => {
    it('should call the update method on user', async () => {
      const user = await service.updateUser({
        where: { id: 1 },
        data: {
          email: testEmail,
          name: testName,
        },
      });
      expect(user).toEqual(oneUser);
    });
  });

  describe('deleteOne', () => {
    it('should return user on delete', () => {
      expect(
        service.deleteUser({
          id: 1,
        }),
      ).resolves.toEqual(oneUser);
    });

    // TODO: Implement 404 method (after service has it)
    //https://github.com/jmcdo29/testing-nestjs/blob/main/apps/prisma-sample/src/cat/cat.service.spec.ts
  });
});
