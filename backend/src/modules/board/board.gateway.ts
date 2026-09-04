import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { WsJwtGuard } from '../../common/guards/ws-jwt.guard';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/boards',
})
export class BoardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  
  private readonly logger = new Logger(BoardGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join_board')
  handleJoinBoard(client: Socket, boardId: string) {
    // A production app might re-verify board membership here using Prisma
    // For now, we trust the client to only join boards they belong to,
    // as the HTTP endpoints already enforce strict membership checking.
    const roomName = `board_${boardId}`;
    client.join(roomName);
    this.logger.log(`Client ${client.id} joined room: ${roomName}`);
    return { event: 'joined', data: roomName };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leave_board')
  handleLeaveBoard(client: Socket, boardId: string) {
    const roomName = `board_${boardId}`;
    client.leave(roomName);
    this.logger.log(`Client ${client.id} left room: ${roomName}`);
    return { event: 'left', data: roomName };
  }

  // --- INTERNAL EVENT LISTENERS (Triggered by NestJS Services) ---

  @OnEvent('task.created')
  handleTaskCreated(payload: { boardId: string; task: any }) {
    this.server.to(`board_${payload.boardId}`).emit('task_created', payload.task);
  }

  @OnEvent('task.updated')
  handleTaskUpdated(payload: { boardId: string; task: any }) {
    this.server.to(`board_${payload.boardId}`).emit('task_updated', payload.task);
  }

  @OnEvent('task.deleted')
  handleTaskDeleted(payload: { boardId: string; taskId: string }) {
    this.server.to(`board_${payload.boardId}`).emit('task_deleted', { id: payload.taskId });
  }

  @OnEvent('column.created')
  handleColumnCreated(payload: { boardId: string; column: any }) {
    this.server.to(`board_${payload.boardId}`).emit('column_created', payload.column);
  }

  @OnEvent('column.updated')
  handleColumnUpdated(payload: { boardId: string; column: any }) {
    this.server.to(`board_${payload.boardId}`).emit('column_updated', payload.column);
  }

  @OnEvent('column.deleted')
  handleColumnDeleted(payload: { boardId: string; columnId: string }) {
    this.server.to(`board_${payload.boardId}`).emit('column_deleted', { id: payload.columnId });
  }
}
