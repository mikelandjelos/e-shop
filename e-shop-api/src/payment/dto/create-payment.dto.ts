import { PaymentMethod } from '../entities/payment.entity';

export class CreatePaymentDto {
  id: string;
  paymentMethod: PaymentMethod;
}
