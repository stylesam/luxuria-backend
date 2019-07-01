import { Test, TestingModule } from '@nestjs/testing';
import { JdenticonService } from './jdenticon.service';

describe('JdenticonService', () => {
  let service: JdenticonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JdenticonService],
    }).compile();

    service = module.get<JdenticonService>(JdenticonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
