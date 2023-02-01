import { Router } from "express";
import { MessagesController } from "./controllers/MessagesController";

import { SettingsController } from "./controllers/SettingsController";
import { UsersController } from "./controllers/UsersController";

const routes = Router();

const settingsController = new SettingsController();
const usersController = new UsersController();
const messagesController = new MessagesController();

// rotas settings
routes.post("/settings", settingsController.create);
routes.get("/settings/:username", settingsController.findByUsername);
routes.put("/settings/:username", settingsController.update);

// rotas user
routes.post("/users", usersController.create);

//rotas message
routes.get("/messages/:id", messagesController.showByUser);
routes.post("/messages", messagesController.create);

export { routes };
