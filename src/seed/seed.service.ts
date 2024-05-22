import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.clearDB();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts(adminUser);
    return 'Seed Executed!';
  }

  private async clearDB() {
    this.productService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach((user) => users.push(this.userRepository.create(user)));

    await this.userRepository.save(users);

    return users[0];
  }

  private async insertNewProducts(adminUser: User) {
    const productsArray = [];

    initialData.products.forEach((product) =>
      productsArray.push(this.productService.create(product, adminUser)),
    );

    await Promise.all(productsArray);

    return true;
  }
}
