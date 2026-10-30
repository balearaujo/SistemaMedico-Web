import { Router } from "express";
import { MedicineRoutes } from "./medicine.routes";
import { AuthRoutes } from "./auth.routes"; 

export class AppRoutes {
static get router(): Router {
    const router = Router();
    router.use("/v1/medicine", MedicineRoutes.router);
    router.use("/v1/auth", AuthRoutes.router); 
    return router;
}
}