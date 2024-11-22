import Users from '@models/Users';
import { RequestResponse, User } from '@src/types';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Enviroment config 
dotenv.config();
const jwtSecret= process.env.JWT_SECRET || '';

/**
 * Validate password 
 * @param reqPassword password from request
 * @param dbPassword password from db
 * @returns true if password is correct, false if not.
 */
async function validatePassword(reqPassword: string, dbPassword: string) {
  const teste = await bcryptjs.compare(reqPassword, dbPassword);
  return teste;
}

/**
 * generate a token given an payload
 * @param email payload
 * @returns token
 */
function generateToken(email: string) {
  const secretKey = jwtSecret?? ''; // Replace with your own secret key
  const options = {
    expiresIn: '1h', // Token expiration time
  };

  const payload = {
    email
  };

  const token = jwt.sign(payload, secretKey, options);
  return token;
}

const AuthRepository = {
  /**
   * Create an user signin
   * @param params requesParams
   */
  async signin(params: {userData: User}): Promise<RequestResponse> {
    // Credentials validation
    if(!params.userData || !(params.userData.email && params.userData.password)) return {mss: 'Invalid Data', status: 405};
    const { email, password } = params.userData;

    // Email validation
    let userPassword;
    try {
      userPassword = await Users.findOne({attributes:['password'],where:{email}});
    } catch (error) {
      return {mss: 'Error on database access', status: 500};
    }

    if(!userPassword) return {mss: 'User not found', status: 404};

    // Password validation
    const passwordIsCorrect = await validatePassword(password, userPassword.dataValues.password);

    if(!passwordIsCorrect) return {mss: 'Wrong password', status: 405};

    const token = generateToken(email);

    return {status: 200, data: {token}};
  },
};

export default AuthRepository;

