// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithUser } from './interfaces/request-with-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();
    return requiredRoles.includes(user.role); // 유저의 역할이 권한 목록에 있는지 확인
  }
}
