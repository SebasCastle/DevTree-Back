import bycrypt from 'bcrypt'

export const hashPassword = async (pass:string) =>{
    const salt = await bycrypt.genSalt(10);
    return await bycrypt.hash(pass, salt);
}

export const checkPassword = async (userPassword, hash) =>{
    const result = await bycrypt.compare(userPassword, hash);

    return result;

}