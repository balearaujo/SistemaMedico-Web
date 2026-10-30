import { Server } from "./server.ts";
import { AppRoutes } from "./routes/index.ts";
import sequelizeConnection from "./conf/sequelize.connection.ts";
import dotenv from "dotenv";
dotenv.config();

const port = Number(process.env.PORT) || 3000;

async function main() {
  try {
    await sequelizeConnection.connect();
    console.log("Database successfully connected!");

    const server = new Server({ port, routes: AppRoutes.router });
    server.start();
  } catch (error) {
    console.error("Error starting the application");
    process.exit(1);
  }
}

main();