import bcrypt from "bcrypt"

export const verifyHashedPass = async (password: string , hashedPassword:string) => {
    try {
       const verifyPassword = await bcrypt.compare(password, hashedPassword)
       return verifyPassword
    } catch (error) {
        return error
    }
}