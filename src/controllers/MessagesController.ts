import { Request, Response } from "express";

import { MessagesService } from "../services/MessagesService";

class MessagesController {
  async create(req: Request, res: Response): Promise<Response> {
    const { admin_id, text, user_id } = req.body;

    const messagesService = new MessagesService();

    try {
      const message = await messagesService.create({
        admin_id,
        text,
        user_id,
      });

      return res.status(200).json(message);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async showByUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const messagesService = new MessagesService();

    const list = await messagesService.listByUser(id);

    return res.status(200).json(list);
  }
}

export { MessagesController };
