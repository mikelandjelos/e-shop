import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Observable, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
export const storage = {
  storage: diskStorage({
    destination: './uploads/profileimages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file', storage))
  create(@UploadedFile() file, @Body() createProductDto: CreateProductDto) {
   createProductDto.image = file.filename;
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('/getPost/:id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
  @Put('/incrementViews/:id')
  incrementViews(@Param('id') id: string) {
    return this.productService.viewProduct(id);
  }
  @Get('/getPostsView/:id')
  getPostsView(@Param('id') id: string) {
    return this.productService.getNumberOfViews(id);
  }
  @Get('product-image/:imagename')
  findProfileImage(@Param('imagename')imagename,@Res()res):Observable<Object>{
   return of(res.sendFile(path.join(process.cwd(),'uploads/profileimages/'+imagename)));
  }
  @Put('/decreaseStock/:id/:count')
  decreaseStock(@Param('id')id:string, @Param('count')count:number)
  {
    this.productService.decreaseProduct(id,count);
  }
  @Get('TopSales')
  getTopSales()
  {
    return this.productService.getFourWithMostScore();
  }
}
