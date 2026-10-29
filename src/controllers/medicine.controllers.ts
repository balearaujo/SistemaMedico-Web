import type { Request, Response } from "express";
import  Medicine from "../models/medicine.models.ts";

export class MedicineController {
    constructor() {}

    public async getAllMedicines(_req: Request, res: Response) {
    try {
        const medicines = await Medicine.findAll();
        res.json(medicines);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
    }
    }

    public async getMedicineById(req: Request, res: Response) {
        try {
        const id = Number(req.params.id);
        
        const medicines = await Medicine.findByPk(id);
        if (!medicines) {
            return res.status(404).json({ message: "user not found" });
        }
        return res.json(medicines);
        } catch (error) {
        res.status(500).json({ message: "internal server error" });
        }
    }
}
