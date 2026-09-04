import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      // Frontend can send token via auth object or header
      const authToken =
        client.handshake.auth?.token || client.handshake.headers?.authorization;

      if (!authToken) {
        throw new WsException('Unauthorized');
      }

      const token = authToken.split(' ')[1] || authToken;
      const payload = await this.jwtService.verifyAsync(token);

      // Attach user payload to the socket client for future use
      (client as any).user = payload;

      return true;
    } catch (err) {
      this.logger.error('WebSocket auth failed');
      throw new WsException('Unauthorized');
    }
  }
}
