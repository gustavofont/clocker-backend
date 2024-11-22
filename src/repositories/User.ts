import Users from '@src/models/Users';
import { User, RequestResponse } from '@src/types/';
import bcryptjs from 'bcryptjs';

const numSaltRounds = 8;

function userDataValidation(params: any, fields: string[]): boolean{
  if(!params.userData) return false;

  // Validate fields
  let validate = true;
  fields.forEach((field) => {
    if(!params.userData[field] || params.userData[field] === '') {
      validate = false;
    } 
  });

  return validate;
}

async function encryptPassword(password: string) {
  return await bcryptjs.hash(password, numSaltRounds);
}

const UserRepository = {
  /**
   * Create user
   * @param params request params
  */
  async createuser(params: any) : Promise<RequestResponse>{
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

    if(invalidEmail) return {mss: 'Email already in use', status: 500};

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
   * Delete an user given email
   * @param params request params
   */
  async deleteUser(params: any): Promise<RequestResponse> {
    // Data validation
    if(!userDataValidation(params, ['email'])){
      return {mss: 'Invalid Data', status: 405};
    }
    
    const { email } = params.userData;
    let emailExists;

    // Email validation
    try {
      const res = await Users.findOne({where: {email: email}});
      if(res) emailExists = true;
    } catch (error) {
      return {mss: 'Error on database access', status: 500};
    }
    if (!emailExists) return {mss: 'Account do not exist', status: 405};

    try {
      Users.destroy({where:{email}});
    } catch (error) {
      return {mss: 'Error on database access', status: 500};
    }
    return {mss:'', status:200};
  },
  /**
   * Get user data given an Id
   * @param userId User Id
   */
  async getUserById(userId: number): Promise<RequestResponse> {
    // Id validation;
    if(!userId) return {mss: 'Invalid Data', status: 405};
    
    // Get User
    let userData;
    try {
      userData = await Users.findOne({where:{id:userId},attributes:['email', 'name', 'active', 'createdAt']});
    } catch (error) {
      return {mss: 'Error on database access', status: 500};
    }

    if(!userData) return {mss: 'User not found', status: 404};

    return {data: userData, status: 200};
  },

  async getOwnUser(params: any): Promise<RequestResponse> {
    if(!params.user) return {mss: 'Invalid Data', status: 405};

    const { email } = params.user;

    let userData;
    try {
      userData = await Users.findOne({where:{email}, attributes:['email', 'name', 'active', 'createdAt']});
    } catch (error) {
      return {mss: 'Error on database access', status: 500};
    }

    if(!userData) return {mss: 'User not found', status: 404};

    return { data: userData, status:200};
  }
};

export default UserRepository;