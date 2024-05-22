import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const { user } = context.switchToHttp().getRequest();

    if (!user)
      throw new InternalServerErrorException('User not found (request)');

    return data ? user[data] : user;
  },
);
