import Users from '@models/Users';
import { RequestResponse, User } from '@src/types';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { userDataValidation } from './utils';

// Enviroment config 
dotenv.config();
const jwtSecret= process.env.JWT_SECRET || '';
const numSaltRounds = parseInt(process.env.NUM_SALT_ROUNDS || '1');

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
function generateToken(userId: number, email: string) {
  const secretKey = jwtSecret?? ''; // Replace with your own secret key
  const options = {
    expiresIn: '1h', // Token expiration time
  };

  const payload = {
    id: userId,
    email
  };

  const token = jwt.sign(payload, secretKey, options);
  return token;
}

async function encryptPassword(password: string) {
  return await bcryptjs.hash(password, numSaltRounds);
}

const AuthRepository = {
   /**
   * Create user
   * @param params request params
  */
  async signup(params: any) : Promise<RequestResponse>{
    // Data validation
    if(!userDataValidation(params, ['name', 'email','password'])){
      return {mss: 'Invalid Data', status: 405};
    }

    const userData = params.userData;


    // Email validation
    let invalidEmail = false;
    try {
      const res = await Users.findOne({where: {email: userData.email}});
      if(res) invalidEmail = true;
    } catch (error) {
      return {mss: 'Error on database access', status: 500};
    }

    if(invalidEmail) return {mss: 'Email already in use', status: 405};

    // Passwrod validation
    if(userData.password){
      userData.password = await encryptPassword(userData.password);
    } else {
      return {mss: 'Missing Data(password)', status: 405};
    }
    
    // Create user
    try {
      await Users.create(userData);
    } catch (error) {
      return {mss: 'Error on database access', status: 500};
    }
    
    return {mss:'', status:200};
  },
  /**
   * Create an user signin
   * @param params requesParams
   */
  async signin(params: {userData: User}): Promise<RequestResponse> {
    // Credentials validation
    if(!params.userData || !(params.userData.email && params.userData.password)) return {mss: 'Invalid Data', status: 405};
    const { email, password } = params.userData;

    // Email validation
    let userData;
    try {
      userData = await Users.findOne({attributes:['id','password','email','name'],where:{email}});
    } catch (error) {
      return {mss: 'Error on database access', status: 500};
    }

    if(!userData) return {mss: 'User not found', status: 404};

    // Password validation
    const passwordIsCorrect = await validatePassword(password, userData.dataValues.password);

    delete userData.dataValues.password;

    if(!passwordIsCorrect) return {mss: 'Wrong password', status: 405};

    const token = generateToken(userData.dataValues.id, email);

    return {status: 200, data: {token, user: userData.dataValues}};
  },
};

export default AuthRepository;

