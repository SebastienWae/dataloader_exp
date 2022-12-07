import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Author, Post } from './app.model';

@Injectable()
export class AppService {
  constructor() {
    this.authors = [
      {
        id: 1,
        posts: [],
      },
      {
        id: 2,
        posts: [],
      },
      {
        id: 3,
        posts: [],
      },
    ];
    this.authors.forEach((author, index) => {
      const posts = [
        {
          id: index,
          authors: this.authors,
          title: '1',
        },
        {
          id: index + 100,
          authors: this.authors,
          title: '1',
        },
        {
          id: index + 200,
          authors: this.authors,
          title: '2',
        },
      ];
      author.posts = posts;
      this.posts.push(...posts);
    });
  }

  authors: Author[] = [];
  posts: Post[] = [];
}
