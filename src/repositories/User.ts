import users from '@src/models/Users';
import { User, RequestResponse } from '@src/types/';

function userDataValidation(userData: User): boolean{
  if (userData.name === '') return false;
  if (userData.email === '') return false;
  return true;
}

const UserRepository = {
  /**
   * Create user
   * @param params request params
  */
  async createuser(params: {userData: User}) : Promise<RequestResponse>{
    const userData = params.userData;

    // User data validation
    if(!userData) {
      return {mss: 'Invalid Data', status: 405};
    }
    try {
      userDataValidation(userData);
    } catch (error) {
      return {mss: 'Invalid Data', status: 405};
    }

    // Email validation
    let invalidEmail = false;
    try {
      const res = await users.findOne({where: {email: userData.email}});
      if(res) invalidEmail = true;
    } catch (error) {
      return {mss: 'Error on database access', status: 500};
    }

    if(invalidEmail) return {mss: 'Email already in use', status: 500};
    
    // Create user
    try {
      await users.create(userData);
    } catch (error) {
      return {mss: 'Error on database access', status: 500};
    }
    
    return {mss:'', status:200};
  }
};

export default UserRepository;