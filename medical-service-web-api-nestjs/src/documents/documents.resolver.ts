// documents.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Document, CreateDocumentInput, UpdateDocumentInput, GetDocumentByIdInput, DeleteDocumentInput } from './types/documents.type';
import { DocumentsService } from './documents.service';

@Resolver(() => Document)
export class DocumentsResolver {
  constructor(private readonly documentsService: DocumentsService) {}

  @Mutation(() => Document)
  createDocument(@Args('input') input: CreateDocumentInput) {
    return this.documentsService.create(input);
  }

  @Query(() => [Document])
  findAllDocuments() {
    return this.documentsService.findAll();
  }

  @Query(() => Document)
  findOneDocument(@Args('input') input: GetDocumentByIdInput) {
    return this.documentsService.findOne(input.document_id);
  }

  @Mutation(() => Document)
  updateDocument(@Args('input') input: UpdateDocumentInput) {
    return this.documentsService.update(input.document_id, input);
  }

  @Mutation(() => Boolean)
  deleteDocument(@Args('input') input: DeleteDocumentInput) {
    return this.documentsService.remove(input.document_id);
  }
}