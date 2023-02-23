import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer, WsException
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";
import { UseFilters, UseGuards, UsePipes } from "@nestjs/common";
import { WsAuthGuard } from "../../guards/socket-auth-token.guard";
import { WsExceptionFilter } from "../../exceptions-filter/ws-exception.filter";
import { WSValidationPipe } from "../../pipes/validation-ws-body";
import { Data } from "./dto/admin-dto";

const origin: string[] = ["https://domen.com"];

const corsOption = {
  origin: "*",
  credentials: true
};


@WebSocketGateway({
  cors: {
    corsOption
  },
  namespace: "/admin"
})

export class SocketAdminService implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  @UseGuards(WsAuthGuard)
  @UsePipes(new WSValidationPipe())
  @UseFilters(new WsExceptionFilter())
  @SubscribeMessage("admin-path")
  handleEvent(@MessageBody() dto: Data, @ConnectedSocket() client: Socket) {
    client.emit("admin-path", { type:'test', dto });
    // return { events, text };
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.token as string;
    const roomKey = client.handshake.headers.roomkey as string;

    if (!token) {
      this.forceDisconnect(client, "Missing token");
      return;
    }

    //const result = await someTokenService(token)
    const result = token === "123";

    if (!result) {
      this.forceDisconnect(client, "Unauthorized");
    } else {
      client.join(`room_${roomKey}`);
    }
  }

  forceDisconnect(client: Socket, message: string) {
    client.emit("unauthorized", new WsException({ type: "error", text: message }));
    client.disconnect(true);
  }

  handleDisconnect(client: Socket) {

  }
}