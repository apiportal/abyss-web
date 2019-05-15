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
  getSubjectDirectoryTypes: ({ commit }, { refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getSubjectDirectoryTypes()
    .then((response) => {
      if (response && response.data) {
        commit('setSubjectDirectoryTypes', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setSubjectDirectoryTypes', []);
      }
    });
  },
  putSubjectDirectoryTypes: ({ commit }, subjectDirectoryType) => {
    return api.putSubjectDirectoryTypes(subjectDirectoryType).then((response) => {
      commit('updateSubjectDirectoryTypes', response.data);
      return response;
    });
  },
  deleteSubjectDirectoryTypes: ({ commit }, subjectDirectoryType) => {
    return api.deleteSubjectDirectoryTypes(subjectDirectoryType.uuid).then((response) => {
      commit('setSubjectDirectoryTypeDeleted', subjectDirectoryType.uuid);
      return response;
    });
  },
  postSubjectDirectoryTypes: ({ commit }, subjectDirectoryType) => {
    return api.postSubjectDirectoryTypes(subjectDirectoryType).then((response) => {
      let error = false;
      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
        } else {
          commit('addSubjectDirectoryType', status.response);
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
  setSubjectDirectoryTypes: (state, subjectDirectoryTypes) => {
    state.items = subjectDirectoryTypes;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateSubjectDirectoryTypes: (state, subjectDirectoryTypes) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = subjectDirectoryTypes
        .find(subjectDirectoryType => subjectDirectoryType.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setSubjectDirectoryTypeDeleted: (state, subjectDirectoryTypeUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === subjectDirectoryTypeUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
  },
  addSubjectDirectoryType: (state, newSubjectDirectoryType) => {
    state.items = [
      ...state.items,
      newSubjectDirectoryType,
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
