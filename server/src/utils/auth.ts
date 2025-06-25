import bcryptjs from 'bcryptjs'

export const hashPassword = async (password: string) => {
    const salt = await bcryptjs.genSalt(10)
    return await bcryptjs.hash(password, salt)
}
export const comparePasswords = async (password : string, hashedPassword : string) => {
    return await bcryptjs.compare(password, hashedPassword)
}