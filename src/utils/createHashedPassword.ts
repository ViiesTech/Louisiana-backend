import bcrypt from "bcrypt"

export const createHashedPassword = async (password: string) => {
    try {
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salt)
        return hashedPassword
    } catch (error) {
        return error
    }
}
