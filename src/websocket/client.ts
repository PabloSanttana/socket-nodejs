import { io } from "../app";

import { ConnectionsService } from "../services/ConnectionsService";
import { UsersService } from "../services/UsersService";
import { MessagesService } from "../services/MessagesService";

interface IParams {
  text: string;
  email: string;
}

io.on("connection", (socket) => {
  const connectionsService = new ConnectionsService();
  const usersService = new UsersService();
  const messagesService = new MessagesService();

  socket.on("client_first_access", async (params) => {
    const socket_id = socket.id;
    const { text, email } = params as IParams;

    // criando usuario ou verificando se ele existe
    const user = await usersService.create(email);

    // verificando as conecções
    const connection = await connectionsService.findByUserId(user.id);

    if (!connection) {
      // create connection
      await connectionsService.create({
        socket_id,
        user_id: user.id,
      });
    } else {
      // update connection
      connection.socket_id = socket_id;
      await connectionsService.create(connection);
    }

    await messagesService.create({
      text,
      user_id: user.id,
    });

    // listagem das messagens do usuario
    const allMessages = await messagesService.listByUser(user.id);

    socket.emit("client_list_all_messages", allMessages);

    //emit novas users
    const allUser = await connectionsService.findAllWithoutAdmin();

    io.emit("admin_list_all_users", allUser);
  });

  socket.on("client_send_to_admin", async (params) => {
    const { text, socket_admin_id } = params;

    const socket_id = socket.id;

    const { user_id } = await connectionsService.findBySocketId(socket.id);

    const message = await messagesService.create({
      text,
      user_id,
    });

    io.to(socket_admin_id).emit("admin_receiver_message", {
      message,
      socket_id,
    });
  });
});
