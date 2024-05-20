import { IsString, MinLength } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_images' })
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('text')
  @IsString()
  @MinLength(3)
  public url: string;

  @ManyToOne(() => Product, (prod) => prod.images, { onDelete: 'CASCADE' })
  public product: Product;
}
