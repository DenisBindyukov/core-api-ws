import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer, WsException
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";

const corsOption = {
  origin: "*"
};


@WebSocketGateway({
  cors: {
    corsOption
  },
  namespace: "/participant"
})

export class SocketParticipantService implements OnGatewayConnection {

  private clients: Map<Socket, string> = new Map();

  @WebSocketServer()
  server: Server;

  questionEvent(data: any) {

  }

  authenticationParticipant(data: any) {
    console.log(data);
  }

  async handleConnection(client: Socket) {
    const roomKey = client.handshake.headers.roomkey as string;
    const participantId = client.handshake.headers.participantid as string;

    this.clients.set(client, participantId);
    client.join(`room_${roomKey}`);
  }

}