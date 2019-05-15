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

/* eslint-disable */
import api from '@/api';

const state = {
  uuid: null,
  sessionid: null,
  organizationid: null,
  organizationname: null,
  signedIn: false,
  lastUpdatedAt: 0,
  gatewayUrl: 'https://dev2.apiportal.com/abyss-gw/',
  props: {},
};

const getters = {};

const actions = {
  getUser: ({ commit }, { principalid, sessionid, organizationid, organizationname, refresh = false }) => {
    api.getUser(principalid).then((response) => {
      if (response && response.data) {
        // set principalid
        if (principalid) {
          commit('setUuid', principalid);
          document.cookie = `abyss.principal.uuid=${principalid}; path=/;`;
        }
        // set sessionid
        if (sessionid) {
          commit('setSessionId', sessionid);
          document.cookie = `abyss.session=${sessionid}; path=/;`;
        }
        // set organizationid
        if (organizationid) {
          commit('setOrganizationId', organizationid);
          document.cookie = `abyss.login.organization.uuid=${organizationid}; path=/;`;
        }
        // set organizationname
        if (organizationname) {
          commit('setOrganizationName', organizationname);
          document.cookie = `abyss.login.organization.name=${organizationname}; path=/;`;
        }
        // set user props, just in case: another if case
        if (response.data.length > 0) {
          commit('setUserProps', response.data[0]);
        }
        // set user signedin
        commit('setUserSignedIn', true);

        // refresh, if required: for example: switch organization
        if (refresh) {
          setTimeout(function() { location.reload(); }, 10);
        }
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setUuid', null);
      }
    });
  },
  resetUser: ({ commit }) => {
    document.cookie = 'abyss.principal.uuid=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'abyss.session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'abyss.login.organization.uuid=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'abyss.login.organization.name=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    commit('setUuid', null);
    commit('setSessionId', null);
    commit('setOrganizationId', null);
    commit('setOrganizationName', null);
    commit('setUserProps', {});
    commit('setUserSignedIn', false);
  },
};

const mutations = {
  setUuid: (state, uuid) => {
    state.uuid = uuid;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setUserProps: (state, userProps) => {
    state.props = userProps;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setUserSignedIn: (state, val) => {
    state.signedIn = val;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setSessionId: (state, sessionId) => {
    state.sessionid = sessionId;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setOrganizationId: (state, organizationId) => {
    state.organizationid = organizationId;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setOrganizationName: (state, organizationName) => {
    state.organizationname = organizationName;
    state.lastUpdatedAt = (new Date()).getTime();
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
