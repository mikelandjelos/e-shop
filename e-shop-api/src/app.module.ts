import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { GeoService } from './geo/services/geo/geo.service';
import { GeoController } from './geo/controllers/geo/geo.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      ignoreEnvFile: false,
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type:'postgres',
      host:process.env.POSTGRES_HOST,
      port:parseInt(process.env.POSTGRES_PORT),
      username:process.env.POSTGRES_USER,
      password:process.env.POSTGRES_PASSWORD,
      database:process.env.POSTGRESS_DATABASE,
      autoLoadEntities:true,
      synchronize:true,
    }),
    UserModule
  ],
  controllers: [AppController, GeoController],
  providers: [AppService, GeoService],
})
export class AppModule {
  constructor() {
    console.log(process.env.POSTGRES_HOST)
  }
}
