import Schedules from '@src/models/Schedules';
import { Op } from 'sequelize';
import { Filters, RequestResponse, ScheduleForm } from '@src/types';

/**
 * Formats filters to be used in a where query
 * @param filters Filters
 * @returns object
 */
function formatFilters(filters: Filters) {
  const formattedFilters : any = {};
  Object.keys(filters).forEach((filterKey)=> {
    if(typeof(filters[filterKey]) === 'object') {
      formattedFilters[filterKey] =  {
        [Op.between]: [filters[filterKey].start, filters[filterKey].end]
      };
    } else {
      formattedFilters[filterKey] = filters[filterKey];
    }
  });
  return formattedFilters;
}

/**
 * Validates Schedule fields
 * @param form Schedule data coming from request
 * @returns RequestResponse
 */
function validateField(form: ScheduleForm) {
  let validated = true;
  Object.keys(form).forEach((fieldKey) => {
    const field =form[fieldKey as keyof ScheduleForm];
    if(field === null || field === undefined) {
      validated = false;
    }
    if(typeof(field) === 'string') {
      if (field === '')
        validated = false;
    }
  });
  return validated;
}

const ScheduleRepository = {
  /**
   * Returns schedule from the given Id
   * @param scheduleId Schedule Id
   * @param userId Id from user who is requesting
   * @returns RequestResponse
   */
  async getScheduleById(scheduleId: number, userId: number) {
    let scheduleData;

    try {
      scheduleData = await Schedules.findOne({where:{id:scheduleId, user:userId}});
    } catch (error) {
      return {mss: 'Error on database access', status: 500};
    };

    if(!scheduleData) return {mss: 'Schedule not found or you are not the schedule owner ', status: 404};

    return {data: scheduleData, status: 200};
  },

  /**
   * Returns all schedules from user who is requesting
   * @param userId Id from user who is requesting
   * @param filters Query filters
   * @returns RequestResponse
   */
  async getAllSchedules(userId: number, filters: Filters = {}) {
    let schedules; 

    filters.user = userId;

    const formattedFilters = formatFilters(filters);

    try {
      schedules = await Schedules.findAll(
        {
          where:formattedFilters
        }
      );
    } catch (error) {
      return {mss: 'Error on database access', status: 500};
    }

    if(!schedules) return {mss: 'No schedule not found', status: 404};

    return {data: schedules, status: 200};
  },

  /**
   * Creates a new schedule
   * @param form Object with schedule fields
   * @param usermId Id from user who is requesting 
   * @returns RequestResponse
   */
  async createNewSchedule(form: ScheduleForm, usermId: number) : Promise<RequestResponse> {
    const validated = validateField(form);

    if(!validated) return {mss: 'Invalid Data', status: 405};

    try {
      await Schedules.create({...form, user: usermId});
    } catch (error) {
      return {mss: 'Error on database access', status: 500};
    }

    return {mss:'', status:200};
  }
};

export default ScheduleRepository;