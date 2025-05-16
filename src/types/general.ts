export type RequestResponse = {
  status: number,
  data?: object,
  mss?: string,
}

export type Filters = {
  [key: string]: string | number | {[key: string]: string}
}