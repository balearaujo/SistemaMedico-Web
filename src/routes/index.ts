import { Router } from "express";
import {MedicineRoutes} from "./medicine.routes.ts";


export class AppRoutes {
    static get router(): Router {
        const router = Router();

        router.use("/v1/medicine", MedicineRoutes.router);
        return router;
    }
}