import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// Define expected structure for authenticated requests
export interface AuthRequest extends Request {
  user?: {
    id?: string;
    email?: string;
  };
}

// Current User
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    console.log('from decorator', request.user);
    return request.user;
  },
);

// Current User ID
export const CurrentUserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    return request.user?.id;
  },
);

// get header authorization
export const AuthHeader = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.headers['authorization'];
  },
);
