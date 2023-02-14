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
    console.log("handleEvent: ", dto);
    const events = "someEvents";

    // this.server.to("123").emit("test", {});
    client.emit("admin-path", { events, dto });
    // return { events, text };
  }

  sendStatusQuiz(data: { keyRoom: string, status: boolean }) {
    this.server.to(`room_${data.keyRoom}`).emit("public-event", {
      type: "QUIZ-STATUS",
      payload: { status: data.status }
    });
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.token as string;
    const roomKey = client.handshake.headers.token as string;
    console.log("admin: ", roomKey);
    if (!token) {
      console.log("render");
      console.log(token);
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
    client.emit("error", new WsException({ type: "error", text: message }));
    client.disconnect(true);
  }

  handleDisconnect(client: Socket) {
    console.log("disconnect");
  }
}