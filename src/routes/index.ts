import { Router } from "express";
import {MedicineRoutes} from "./medicine.routes.ts";
import { PatientRoutes } from "./patient.routes.ts";
import { PrescriptionRoutes } from "./prescription.routes.ts";


export class AppRoutes {
    static get router(): Router {
        const router = Router();

        router.use("/v1/medicine", MedicineRoutes.router);
        router.use("/v1/patients", PatientRoutes.router);
        router.use("/v1/prescriptions", PrescriptionRoutes.router);
        return router;
    }
}