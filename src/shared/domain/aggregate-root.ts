import { AggregateRoot as CqrsAggregateRoot } from '@nestjs/cqrs';

export abstract class AggregateRoot extends CqrsAggregateRoot {}
