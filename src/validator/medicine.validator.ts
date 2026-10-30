import { param } from "express-validator";

export const medicineIdValidator = [
    param("id").isInt({ min: 1 }).withMessage("id must be a positive integer"),
];