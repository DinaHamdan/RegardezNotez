export class EntitySoftDeleteNotImplementedException extends Error {
  constructor(message = 'Soft delete not implemented for that entity') {
    super(message);
  }
}
