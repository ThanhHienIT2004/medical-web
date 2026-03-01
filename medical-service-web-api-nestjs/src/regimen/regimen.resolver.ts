import { Resolver } from '@nestjs/graphql';
import { RegimenService } from './regimen.service';

import { Args, Int, Mutation, Query } from '@nestjs/graphql';
import { CreateRegimenInput, Regimen } from './types/regimen.type';

@Resolver(() => Regimen)
export class RegimenResolver {
  constructor(private readonly service: RegimenService) {}

  @Mutation(() => Regimen)
  createRegimen(@Args('input') input: CreateRegimenInput) {
    return this.service.create(input);
  }

  @Query(() => [Regimen])
  findAllRegimens() {
    return this.service.findAll();
  }

  @Query(() => Regimen)
  findRegimen(@Args('id', { type: () => Int }) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => Regimen)
  deleteRegimen(@Args('id', { type: () => Int }) id: number) {
    return this.service.delete(id);
  }
}
