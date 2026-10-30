import { Router } from "express";
import { login } from "../controllers/authController";

export class AuthRoutes {
    static get router(): Router {
        const router = Router();
        router.post("/login", login);
        return router;
    }
}