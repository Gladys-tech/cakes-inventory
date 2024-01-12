import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        console.log('Password Comparison:', isPasswordValid);
        return isPasswordValid;
    } catch (error) {
        console.error('Error during password comparison:', error);
        return false;
    }
};
