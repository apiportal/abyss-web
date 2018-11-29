import axios from 'axios';

const verapi = axios.create(
  {
    baseURL: 'https://dev2.apiportal.com',
  },
);

export default {
  getApiData() {
    return verapi.get('/data/pet3.json');
  },
};
