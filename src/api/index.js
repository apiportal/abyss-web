import axios from 'axios';

// const verapi = axios.create(
//   {
//     baseURL: 'https://dev2.apiportal.com/abyss',
//   },
// );
axios.defaults.baseURL = 'https://dev2.apiportal.com/abyss';
axios.defaults.headers.common.Accept = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;
axios.defaults.responseType = 'json';

export default {
  getSubjectDirectories() {
    return axios.get('/oapi/subject-directories');
  },
};
