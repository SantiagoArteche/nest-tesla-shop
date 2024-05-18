import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    let { take = 10, skip = 0, sort = 'asc' } = paginationDto;

    if (+sort === 1) sort = 'asc';
    if (+sort === -1) sort = 'desc';

    return this.productRepository.find({
      skip,
      take,
      order: {
        price: sort,
      },
    });
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOne({
        where: {
          id: term,
        },
      });
    } else {
      product = await this.productRepository.findOne({
        where: {
          slug: term.toLowerCase(),
        },
      });
    }

    if (!product)
      throw new NotFoundException(`Product with id or slug ${term} not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    try {
      if (!Object.values(updateProductDto).length)
        throw new BadRequestException(`Update values are not defined`);

      if (updateProductDto.slug) {
        updateProductDto.slug = updateProductDto.slug
          .toLowerCase()
          .replaceAll(' ', '_')
          .replaceAll("'", '');
      }

      await this.productRepository.update(id, updateProductDto);

      return { ...product, ...updateProductDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    await this.productRepository.delete(product.id);

    return `Product with id ${id} was deleted!`;
  }

  private handleExceptions(error: any) {
    if (+error.code === 23505) throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Unexpected error - Check server logs',
    );
  }
}
