import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ErrorTypes } from 'src/errors/errors.constants';

@Injectable()
export class ApiAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate = async (context: ExecutionContext): Promise<boolean> => {
    // TODO -> Implement auth
    const req = context.switchToHttp().getRequest();
    const key = req.headers['bearer'];

    if (!key) throw new UnauthorizedException(ErrorTypes.AUTH_HEADER_MISSING);

    req.userId = this.authService.getUserId(key);
    return true;
  };
}
