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
  getSubjectOrganizations: ({ commit }) => {
  // getSubjectOrganizations: ({ rootState, commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getSubjectOrganizations()
    // api.getSubjectOrganizationsByUuid(rootState.user.uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setSubjectOrganizations', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setSubjectOrganizations', []);
      }
    });
  },
  putSubjectOrganizations: ({ commit }, subjectorganization) => {
    return api.putSubjectOrganizations(subjectorganization).then((response) => {
      commit('updateSubjectOrganizations', response.data);
      return response;
    });
  },
  deleteSubjectOrganizations: ({ commit }, subjectorganization) => {
    return api.deleteSubjectOrganizations(subjectorganization.uuid).then((response) => {
      commit('setOrganizationDeleted', subjectorganization.uuid);
      return response;
    });
  },
  postSubjectOrganizations: ({ commit }, subjectorganization) => {
    return api.postSubjectOrganizations(subjectorganization).then((response) => {
      let error = false;
      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
        } else {
          commit('addSubjectOrganizations', status.response);
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
  setSubjectOrganizations: (state, subjectorganizations) => {
    state.items = subjectorganizations;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateSubjectOrganizations: (state, subjectorganizations) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = subjectorganizations
        .find(subjectorganization => subjectorganization.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setOrganizationDeleted: (state, subjectorganizationUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === subjectorganizationUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    }).filter(item => !item.isdeleted);
  },
  addSubjectOrganizations: (state, newSubjectOrganization) => {
    state.items = [
      ...state.items,
      newSubjectOrganization,
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
