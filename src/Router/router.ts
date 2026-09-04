import {Router} from 'express'
import {body} from 'express-validator'
import { createAccount, getUser, getUserByhandle, login, searchByHandle, updateProfile, uploadImg } from '../handlers'
import { handleInputErrors } from '../middleware/validation'
import { authenticate } from '../middleware/auth'


const router = Router()

router.post('/auth/register',
    body('handle').notEmpty().withMessage('Campo handle vacio'),
    body('name').notEmpty().withMessage('Campo name vacio'),
    body('email').isEmail().withMessage('Campo email vacio'),
    body('password').isLength({min:8}).withMessage('Campo password es menor a 8 caracteres'),
    handleInputErrors,
    createAccount, (req,res) =>{
        console.log(req.body, "se imprimo el request")
    })

router.post('/login',
    body('email').isEmail().withMessage('E-amial no válido'),
    body('password').isLength({min:8}).withMessage('el Password es obligatorio'),
    login)

router.get('/user',authenticate, getUser)
router.patch('/user',
    body('handle').notEmpty().withMessage('Campo handle no puede estar vacio'),
    authenticate, updateProfile)

router.post('/user/image', authenticate, uploadImg)

router.get('/:handle', getUserByhandle)

router.post('/search',
    body('handle').notEmpty().withMessage('El handle no puede ir vacio'),
    handleInputErrors,
    searchByHandle)


export default router
