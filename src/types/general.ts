export type RequestResponse = {
  status: number,
  data?: object,
  mss?: string,
}

export type Filters = {
  [key: string]: string | number | {[key: string]: string}
}

export type ScheduleForm = {
  title: string,
  description: string,
  tag: string,
  notify: boolean,
  allDay: boolean,
  startTime: string,
  endTime: string,
}