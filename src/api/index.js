import axios from 'axios';

const verapi = axios.create(
  {
    baseURL: '/',
  },
);

export default {
  getDashboardData() {
    return verapi.get('/dashboard-data');
  },
};
