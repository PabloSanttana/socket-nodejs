import { getCustomRepository, Repository } from "typeorm";

import { ConnectionsRepository } from "../repositories/ConnectionsRepository";
import { Connection } from "../entities/Connection";

interface IConnectionsCreate {
  socket_id: string;
  user_id: string;
  admin_id?: string;
  id?: string;
}

class ConnectionsService {
  private _connectionsRepository: Repository<Connection>;
  constructor() {
    this._connectionsRepository = getCustomRepository(ConnectionsRepository);
  }

  async create({ socket_id, user_id, admin_id, id }: IConnectionsCreate) {
    const connection = this._connectionsRepository.create({
      socket_id,
      user_id,
      admin_id,
      id,
    });

    await this._connectionsRepository.save(connection);

    return connection;
  }

  async findByUserId(user_id: string) {
    const connection = await this._connectionsRepository.findOne({ user_id });

    return connection;
  }

  async findAllWithoutAdmin() {
    const connection = await this._connectionsRepository.find({
      where: { admin_id: null },
      relations: ["user"],
    });

    return connection;
  }

  async findBySocketId(socket_id: string) {
    const connection = await this._connectionsRepository.findOne({ socket_id });

    return connection;
  }

  async updateAdmin(user_id: string, admin_id: string) {
    await this._connectionsRepository
      .createQueryBuilder()
      .update(Connection)
      .set({ admin_id })
      .where("user_id = :user_id", {
        user_id,
      })
      .execute();
  }
}

export { ConnectionsService };
