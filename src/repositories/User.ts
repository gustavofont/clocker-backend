import Users from '@src/models/Users';
import { RequestResponse } from '@src/types/';
import { userDataValidation } from './utils';

const UserRepository = {
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

  /**
   * Get data from who is requesting
   * @param userId User Id
   */
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