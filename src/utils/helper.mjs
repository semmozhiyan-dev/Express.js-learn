import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSaltSync(saltRounds);
    console.log("Generated salt:", salt);
    bcrypt.hashSync(password, salt);
    return bcrypt;

};

export const comparePassword = async (plain, hash) => {
    return bcrypt.compareSync(plain, hash);
};