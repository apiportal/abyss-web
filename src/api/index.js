import axios from 'axios';

axios.defaults.baseURL = 'https://dev2.apiportal.com';
// axios.defaults.headers.common.Accept = 'application/json';
// axios.defaults.headers.common['Content-Type'] = 'application/json';
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:8080';
axios.defaults.withCredentials = true;
// axios.defaults.timeout = 10000;
// axios.defaults.responseType = 'json';

export default {
  // subject-directories
  getSubjectDirectories() {
    return axios.get('/abyss/oapi/subject-directories');
  },
  putSubjectDirectories(subjectDirectory) {
    const { uuid, created, deleted, isdeleted, updated, ...rest } = subjectDirectory;
    return axios.put(`/abyss/oapi/subject-directories/${uuid}`, rest);
  },
  deleteSubjectDirectories(uuid) {
    return axios.delete(`/abyss/oapi/subject-directories/${uuid}`);
  },
  // subject-directory-types
  getSubjectDirectoryTypes() {
    return axios.get('/abyss/oapi/subject-directory-types');
  },
  // organizations
  getOrganizations() {
    return axios.get('/abyss/oapi/organizations');
  },
  // users
  getUsers() {
    return axios.get('/abyss/oapi/subjects/users/');
  },
  putUsers(user) {
    const { uuid, created, deleted, updated, totallogincount,
      failedlogincount, invalidpasswordattemptcount, isactivated,
      ispasswordchangerequired, lastauthenticatedat, lastfailedloginat,
      lastloginat, lastpasswordchangeat, passwordexpiresat, ...rest } = user;
    return axios.put(`/abyss/oapi/subjects/${uuid}`, rest);
  },
  deleteUsers(uuid) {
    return axios.delete(`/abyss/oapi/subjects/${uuid}`);
  },
  postUsers(user) {
    return axios.post('/abyss/oapi/subjects/', user);
  },
  // subject search
  getSubjectSearch(params) {
    return axios.post('/subject*/_search', params, {
      withCredentials: false,
    });
  },
  // access managers
  getAccessManagers() {
    return axios.get('/abyss/oapi/access-managers');
  },
  putAccessManagers(accessManager) {
    const { uuid, created, deleted, isdeleted, updated, ...rest } = accessManager;
    return axios.put(`/abyss/oapi/access-managers/${uuid}`, rest);
  },
  deleteAccessManagers(uuid) {
    return axios.delete(`/abyss/oapi/access-managers/${uuid}`);
  },
  getAccessManagerTypes() {
    return axios.get('/abyss/oapi/access-manager-types');
  },
  // groups
  getGroups() {
    return axios.get('/abyss/oapi/subjects/groups/');
  },
  // subject-memberships
  getSubjectMemberships(uuid) {
    return axios.get(`/abyss/oapi/subject-memberships/subject/${uuid}`);
  },
  // subject-memberships all
  getAllSubjectMemberships() {
    return axios.get('/abyss/oapi/subject-memberships');
  },
  // update subjects
  putSubjects(subject) {
    const { uuid, created, deleted, isdeleted, updated,
      invalidpasswordattemptcount, ispasswordchangerequired, passwordexpiresat,
      totallogincount, failedlogincount, lastloginat, lastpasswordchangeat,
      isactivated, lastauthenticatedat, lastfailedloginat, ...rest } = subject;
    return axios.put(`/abyss/oapi/subjects/${uuid}`, rest);
  },
};
