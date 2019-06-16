import { OnlyAdminGuard } from './only-admin.guard';

describe('OnlyAdminGuard', () => {
  it('should be defined', () => {
    expect(new OnlyAdminGuard()).toBeDefined();
  });
});
