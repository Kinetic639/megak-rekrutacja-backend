import { Test, TestingModule } from '@nestjs/testing';
import { Student_urlsController } from './student_urls.controller';

describe('Student_urls Controller', () => {
  let controller: Student_urlsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Student_urlsController],
    }).compile();

    controller = module.get<Student_urlsController>(Student_urlsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
