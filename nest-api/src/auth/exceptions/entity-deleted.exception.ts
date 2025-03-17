import { EntityNotFoundException } from './entity-not-found.exception';

export class EntityDeletedException extends EntityNotFoundException {
  constructor(message = 'Entity deleted') {
    super(message);
  }
}
