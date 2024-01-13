import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './redis/redis.service';
import { ExampleController } from './example/example.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
   
    TypeOrmModule.forRoot({
      type:'postgres',
      host:process.env.POSTGRES_HOST,
      port:parseInt(<string>process.env.POSTGRES_PORT),
      username:process.env.POSTGRES_USER,
      password:<string>process.env.POSTGRES_PASSWORD,
      database:process.env.POSTGRES_DATABASE,
      autoLoadEntities:true,
      synchronize:true,
    }),
    UserModule,
  ],
  controllers: [AppController, ExampleController],
  providers: [AppService, RedisService],
})
export class AppModule {}
