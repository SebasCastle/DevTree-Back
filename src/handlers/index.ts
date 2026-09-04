import {validationResult } from 'express-validator'
import {v4 as uuid} from 'uuid';
import { genearteJWT } from '../Utilities/jwt';
import cloudinary from '../config/cloudinary';
import {Request, Response} from 'express'
import formidable from 'formidable'
import slug from 'slug'

import User from "../models/User";
import { checkPassword, hashPassword } from "../Utilities/auth";

export const createAccount = async (req: Request, res: Response) =>{
    // console.log (req.body);

    const {email, password} = req.body; 
    const userExis = await User.findOne({email})
    if(userExis){
        const error = new Error('El usuario ya está registrado');
        return res.status(409).json({error: error.message}); 
    }
    const handle = slug(req.body.handle, '-')
    const handleExist = await User.findOne({handle})
    if(handleExist){
        const error = new Error('Nombre de usuario no disponible');
        return res.status(409).json({error: error.message}); 
    }


    //alamcenamos el usuario en MongoDB
    // await User.create(req.body);
    
    //2da manera (instanciada)
    const user = new User(req.body);
    user.password = await hashPassword(password);
    // console.log(slug(handle,'-'))
    user.handle = handle;
    await user.save();

    res.status(201).send('Registro creado exitosamente!');
}


//login
export const login = async (req: Request, res: Response) =>{
    // console.log('login')
    // const user = new User(req.body);

        let resultError = validationResult(req)
    if(!resultError.isEmpty()){
        return res.status(409).json({resultError: resultError.array()})
    }

    const {email, password} = req.body;
    const userExis = await User.findOne({email})
    if(!userExis){
        const error = new Error('El usuario no existe');
        return res.status(409).json({error: error.message}); 
    }
    
    //comprobar password

    const isPasswordCorrect = await checkPassword(password, userExis.password)
    if(!isPasswordCorrect) {
        const error = new Error('Password invalida')
        return res.status(401).json({error: error.message})
    }
    const token = await genearteJWT({id: userExis.id});
    return res.send(token);
    // return res.send('Sesión iniciada correctamente!')
}

    //get user
export const getUser = async(req: Request, res:Response) =>{
    res.json(req.user)
}

export const updateProfile = async (req: Request, res: Response) =>{
    try {
        const {description, links} = req.body

        const handle = slug(req.body.handle, '-')

        const handleExist = await User.findOne({handle})

        if(handleExist && handleExist.mail !== req.user.mail){
            const error = new Error('Nombre de usuario no disponible');
            return res.status(409).json({error: error.message}); 
        }
        //Actualizar usuario
        req.user.description = description
        req.user.handle = handle
        req.user.links = links

        await req.user.save()

        res.status(201).send('Perfil actualizado exitosamente!')

    } catch (e) {
        const error = new Error ('Ocurrio un error')
        return res.status(500).json({error: error.message})
        
    }
}

export const uploadImg = async (req: Request, res: Response) =>{
    const form = formidable({multiples: false})
    
    try {

        form.parse(req, (error,fields ,files) =>{
            cloudinary.uploader.upload(files.file[0].filepath, {public_id: uuid()}, async function(error, result)
            {
                if(error){
                    const error = new Error('Error al subir la imagen')
                    return res.status(500).json({error: error.message})
                }
                if(result){
                    req.user.image = result.secure_url
                    await req.user.save()
                    res.json({image: result.secure_url})
                }
                // console.log(result)
            })
        })
        
    } catch (e) {
        const error = new Error('Ocurrio un error')
        return res.status(500).json({error: error.message})
    }
}

export const getUserByhandle = async (req: Request, res: Response) =>{
    try {
        const { handle } = req.params;
        const user = await User.findOne({ handle }).select('_id -__v -password')
        console.log(user)
        if(!user){
            const error = new Error('El usuario no existe');
            return res.status(404).json({error: error.message})
        }
        return res.status(200).json(user)

    } catch (e) {
        const error = new Error('Ocurrio un error')
        return res.status(500).json({error: error.message})
    }

}

export const searchByHandle = async (req: Request, res: Response) =>{

    try {
        const { handle } = req.body
        console.log(handle)
        const userExist = await User.findOne({handle})
        if(userExist){
            const error = new Error(`${handle} ya existe`)
            return res.status(409).json({error: error.message})
        }else{
            res.status(200).json(`${handle} disponible`)
        }
    } catch (e) {
        const error = new Error('Ocurrio un error')
        return res.status(500).json({error: error.message})
    }
}