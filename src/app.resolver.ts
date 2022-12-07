import { Injectable } from '@nestjs/common';
import {
  Args,
  Info,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import * as DataLoader from 'dataloader';
import { Loader, NestDataLoader } from './app.intercept';
import { Author, Post } from './app.model';
import { AppService } from './app.service';

type AuthorType = {
  id: number;
};

@Injectable()
export class AuthorLoader implements NestDataLoader<number, Author> {
  constructor(private appService: AppService) {}

  generateDataLoader(): DataLoader<number, Author> {
    return new DataLoader<number, Author>(
      async (keys) =>
        new Promise((resolve) => {
          console.log('author', keys);
          resolve(
            keys.map((key) => {
              return this.appService.authors.find((e) => e.id === key);
            }),
          );
        }),
    );
  }
}

@Injectable()
export class PostLoader implements NestDataLoader<number, Post> {
  constructor(private appService: AppService) {}

  generateDataLoader(): DataLoader<number, Post> {
    return new DataLoader<number, Post>(
      async (keys) =>
        new Promise((resolve) => {
          console.log('post', keys);
          resolve(
            keys.map((key) => {
              return this.appService.posts.find((e) => e.id === key);
            }),
          );
        }),
    );
  }
}

@Resolver((of) => Author)
export class AuthorsResolver {
  constructor(private appService: AppService) {}

  @Query((returns) => Author)
  async author(
    @Args('id', { type: () => Int }) id: number,
    @Info() info: any,
  ): Promise<AuthorType> {
    // console.log('####### author', info.path);
    return { id };
  }

  @ResolveField()
  async posts(
    @Parent() author: Author,
    @Info() info: any,
    @Loader(AuthorLoader) postLoader: DataLoader<Author['id'], Author>,
  ) {
    // console.log('###### author.posts', info.path);
    return (await postLoader.load(author.id)).posts;
  }
}

@Resolver((of) => Post)
export class PostResolver {
  constructor(private appService: AppService) {}

  @Query((returns) => Post)
  async post(@Args('id', { type: () => Int }) id: number, @Info() info: any) {
    // console.log('####### post', info.path);
    return { id };
  }

  @ResolveField()
  async authors(
    @Parent() post: Post,
    @Info() info: any,
  ): Promise<AuthorType[]> {
    // console.log('####### post.authors', info.path);
    const i = this.appService.posts.find((e) => e.id === post.id).authors;
    const ids = i.map((e) => ({
      id: e.id,
    }));
    return ids;
  }

  @ResolveField()
  async title(
    @Parent() post: Post,
    @Info() info: any,
    @Loader(PostLoader) postLoader: DataLoader<Post['id'], Post>,
  ) {
    return (await postLoader.load(post.id)).title;
  }
}
