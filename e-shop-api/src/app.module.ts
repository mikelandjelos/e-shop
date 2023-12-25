import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { GeoController } from './geo/controllers/geo/geo.controller';
import { GeoService } from './geo/services/geo/geo.service';
import { OrderModule } from './order/order.module';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { OrderItemModule } from './order-item/order-item.module';
import { PaymentModule } from './payment/payment.module';
import { RedisModule } from 'nestjs-redis';
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
    RedisModule.register([
      {
        name: process.env.REDIS_DURABLE_NAME,
        host: process.env.REDIS_DURABLE_HOST,
        port: parseInt(process.env.REDIS_DURABLE_PORT),
      },
      {
        name: process.env.REDIS_CACHE_NAME,
        host: process.env.REDIS_CACHE_HOST,
        port: parseInt(process.env.REDIS_DURABLE_PORT),
      },
    ]),
    AuthModule,
    CustomerModule,
    PaymentModule,
    OrderModule,
    OrderItemModule,
    ProductModule,
    CategoryModule,
    WarehouseModule,
  ],
  controllers: [AppController, GeoController],
  providers: [AppService, GeoService],
})
export class AppModule {
  constructor() {}
}
