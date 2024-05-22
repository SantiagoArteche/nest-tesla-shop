import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger();

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...rest } = createUserDto;

      const user = this.userRepository.create({
        ...rest,
        password: bcrypt.hashSync(password, 15),
      });
      await this.userRepository.save(user);

      const { password: pass, isActive, ...userAtributes } = user;

      return {
        ...userAtributes,
        token: this.getJwtToken({ id: userAtributes.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, id: true, password: true },
    });

    if (!user) throw new UnauthorizedException('Not valid credentials (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Not valid credentials (password)');

    const { id, ...rest } = user;

    return { ...rest, token: this.getJwtToken({ id: user.id }) };
  }

  async checkAuthStatus(user: User) {
    const { id, password, ...rest } = user;
    return { ...rest, token: this.getJwtToken({ id: user.id }) };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload, { expiresIn: '2h' });

    return token;
  }

  private handleDBErrors(error: any) {
    if (+error.code === 23505) throw new BadRequestException(error.detail);

    this.logger.error(error.detail);

    throw new InternalServerErrorException(
      'Unexpected error - Check server logs',
    );
  }
}
