import axios from 'axios';

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
  putSubjectDirectories(subjectDirectory) {
    const { uuid, created, deleted, isdeleted, updated, ...rest } = subjectDirectory;
    return axios.put(`/oapi/subject-directories/${uuid}`, rest);
  },
  deleteSubjectDirectories(uuid) {
    return axios.delete(`/oapi/subject-directories/${uuid}`);
  },
  getSubjectDirectoryTypes() {
    return axios.get('/oapi/subject-directory-types');
  },
  getOrganizations() {
    return axios.get('/oapi/organizations');
  },
};
