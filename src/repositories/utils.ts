export function userDataValidation(params: any, fields: string[]): boolean{
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
