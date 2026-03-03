import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongoDbModule } from './mongo-db/mongo-db.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, MongoDbModule],
  providers: [],
})
export class AppModule {}
