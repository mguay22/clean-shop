import { UniqueId } from '../../../shared/domain/value-objects/unique-id.vo';

export class OrderId extends UniqueId {
  constructor(id?: string) {
    super(id);
  }
}
