import jwt, {JwtPayload} from "jsonwebtoken"

export const genearteJWT = (payload) =>{
    const token = jwt.sign(payload, process.env.JWT_SECRETKEY, {
        expiresIn: '60d'
    } )
    return token
}