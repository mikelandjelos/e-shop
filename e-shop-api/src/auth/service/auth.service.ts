import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateCustomerDto } from 'src/customer/dto/create-customer.dto';
import { CustomerService } from 'src/customer/services/customer.service';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private customerService: CustomerService,private jwtService:JwtService) {}
  async validateUserCredentials(username: string, password: string): Promise<CreateCustomerDto|null> {
    const user= await this.customerService.findUserByUsername(username);
    if(!user)
    throw new BadRequestException();
    if(!await(bcrypt.compare(password,  user.password)))
    throw new UnauthorizedException();
    return user;
  }
  async generateToken(user:CreateCustomerDto){
    return {
        access_token:this.jwtService.sign({
            sub:user.id,
            username:user.username
            
        })
    }
  }
}
