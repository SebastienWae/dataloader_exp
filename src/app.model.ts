import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Author {
  @Field((type) => Int)
  id: number;

  @Field((type) => [Post])
  posts: Post[];
}

@ObjectType()
export class Post {
  @Field((type) => Int)
  id: number;

  @Field()
  title: string;

  @Field((type) => [Author])
  authors: Author[];
}
