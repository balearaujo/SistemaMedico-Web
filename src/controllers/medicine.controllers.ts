import type { Request, Response } from "express";
import { Op } from "sequelize";
import  Medicine from "../models/medicine.models.ts";

export class MedicineController {
    constructor() {}

    public async searchMedicines (req: Request, res: Response) {
        try {
            const query = req.query.q as string;
            let medicines;
            if(query){
                medicines = await Medicine.findAll({
                    where: {
                        [Op.or]:[
                            {brand_name : { [Op.like]: `%${query}%` } },
                            {generic_name : { [Op.like]: `%${query}%` } }
                        ]
                    },
                    limit: 15
                });
            }else{
                medicines = await Medicine.findAll ({ limit: 15 });
            }
            return res.status(200).json(medicines);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "internal server error" });
        }
    }

    public async getMedicineById(req: Request, res: Response) {
        try {
        const id = Number(req.params.id);
        
        const medicine = await Medicine.findByPk(id);
        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }
        return res.status(200).json(medicine);
        } catch (error) {
        res.status(500).json({ message: "internal server error" });
        }
    }

    public async createMedicine (req: Request, res: Response){
        try{
            const { brand_name, generic_name, presentation, is_controlled } = req.body;
            if (!brand_name || !generic_name || !presentation){
                return res.status(400).json({ message: "Brand name, generic name and presentation are required"});
            }

            const existing = await Medicine.findOne({
                where: { brand_name, presentation}
            });

            if (existing){
                return res.status(409).json({ message: " This brand name and presentation combination already exists."});
            }

            const newMedicine = await Medicine.create({
                brand_name, 
                generic_name,
                presentation,
                is_controlled: is_controlled || false
            });
            return res.status(201).json(newMedicine);
        }catch(error){
            console.error(error);
            return res.status(500).json({ message: "Internal server error"});
        }
    }
}
