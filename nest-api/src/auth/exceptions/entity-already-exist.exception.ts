export class EntityAlreadyExistException extends Error {
  constructor(message = 'Entity already exist') {
    super(message);
  }
}
