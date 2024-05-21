import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetRawHeaders = createParamDecorator(
  (data, context: ExecutionContext) => {
    const { rawHeaders } = context.switchToHttp().getRequest();

    return rawHeaders[3].split(' ')[1];
  },
);
