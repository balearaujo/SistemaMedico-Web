import { Router } from "express";
import { MedicineController } from "../controllers/medicine.controllers.ts";
const medicineController = new MedicineController();

export class MedicineRoutes {
    static get router(): Router {
        const router = Router();

        router.get('/search', medicineController.getAllMedicines);
        router.get('/:id', medicineController.getMedicineById);

        return router;
    }
}   
