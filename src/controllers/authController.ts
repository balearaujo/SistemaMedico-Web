import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.models'; // Con llaves, tal como se exportó

const MAX_FAILED_ATTEMPTS = 3;
const LOCK_TIME_MINUTES = 15;

export const login = async (req: Request, res: Response): Promise<any> => {
    const { username, password } = req.body;

    try {
        const user: any = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        if (user.locked_until && new Date(user.locked_until) > new Date()) {
            return res.status(403).json({ 
                message: 'Cuenta bloqueada temporalmente por demasiados intentos fallidos. Intente más tarde.' 
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            const newAttempts = user.failed_attempts + 1;
            let lockUntil = null;

            if (newAttempts >= MAX_FAILED_ATTEMPTS) {
                lockUntil = new Date(Date.now() + LOCK_TIME_MINUTES * 60 * 1000);
            }

            await user.update({
                failed_attempts: newAttempts,
                locked_until: lockUntil
            });

            return res.status(401).json({ 
                message: newAttempts >= MAX_FAILED_ATTEMPTS 
                    ? 'Demasiados intentos fallidos. Su cuenta ha sido bloqueada por 15 minutos.' 
                    : 'Usuario o contraseña incorrectos' 
            });
        }

        await user.update({
            failed_attempts: 0,
            locked_until: null
        });

        const token = jwt.sign(
            { id_user: user.id_user, role: user.role },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '8h' }
        );

        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id_user: user.id_user,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};