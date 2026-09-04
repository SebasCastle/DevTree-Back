import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import User, {InterUser} from "../models/User";


declare global {
    namespace Express{
        interface Request {
            user?: InterUser
        }
    }
}

export const authenticate =async (req: Request, res:Response, next: NextFunction) =>{

    const bearer = req.headers.authorization;
    if(!bearer){
        const error = new Error('No autorizado')
        return res.status(401).json({error: error.message})
    }
    const [,token] = bearer.split(' ')
    if(!token){
        const error = new Error('No autorizado')
        return res.status(401).json({error: error.message})
    }
    try {
        const result = jwt.verify(token, process.env.JWT_SECRETKEY)
    if(typeof result === 'object' && result.id){
        const user = await User.findById(result.id).select('-password')
        if(!user){
            const error = new Error('usurio no encontrado')
        return res.status(404).json({error: error.message})
        }
        req.user = user
        next()
    }
    } catch (error) {
        res.sendStatus(500).json({error:'Token no valido' })
    }
}
