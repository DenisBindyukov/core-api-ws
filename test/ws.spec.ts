import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { io, Socket } from "socket.io-client";
import { AppModule } from "../src/app.module";
import * as request from "supertest";


describe("ws tests", () => {
  let app: INestApplication;
  let httpServer: any;
  let dataAddress: any;
  let participantClient: Socket;
  let adminClient: Socket;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    httpServer = app.getHttpServer();
    dataAddress = httpServer.listen().address();
  });
  afterAll((done) => {
    app.close();
    done();
  });

  beforeEach(async () => {
    const baseAddress = `http://[${dataAddress.address}]:${dataAddress.port}/`;

    adminClient = await new Promise((resolve) => {
      const option = {
        extraHeaders: {
          token: "123",
          roomKey: "test_room"
        }
      };

      const client = io(baseAddress + "admin", option);
      client.on("connect", () => {
        resolve(client);
      });
    });

    participantClient = await new Promise((resolve) => {
      const option = {
        extraHeaders: {
          participantId: "1",
          roomKey: "test_room"
        },
        forceNew: true
      };

      const client = io(baseAddress + "participant", option);
      client.on("connect", () => {
        resolve(client);
      });
    });
  });

  afterEach(() => {
    participantClient.disconnect();
    adminClient.disconnect();
  });

  it("handleEvent test ", async function() {
    const testObj = { value: "TESTING", id: "1" };
    adminClient.emit("admin-path", testObj);

    const result = await new Promise((resolve) => {
      adminClient.on("admin-path", (data) => {
        resolve(data);
      });
    });

    expect(result).toEqual({
      type: "test", dto: {
        ...testObj
      }
    });
  });

  it("authenticationParticipant test ", async function() {
    await request(httpServer)
      .post("/validate-participants")
      .send({ participantId: "1" })
      .expect(HttpStatus.CREATED);

    const result = await new Promise((resolve) => {
      participantClient.on("auth", (data) => {
        resolve(data);
      });
    });

    expect(result).toEqual({ isApprove: true });
  });

  it("sendStatusQuiz test ", async function() {
    await request(httpServer)
      .post("/quiz-management")
      .send({ quizId: "test_room", status: true })
      .expect(HttpStatus.CREATED);

    const result = await new Promise((resolve) => {
      participantClient.on("quiz-management", (data) => {
        resolve(data);
      });
    });

    expect(result).toEqual({
      type: "QUIZ-STATUS",
      payload: { status: true }
    });
  });

});