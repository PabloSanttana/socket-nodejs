import { io } from "../app";
import { ConnectionsService } from "../services/ConnectionsService";
import { MessagesService } from "../services/MessagesService";

io.on("connect", async (socket) => {
  const connectionService = new ConnectionsService();
  const messageService = new MessagesService();

  const allConnectionsWithoutAdmin =
    await connectionService.findAllWithoutAdmin();

  // emitir o evento para todos os admin
  io.emit("admin_list_all_users", allConnectionsWithoutAdmin);

  //emitir para o socket conectado
  socket.on("admin_list_message_by_user", async (params, callback) => {
    const { user_id } = params;

    const allMessages = await messageService.listByUser(user_id);

    callback(allMessages);
  });

  socket.on("admin_send_message", async (params) => {
    const { user_id, text } = params;

    await messageService.create({
      text,
      user_id,
      admin_id: socket.id,
    });

    const { socket_id } = await connectionService.findByUserId(user_id);

    io.to(socket_id).emit("admin_send_to_client", {
      text,
      socket_id: socket.id,
    });
  });

  socket.on("admin_user_in_support", async (params) => {
    const { user_id } = params;
    await connectionService.updateAdmin(user_id, socket.id);

    const allConnectionsWithoutAdmin =
      await connectionService.findAllWithoutAdmin();

    // emitir o evento para todos os admin
    io.emit("admin_list_all_users", allConnectionsWithoutAdmin);
  });
});
