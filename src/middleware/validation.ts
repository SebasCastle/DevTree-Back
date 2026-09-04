import type {NextFunction, Request, Response} from 'express'
import { validationResult } from 'express-validator'

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) =>{
    //manejo de errores
        let resultError = validationResult(req)
        if(!resultError.isEmpty()){
            return res.status(409).json({resultError: resultError.array()})
        }
        next()
}


