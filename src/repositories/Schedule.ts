import Schedules from '@src/models/Schedules';
import { Op } from 'sequelize';
import { CalendarFilters, Filters, RequestResponse, ScheduleForm } from '@src/types';
import sequelize from '@src/models/DBConnection';

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
   * @param userId Id from user who is requesting 
   * @returns RequestResponse
   */
  async createNewSchedule(form: ScheduleForm, userId: number) : Promise<RequestResponse> {
    const validated = validateField(form);

    if(!validated) return {mss: 'Invalid Data', status: 405};

    try {
      await Schedules.create({...form, user: userId});
    } catch (error) {
      return {mss: 'Error on database access', status: 500};
    }

    return {mss:'', status:200};
  },

  async getCalendar(userId: number, filters: CalendarFilters) {
    const month = parseInt(filters.month);
    const year = parseInt(filters.year);

    if(month === undefined || !year) return {mss: 'Invalid Data', status: 405};

    const daysRange = new Date(year, month + 1, 0).getDate(); // last day of month

    const rangeStart = `${year}-${month +1}-01`;
    const rangeEnd = `${year}-${month +1}-${daysRange}`;

    let response;

    try {
      response = await sequelize.query(
        `
        WITH RECURSIVE seq AS (
          SELECT 0 AS n
          UNION ALL
          SELECT n + 1 FROM seq WHERE n < DATEDIFF('${rangeEnd}', '${rangeStart}')
        ),
        dates AS (
          SELECT DATE_ADD('${rangeStart}', INTERVAL n DAY) AS day FROM seq
        ),
        user_schedules AS (
          SELECT
            title,
            startTime,
            DATE(startTime) AS day,
            endTime,
            description,
            tag,
            notify,
            allday,
            user
          FROM schedules
          WHERE user = ${userId}
        )
        SELECT
          d.day,
          COALESCE(
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'title', us.title,
                'startTime', TIME(us.startTime),
                'endTime', TIME(us.endTime),
                'description', us.description,
                'tag', us.tag,
                'notify', us.notify,
                'allDay', us.allDay
              )
            ),
            JSON_ARRAY()
          ) AS schedules
        FROM dates d
        LEFT JOIN user_schedules us ON DATE(us.startTime) = d.day
        GROUP BY d.day
        ORDER BY d.day;
        `
      );
    } catch (error) {
      return {mss: 'Error on database access', status: 500};
    }

    const data = response[0].map((schedule: any) => {
      if(schedule.schedules[0].title === null) {
        schedule.schedules = [];
      }

      return schedule;
    });

    return {data, status: 200};
  }

};

export default ScheduleRepository;