import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { AppService } from './app.service';
import {
  AuthorLoader,
  AuthorsResolver,
  PostLoader,
  PostResolver,
} from './app.resolver';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from './app.intercept';

@Module({
  providers: [
    AppService,
    AuthorsResolver,
    PostResolver,
    AuthorLoader,
    PostLoader,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
  exports: [AppService],
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      definitions: { emitTypenameField: true },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
  ],
})
export class AppModule {}
