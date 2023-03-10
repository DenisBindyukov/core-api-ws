import { CanActivate, ExecutionContext } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";


export class WsAuthGuard implements CanActivate {
  constructor(
    //private readonly someService: someService
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
      //const request = context.switchToHttp().getRequest();
      const client: Socket = context.switchToWs().getClient();
      const token = client.handshake.headers.token as string;

      if (!token) {
        throw new WsException("Missing token");
      }

      //const result = await this.someTokenService(token)
      const result = token === "123";

      if (!result) {
        throw new WsException("Unauthorized");
      }

      return true
    }
}
