import { OwnerFormCore } from '../owner-form-core';

describe('owner-form-core', () => {
  describe('showRemoveButton', () => {
    let core: OwnerFormCore;

    beforeEach(() => {
      core = new OwnerFormCore();
    });

    it('is false when ownersLength is 1 even for blank new form', () => {
      core.ownersLength = 1;
      core.ownerId = undefined;
      core.newFormOpen = true;

      expect(core.showRemoveButton).toBeFalsy();
    });

    it('is true when ownersLength > 1 and blank new form (no ownerId, newFormOpen)', () => {
      core.ownersLength = 2;
      core.ownerId = undefined;
      core.newFormOpen = true;

      expect(core.showRemoveButton).toBe(true);
    });

    it('is true when ownersLength > 1 and existing ownerId with newFormOpen false', () => {
      core.ownersLength = 2;
      core.ownerId = 'owner_1';
      core.newFormOpen = false;

      expect(core.showRemoveButton).toBe(true);
    });

    it('is falsy when ownersLength > 1 but existing ownerId with newFormOpen true', () => {
      core.ownersLength = 2;
      core.ownerId = 'owner_1';
      core.newFormOpen = true;

      expect(core.showRemoveButton).toBeFalsy();
    });
  });
});
