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
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getOrganizations: ({ commit }, { refresh = false}) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getOrganizations()
    .then((response) => {
      if (response && response.data) {
        commit('setOrganizations', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setOrganizations', []);
      }
    });
  },
  putOrganizations: ({ commit }, organization) => {
    return api.putOrganizations(organization).then((response) => {
      commit('updateOrganizations', response.data);
      return response;
    });
  },
  deleteOrganizations: ({ commit }, organization) => {
    return api.deleteOrganizations(organization.uuid).then((response) => {
      commit('setOrganizationDeleted', organization.uuid);
      return response;
    });
  },
  postOrganizations: ({ commit }, organization) => {
    return api.postOrganizations(organization).then((response) => {
      let error = false;
      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
        } else {
          commit('addOrganizations', status.response);
        }
      });
      if (error) {
        return false;
      }
      return response;
    });
  },
};

const mutations = {
  setOrganizations: (state, organizations) => {
    state.items = organizations;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateOrganizations: (state, organizations) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = organizations
        .find(organization => organization.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setOrganizationDeleted: (state, organizationUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === organizationUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
  },
  addOrganizations: (state, newOrganization) => {
    state.items = [
      ...state.items,
      newOrganization,
    ];
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
