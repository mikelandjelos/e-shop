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
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Observable, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../entities/product.entity';
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

  @Get('/getPost/:id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
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
  findProfileImage(@Param('imagename') imagename, @Res() res) {
    return this.productService.getImageBlob(imagename, res);
  }
  @Put('/decreaseStock/:id/:count')
  decreaseStock(@Param('id') id: string, @Param('count') count: number) {
    return this.productService.decreaseProduct(id, count);
  }
  @Get('OutOfStock')
  getOutOfStock() {
    return this.productService.getFourWithMostScore('topSales');
  }
  @Get('TopSales')
  getTopSales() {
    return this.productService.getFourWithMostScore('stock');
  }
  @Get('LastFour')
  getLastFour() {
    return this.productService.getFourWithMostScore('created');
  }
  @Post('bulkCreate')
  async bulkCreate(
    @Body() createProductDtos: CreateProductDto[],
  ): Promise<Product[]> {
    try {
      const result = await this.productService.bulkCreate(createProductDtos);
      return result;
    } catch (error) {
      // Handle errors appropriately, e.g., log and return a proper response
      console.error(error);
      throw new BadRequestException('Error performing bulk creation');
    }
  }
  @Get('LastView/:id')
  lastView(@Param('id')id:string)
  {
    return this.productService.getLastMeasuredValue(id);
  }
  @Get('paginated')
  async findPaginated(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<{ products: Product[]; total: number }> {
    try {
      const result = await this.productService.findPaginated(page, pageSize);
      return result;
    } catch (error) {
      // Handle errors appropriately, e.g., log and return a proper response
      console.error(error);
      throw new BadRequestException('Error fetching paginated products');
    }
  }
  @Post('setInCache')
  setInCache(@Body() product: any)
  {
    return this.productService.addToCart(product);
  }
  @Get('GetProductsFromCart')
  getFromCart()
  {
    return this.productService.getAllProductsFromCache();
  }
  @Delete('DeleteFromCache')
  deleteFromCache()
  {
    return this.productService.deleteAllProductsFromRedisCache();
  }
  @Delete('DeleteAll')
  deleteAll()
  {
    return this.productService.deleteAllKeys();
  }

}
