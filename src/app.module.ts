import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {SocketAdminModule} from "./modules/admin/socket-admin-module";
import { SocketParticipantModule } from "./modules/participant/socket-participant-module";
import { SocketParticipantService } from "./modules/participant/socket-participant-service";

@Module({
  imports: [SocketAdminModule, SocketParticipantModule],
  controllers: [AppController],
  providers: [AppService, SocketParticipantService],
})
export class AppModule {}
