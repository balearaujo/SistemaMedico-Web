import { Server } from "./server.ts";
import { AppRoutes } from "./routes/index.ts";
import sequelizeConnection from "./conf/sequelize.connection.ts";
import dotenv from "dotenv";
import { setupAssociations } from "./models/associations.ts";
dotenv.config();

const port = Number(process.env.PORT) || 3000;

async function main() {
  try {
    setupAssociations();
    await sequelizeConnection.connect();
    const server = new Server({ port, routes: AppRoutes.router });
    server.start();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();