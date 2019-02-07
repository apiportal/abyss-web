import axios from 'axios';

axios.defaults.baseURL = 'https://dev2.apiportal.com';
// axios.defaults.headers.common.Accept = 'application/json';
// axios.defaults.headers.common['Content-Type'] = 'application/json';
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:8080';
axios.defaults.withCredentials = true;
// axios.defaults.timeout = 10000;
// axios.defaults.responseType = 'json';

export default {
  // auth
  getUser(uuid) {
    return axios.get(`/abyss/oapi/subjects/${uuid}`);
  },
  postLogin(user) {
    return axios.post('/abyss/login-auth', user);
  },
  // subject-directories
  getSubjectDirectories() {
    return axios.get('/abyss/oapi/subject-directories');
  },
  putSubjectDirectories(subjectDirectory) {
    const { uuid, created, deleted, isdeleted, updated, ...rest } = subjectDirectory;
    return axios.put(`/abyss/oapi/subject-directories/${uuid}`, rest);
  },
  postSubjectDirectories(subjectDirectory) {
    return axios.post('/abyss/oapi/subject-directories/', subjectDirectory);
  },
  deleteSubjectDirectories(uuid) {
    return axios.delete(`/abyss/oapi/subject-directories/${uuid}`);
  },
  // subject-directory-types
  getSubjectDirectoryTypes() {
    return axios.get('/abyss/oapi/subject-directory-types');
  },
  putSubjectDirectoryTypes(subjectDirectoryType) {
    const { uuid, created, deleted, isdeleted, updated, ...rest } = subjectDirectoryType;
    return axios.put(`/abyss/oapi/subject-directory-types/${uuid}`, rest);
  },
  postSubjectDirectoryTypes(subjectDirectoryType) {
    return axios.post('/abyss/oapi/subject-directory-types/', subjectDirectoryType);
  },
  deleteSubjectDirectoryTypes(uuid) {
    return axios.delete(`/abyss/oapi/subject-directory-types/${uuid}`);
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
  postAccessManagers(accessManager) {
    return axios.post('/abyss/oapi/access-managers/', accessManager);
  },
  deleteAccessManagers(uuid) {
    return axios.delete(`/abyss/oapi/access-managers/${uuid}`);
  },
  // access manager types
  getAccessManagerTypes() {
    return axios.get('/abyss/oapi/access-manager-types');
  },
  putAccessManagerTypes(accessManagerType) {
    const { uuid, created, deleted, isdeleted, updated, ...rest } = accessManagerType;
    return axios.put(`/abyss/oapi/access-manager-types/${uuid}`, rest);
  },
  postAccessManagerTypes(accessManagerType) {
    return axios.post('/abyss/oapi/access-manager-types/', accessManagerType);
  },
  deleteAccessManagerTypes(uuid) {
    return axios.delete(`/abyss/oapi/access-manager-types/${uuid}`);
  },
  // groups
  getGroups() {
    return axios.get('/abyss/oapi/subjects/groups/');
  },
  // update subjects
  putGroups(group) {
    const { uuid, created, deleted, isdeleted, updated,
      invalidpasswordattemptcount, ispasswordchangerequired, passwordexpiresat,
      totallogincount, failedlogincount, lastloginat, lastpasswordchangeat,
      isactivated, lastauthenticatedat, lastfailedloginat, ...rest } = group;
    return axios.put(`/abyss/oapi/subjects/${uuid}`, rest);
  },
  deleteGroups(uuid) {
    return axios.delete(`/abyss/oapi/subjects/${uuid}`);
  },
  postGroups(group) {
    return axios.post('/abyss/oapi/subjects/', group);
  },
  // subject-memberships
  getSubjectMemberships(uuid) {
    return axios.get(`/abyss/oapi/subject-memberships/subject/${uuid}`);
  },
  // resources
  getResources() {
    return axios.get('/abyss/oapi/resources');
  },
  // resource-types
  getResourceTypes() {
    return axios.get('/abyss/oapi/resource-types');
  },
  // resource-actions
  getResourceActions() {
    return axios.get('/abyss/oapi/resource-actions/');
  },
  // subject-permissions
  getPermissions() {
    return axios.get('/abyss/oapi/subject-permissions/');
  },
  putPermissions(permission) {
    const { uuid, created, deleted, updated, isdeleted, ...rest } = permission;
    return axios.put(`/abyss/oapi/subject-permissions/${uuid}`, rest);
  },
  deletePermissions(uuid) {
    return axios.delete(`/abyss/oapi/subject-permissions/${uuid}`);
  },
  postPermissions(permission) {
    return axios.post('/abyss/oapi/subject-permissions/', permission);
  },
  // subject-types
  getSubjectTypes() {
    return axios.get('/abyss/oapi/subject-types');
  },
  // apps
  getApps() {
    return axios.get('/abyss/oapi/subjects/apps/');
  },
  getSubject(uuid) {
    return axios.get(`/abyss/oapi/subjects/${uuid}`);
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
  // my-apis
  getBusinessApis(uuid) {
    return axios.get(`/abyss/oapi/apis/businesses/subject/${uuid}`);
  },
  getApiSubscriptions(uuid) {
    return axios.get(`/abyss/oapi/subject-permissions/api-subscriptions/subject/${uuid}`);
  },
  getApisSharedWithUser(uuid) {
    return axios.get(`/abyss/oapi/apis/sharedwith/subject/${uuid}`);
  },
  getApisSharedByUser(uuid) {
    return axios.get(`/abyss/oapi/apis/sharedby/subject/${uuid}`);
  },
  getApiStates() {
    return axios.get('/abyss/oapi/api-states');
  },
  getApiVisibilityTypes() {
    return axios.get('/abyss/oapi/api-visibility-types');
  },
  getProxies(uuid) {
    return axios.get(`/abyss/oapi/apis/proxies/subject/${uuid}`);
  },
};
