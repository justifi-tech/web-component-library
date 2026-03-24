import { OwnerForm } from '../owner-form';

describe('owner-form', () => {
  describe('showRemoveButton', () => {
    let form: OwnerForm;

    beforeEach(() => {
      form = new OwnerForm();
    });

    it('is false when ownersLength is 1 even for blank new form', () => {
      form.ownersLength = 1;
      form.ownerId = undefined;
      form.newFormOpen = true;

      expect(form.showRemoveButton).toBeFalsy();
    });

    it('is true when ownersLength > 1 and blank new form (no ownerId, newFormOpen)', () => {
      form.ownersLength = 2;
      form.ownerId = undefined;
      form.newFormOpen = true;

      expect(form.showRemoveButton).toBe(true);
    });

    it('is true when ownersLength > 1 and existing ownerId with newFormOpen false', () => {
      form.ownersLength = 2;
      form.ownerId = 'owner_1';
      form.newFormOpen = false;

      expect(form.showRemoveButton).toBe(true);
    });

    it('is falsy when ownersLength > 1 but existing ownerId with newFormOpen true', () => {
      form.ownersLength = 2;
      form.ownerId = 'owner_1';
      form.newFormOpen = true;

      expect(form.showRemoveButton).toBeFalsy();
    });
  });
});
