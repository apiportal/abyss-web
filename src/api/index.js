/*
 * Copyright 2019 Verapi Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
  postSignIn(params) {
    return axios.post('/abyss/oapi/abyss-session', params);
  },
  deleteSession(sessionId) {
    return axios.delete(`/abyss/oapi/abyss-session/${sessionId}`);
  },
  postSignUp(params) {
    return axios.post('/abyss/oapi/signup', params);
  },
  postForgotPassword(params) {
    return axios.post('/abyss/oapi/forgot-password', params);
  },
  getCheckToken(token) {
    return axios.get(`/abyss/oapi/reset-password/?v=${token}`);
  },
  // change-password
  putChangePassword(uuid, params) {
    return axios.put(`abyss/oapi/subjects/${uuid}/changepassword/`, params);
  },
  // switch organization
  putSetCurrentOrganization(params) {
    return axios.put('abyss/oapi/set-current-organization', params);
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
  getSubjectOrganizations() {
    return axios.get('/abyss/oapi/subject-organizations');
  },
  getSubjectOrganizationsByUuid(uuid) {
    return axios.get(`/abyss/oapi/subject-organizations/subject/${uuid}`);
  },
  getOrganizationsOfUser(uuid) {
    return axios.get(`/abyss/oapi/subject-organizations/subject/${uuid}`);
  },
  getUsersOfOrganizations(uuid) {
    return axios.get(`/abyss/oapi/subject-organizations/organization/${uuid}`);
  },
  putOrganizations(organization) {
    const { uuid, created, deleted, isdeleted, updated, ...rest } = organization;
    return axios.put(`/abyss/oapi/organizations/${uuid}`, rest);
  },
  postOrganizations(organization) {
    return axios.post('/abyss/oapi/organizations/', organization);
  },
  deleteOrganizations(uuid) {
    return axios.delete(`/abyss/oapi/organizations/${uuid}`);
  },

  putSubjectOrganizations(subjectorganization) {
    const { uuid, created, deleted, isdeleted, updated, ...rest } = subjectorganization;
    return axios.put(`/abyss/oapi/subject-organizations/${uuid}`, rest);
  },
  postSubjectOrganizations(subjectorganization) {
    return axios.post('/abyss/oapi/subject-organizations/', subjectorganization);
  },
  deleteSubjectOrganizations(uuid) {
    return axios.delete(`/abyss/oapi/subject-organizations/${uuid}`);
  },

  // users
  getUsers() {
    return axios.get('/abyss/oapi/subjects/users/');
  },
  putUsers(user) {
    const { uuid, created, deleted, isdeleted, updated, totallogincount,
      failedlogincount, invalidpasswordattemptcount,
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
  getSubjectSearch(params, type) {
    return axios.post(`/${type}*/_search`, params, {
      withCredentials: false,
    });
  },
  getOrganizationSearch(params) {
    return axios.post('/organization*/_search', params, {
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
      lastauthenticatedat, lastfailedloginat, ...rest } = group;
    return axios.put(`/abyss/oapi/subjects/${uuid}`, rest);
  },
  deleteGroups(uuid) {
    return axios.delete(`/abyss/oapi/subjects/${uuid}`);
  },
  postGroups(group) {
    return axios.post('/abyss/oapi/subjects/', group);
  },
  // subject-memberships
  getGroupMemberships(uuid) {
    return axios.get(`/abyss/oapi/subject-memberships/group/${uuid}`);
  },
  getSubjectMemberships(uuid) {
    return axios.get(`/abyss/oapi/subject-memberships/subject/${uuid}`);
  },
  getAllRoleMemberships() {
    return axios.get('/abyss/oapi/subject-memberships/user-role/');
  },
  getRoleMemberships(uuid) {
    return axios.get(`/abyss/oapi/subject-memberships/${uuid}`);
  },
  postRoleMemberships(subjectmemberships) {
    return axios.post('/abyss/oapi/subject-memberships/user-role/', subjectmemberships);
  },
  deleteRoleMemberships() {
    return axios.delete('/abyss/oapi/subject-memberships/user-role/');
  },
  getAllGroupRoleMemberships() {
    return axios.get('/abyss/oapi/subject-memberships/group-role/');
  },
  postGroupRoleMemberships(subjectmemberships) {
    return axios.post('/abyss/oapi/subject-memberships/group-role/', subjectmemberships);
  },
  deleteGroupRoleMemberships() {
    return axios.delete('/abyss/oapi/subject-memberships/group-role/');
  },
  getAllSubjectMemberships() {
    return axios.get('/abyss/oapi/subject-memberships');
  },
  putSubjectMemberships(subjectmemberships) {
    const { uuid, created, deleted, isdeleted, updated, ...rest } = subjectmemberships;
    return axios.put(`/abyss/oapi/subject-memberships/${uuid}`, rest);
  },
  postSubjectMemberships(subjectmemberships) {
    return axios.post('/abyss/oapi/subject-memberships/', subjectmemberships);
  },
  deleteSubjectMemberships(uuid) {
    return axios.delete(`/abyss/oapi/subject-memberships/${uuid}`);
  },
  getUserAppMembership() {
    return axios.get('/abyss/oapi/subject-memberships/user-app/');
  },
  getUserGroupMembership() {
    return axios.get('/abyss/oapi/subject-memberships/user-group/');
  },
  postUserGroupMembership(userGroupMembership) {
    return axios.post('/abyss/oapi/subject-memberships/user-group/', userGroupMembership);
  },
  putUserGroupMembership(userGroupMembership) {
    const { uuid, created, updated, deleted, isdeleted, ...rest } = userGroupMembership;
    return axios.put('/abyss/oapi/subject-memberships/user-group/', rest);
  },
  deleteUserGroupMembership(uuid) {
    return axios.delete(`/abyss/oapi/subject-memberships/group/${uuid}`);
  },
  // resources
  getResources() {
    return axios.get('/abyss/oapi/resources');
  },
  putResources(resource) {
    const { uuid, created, deleted, isdeleted, updated, ...rest } = resource;
    return axios.put(`/abyss/oapi/resources/${uuid}`, rest);
  },
  postResources(resource) {
    return axios.post('/abyss/oapi/resources/', resource);
  },
  deleteResources(uuid) {
    return axios.delete(`/abyss/oapi/resources/${uuid}`);
  },
  getResource(uuid) {
    return axios.get(`/abyss/oapi/resources/reference/${uuid}`);
  },
  getSubjectResources(uuid) {
    return axios.get(`/abyss/oapi/resources/subject/${uuid}`);
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
  putBulkPermissions(permissions) {
    return axios.put('/abyss/oapi/subject-permissions/', permissions);
  },
  deletePermissions(uuid) {
    return axios.delete(`/abyss/oapi/subject-permissions/${uuid}`);
  },
  postPermissions(permission) {
    return axios.post('/abyss/oapi/subject-permissions', permission);
  },
  getSubjectPermissions(uuid) {
    return axios.get(`/abyss/oapi/subject-permissions/subject/${uuid}`);
  },
  // subject-types
  getSubjectTypes() {
    return axios.get('/abyss/oapi/subject-types');
  },
  // subjects > permissions
  getSubject(uuid) {
    return axios.get(`/abyss/oapi/subjects/${uuid}`);
  },
  // update subjects
  /* putSubjects(subject) {
    const { uuid, created, deleted, isdeleted, updated,
      invalidpasswordattemptcount, ispasswordchangerequired, passwordexpiresat,
      totallogincount, failedlogincount, lastloginat, lastpasswordchangeat,
      lastauthenticatedat, lastfailedloginat, ...rest } = subject;
    return axios.put(`/abyss/oapi/subjects/${uuid}`, rest);
  }, */
  // user apps cascaded
  getUserAppsCascaded(uuid) {
    return axios.get(`/abyss/oapi/subjects/apps/user/${uuid}`);
  },
  postAppsCascaded(app) {
    return axios.post('/abyss/oapi/subjects/apps/cascaded', app);
  },
  putAppsCascaded(app) {
    const { uuid, created, deleted, isdeleted, updated, contracts,
      invalidpasswordattemptcount, ispasswordchangerequired, passwordexpiresat,
      totallogincount, failedlogincount, lastloginat, lastpasswordchangeat,
      lastauthenticatedat, lastfailedloginat, ...rest } = app;
    return axios.put(`/abyss/oapi/subjects/apps/cascaded/${uuid}`, rest);
  },
  // SubjectApps > explore
  getSubjectApps() {
    // return axios.get(`/abyss/oapi/subject-apps/subject/${uuid}`);
    return axios.get('/abyss/oapi/subject-memberships/user-app/');
  },
  /* putSubjectApps(subjectapp) {
    const { uuid, created, deleted, isdeleted, updated, ...rest } = subjectapp;
    return axios.put(`/abyss/oapi/subject-apps/${uuid}`, rest);
    // return axios.put(`/abyss/oapi/subject-memberships/user-app/${uuid}`, rest);
  },
  postSubjectApps(subjectapp) {
    return axios.post('/abyss/oapi/subject-apps/', subjectapp);
    // return axios.post('/abyss/oapi/subject-memberships/user-app/', subjectapp);
  },
  deleteSubjectApps(uuid) {
    return axios.delete(`/abyss/oapi/subject-apps/${uuid}`);
    // return axios.delete(`/abyss/oapi/subject-memberships/user-app/${uuid}`);
  }, */
  // apps
  getApps() {
    return axios.get('/abyss/oapi/subjects/apps/');
  },
  putApps(subject) {
    const { uuid, created, deleted, isdeleted, updated, contracts,
      invalidpasswordattemptcount, ispasswordchangerequired, passwordexpiresat,
      totallogincount, failedlogincount, lastloginat, lastpasswordchangeat,
      lastauthenticatedat, lastfailedloginat, ...rest } = subject;
    return axios.put(`/abyss/oapi/subjects/${uuid}`, rest);
  },
  postApps(app) {
    return axios.post('/abyss/oapi/subjects/', app);
  },
  deleteApps(uuid) {
    return axios.delete(`/abyss/oapi/subjects/${uuid}`);
  },
  // my-apis
  getApis() {
    return axios.get('/abyss/oapi/apis');
  },
  getAllProxies() {
    return axios.get('/abyss/oapi/apis/proxies/');
  },
  putApis(api) {
    const { uuid, deleted, updated, ...rest } = api;
    return axios.put(`/abyss/oapi/apis/${uuid}`, rest);
  },
  postApis(api) {
    return axios.post('/abyss/oapi/apis/', api);
  },
  getApi(uuid) {
    return axios.get(`/abyss/oapi/apis/${uuid}`);
  },
  getBusinessApis(uuid) {
    return axios.get(`/abyss/oapi/apis/businesses/subject/${uuid}`);
  },
  putBusinessApi(api) {
    const { uuid, created, deleted, updated, businessapiid, ...rest } = api;
    return axios.put(`/abyss/oapi/apis/businesses/${uuid}`, rest);
  },
  postBusinessApi(api) {
    return axios.post('/abyss/oapi/apis/businesses/', api);
  },
  getProxies(uuid) {
    return axios.get(`/abyss/oapi/apis/proxies/subject/${uuid}`);
  },
  putProxies(api) {
    const { uuid, created, deleted, updated, ...rest } = api;
    return axios.put(`/abyss/oapi/apis/proxies/${uuid}`, rest);
  },
  postProxies(api) {
    return axios.post('/abyss/oapi/apis/proxies/', api);
  },
  getApiSubscriptions(uuid) {
    // return axios.get(`/abyss/oapi/subject-permissions/my-apis-subscriptions/subject/${uuid}`);
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
  getApiLicenses(uuid) {
    return axios.get(`/abyss/oapi/licenses/api/${uuid}`);
  },
  // policies
  getSubjectPolicies(uuid) {
    return axios.get(`/abyss/oapi/policies/subject/${uuid}`);
  },
  getPolicies() {
    return axios.get('/abyss/oapi/policies');
  },
  getLicensesOfPolicy(uuid) {
    return axios.get(`/abyss/oapi/licenses/policy/${uuid}`);
  },
  getContractsOfPolicy(uuid) {
    return axios.get(`/abyss/oapi/contracts/policy/${uuid}`);
  },
  getApisOfPolicy(uuid) {
    return axios.get(`/abyss/oapi/apis/policy/${uuid}`);
  },
  putPolicies(policy) {
    const { uuid, created, updated, deleted, isdeleted, ...rest } = policy;
    return axios.put(`/abyss/oapi/policies/${uuid}`, rest);
  },
  deletePolicies(uuid) {
    return axios.delete(`/abyss/oapi/policies/${uuid}`);
  },
  postPolicies(policies) {
    return axios.post('/abyss/oapi/policies', policies);
  },
  getPolicyTypes() {
    return axios.get('/abyss/oapi/policy-types');
  },
  putPolicyTypes(policyType) {
    const { uuid, created, deleted, isdeleted, updated, ...rest } = policyType;
    return axios.put(`/abyss/oapi/policy-types/${uuid}`, rest);
  },
  postPolicyTypes(policyType) {
    return axios.post('/abyss/oapi/policy-types/', policyType);
  },
  deletePolicyTypes(uuid) {
    return axios.delete(`/abyss/oapi/policy-types/${uuid}`);
  },
  // licenses
  getSubjectLicensesCascaded(uuid) {
    return axios.get(`/abyss/oapi/licenses/subject/${uuid}/cascaded`);
  },
  postSubjectLicensesCascaded(uuid, license) {
    return axios.post(`/abyss/oapi/licenses/subject/${uuid}/cascaded`, license);
  },
  getSubjectLicenses(uuid) {
    return axios.get(`/abyss/oapi/licenses/subject/${uuid}`);
  },
  getApiLicensesRefs() {
    return axios.get('/abyss/oapi/api-licenses/');
  },
  postApiLicensesRefs(license) {
    return axios.post('/abyss/oapi/api-licenses/', license);
  },
  deleteApiLicensesRefs(uuid) {
    return axios.delete(`/abyss/oapi/api-licenses/${uuid}`);
  },
  getLicenses() {
    return axios.get('/abyss/oapi/licenses/');
  },
  putLicenses(license) {
    const { uuid, created, updated, deleted, isdeleted, openApiLicense, ...rest } = license;
    return axios.put(`/abyss/oapi/licenses/${uuid}`, rest);
  },
  deleteLicenses(uuid) {
    return axios.delete(`/abyss/oapi/licenses/${uuid}`);
  },
  postLicenses(license) {
    return axios.post('/abyss/oapi/licenses/', license);
  },
  getContractStates() {
    return axios.get('/abyss/oapi/contract-states');
  },
  getAccessTokens(uuid) {
    return axios.get(`/abyss/oapi/resource-access-tokens/subject-permission/${uuid}`);
  },
  putAccessTokens(token) {
    const { uuid, created, updated, deleted, isdeleted, ...rest } = token;
    return axios.put(`/abyss/oapi/resource-access-tokens/${uuid}`, rest);
  },
  deleteAccessTokens(uuid) {
    return axios.delete(`/abyss/oapi/resource-access-tokens/${uuid}`);
  },
  postAccessTokens(token) {
    return axios.post('/abyss/oapi/resource-access-tokens/', token);
  },
  getAppContracts(uuid) {
    return axios.get(`/abyss/oapi/contracts/app/${uuid}`);
  },
  getApiContracts(uuid) {
    return axios.get(`/abyss/oapi/contracts/api/${uuid}`);
  },
  getLicenseContracts(uuid) {
    return axios.get(`/abyss/oapi/contracts/license/${uuid}`);
  },
  getUserContracts(uuid) {
    return axios.get(`/abyss/oapi/contracts/user/${uuid}`);
  },
  getAllContracts() {
    return axios.get('/abyss/oapi/contracts/');
  },
  getLicenseApis(uuid) {
    return axios.get(`/abyss/oapi/apis/proxies/license/${uuid}`);
  },
  // roles
  getRoles() {
    return axios.get('/abyss/oapi/subjects/roles/');
  },
  putRoles(role) {
    const { uuid, created, deleted, isdeleted, updated,
      invalidpasswordattemptcount, ispasswordchangerequired, passwordexpiresat,
      totallogincount, failedlogincount, lastloginat, lastpasswordchangeat,
      lastauthenticatedat, lastfailedloginat, ...rest } = role;
    return axios.put(`/abyss/oapi/subjects/${uuid}`, rest);
  },
  postRoles(role) {
    return axios.post('/abyss/oapi/subjects/roles/', role);
  },
  deleteRoles(uuid) {
    return axios.delete(`/abyss/oapi/subjects/${uuid}`);
  },
  // invite users
  postInviteUser(referral) {
    return axios.post('/abyss/oapi/invite-user/', referral);
  },
  // api-licenses
  getExploreApiLicenses(uuid) {
    return axios.get(`/abyss/oapi/api-licenses/api/${uuid}`);
  },
  postContracts(contracts) {
    return axios.post('/abyss/oapi/contracts', contracts);
  },
  deleteContract(uuid) {
    return axios.delete(`/abyss/oapi/contracts/${uuid}`);
  },
  postResourceAccessTokens(accessTokens) {
    return axios.post('/abyss/oapi/resource-access-tokens', accessTokens);
  },
  validateApi(api) {
    return axios.post('/abyss/oapi/validate-oas', api);
  },
  getGroupsOfRole(uuid) {
    return axios.get(`/abyss/oapi/subject-memberships/group/${uuid}`);
  },
};
