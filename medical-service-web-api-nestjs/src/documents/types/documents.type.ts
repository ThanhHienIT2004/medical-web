// types/documents.type.ts
import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Document {
  @Field(() => ID)
  document_id: number;

  @Field()
  title: string;

  @Field()
  file_url: string;

  @Field()
  category: string;

  @Field()
  uploaded_by_id: string;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}

@InputType()
export class CreateDocumentInput {
  @Field()
  title: string;

  @Field()
  file_url: string;

  @Field()
  category: string;

  @Field()
  uploaded_by_id: string;
}

@InputType()
export class UpdateDocumentInput {
  @Field(() => ID)
  document_id: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  file_url?: string;

  @Field({ nullable: true })
  category?: string;
}

@InputType()
export class GetDocumentByIdInput {
  @Field(() => ID)
  document_id: number;
}

@InputType()
export class DeleteDocumentInput {
  @Field(() => ID)
  document_id: number;
}