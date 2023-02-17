import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer
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

  authenticationParticipant(data: { participantIds: string }) {
    for (const [client, participantId] of this.clients) {
      if (participantId === data.participantIds) {
        client.emit("auth", { isApprove: true });
      }
    }
  }

  sendStatusQuiz(data: { quizId: string, status: boolean }) {
    console.log(data.quizId);
    const status = !data.status
    this.server.to(`room_${data.quizId}`).emit("quiz-management", {
      type: "QUIZ-STATUS",
      payload: { status: status }
    });
  }

  async handleConnection(client: Socket) {
    const roomKey = client.handshake.headers.roomkey as string;
    const participantId = client.handshake.headers.participantid as string;


    this.clients.set(client, participantId);
    client.join(`room_${roomKey}`);
  }

}