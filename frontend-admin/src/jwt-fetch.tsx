export default async function jwtFetch(resource, options) {
  if (options === undefined) {
    options = {headers: {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}}
  }
  else if (options.headers === undefined) {
    options.headers = {'Authorization': `Bearer ${localStorage.getItem('jwt')}`};
  }
  else {
    options.headers.Authorization = `Bearer ${localStorage.getItem('jwt')}`;
  }
  return await fetch(resource, options);
}
