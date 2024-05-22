import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { GetUser, GetRawHeaders, RoleProtected, Auth } from './decorators';
import { LoginUserDto, CreateUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @GetRawHeaders() rawHeaders: string,
  ) {
    return { ok: true, user, userEmail, rawHeaders };
  }

  @Get('private2')
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRouteTwo(@GetUser() user: User) {
    return { ok: true, user };
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRouteThree(@GetUser() user: User) {
    return { ok: true, user };
  }
}
