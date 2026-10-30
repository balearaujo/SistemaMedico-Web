import { Router } from "express";
import { MedicineController } from "../controllers/medicine.controllers.ts";
import { medicineIdValidator } from "../validator/medicine.validator.ts";
import { validate } from "../middelware/validate.ts";

const medicineController = new MedicineController();

export class MedicineRoutes {
    static get router(): Router {
        const router = Router();

        router.get('/search', medicineController.searchMedicines);
        router.get("/:id", medicineIdValidator, validate, medicineController.getMedicineById);
        router.post('/', medicineController.createMedicine);

        return router;
    }
}   
