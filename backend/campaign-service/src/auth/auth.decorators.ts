import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthUserId = createParamDecorator(
  (_data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    if (!!req.user) {
      return req.user.userId;
    }
  },
);

export const RefreshData = createParamDecorator(
  (_data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    if (!!req.user) {
      return req.user;
    }
  },
);
