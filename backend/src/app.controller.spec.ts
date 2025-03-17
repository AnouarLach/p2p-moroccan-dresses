import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getJurken', () => {
    it('should return an array of jurken', () => {
      const result = [{ id: 1, naam: 'Kaftan groen', prijs: 50 }];
      expect(appController.getJurken()).toEqual(result);
    });
  });
});