import {Module} from "@nestjs/common";
import { SocketParticipantService } from "./socket-participant-service";

@Module(
  {
    imports: [],
    providers: [SocketParticipantService],
    exports: []
  }
)

export class SocketParticipantModule {}