import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { GeoController } from './geo/controllers/geo/geo.controller';
import { GeoService } from './geo/services/geo/geo.service';
import { OrderModule } from './order/order.module';
import { CustomerModule } from './customer/customer.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      ignoreEnvFile: false,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRESS_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    OrderModule,
    CustomerModule,
  ],
  controllers: [AppController, GeoController],
  providers: [AppService, GeoService],
})
export class AppModule {
  constructor() {}
}
