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
  getSubjectDirectories: ({ commit }, { refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getSubjectDirectories()
    .then((response) => {
      if (response && response.data) {
        commit('setSubjectDirectories', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setSubjectDirectories', []);
      }
    });
  },
  putSubjectDirectories: ({ commit }, subjectDirectory) => {
    return api.putSubjectDirectories(subjectDirectory).then((response) => {
      commit('updateSubjectDirectories', response.data);
      return response;
    });
  },
  deleteSubjectDirectories: ({ commit }, subjectDirectory) => {
    return api.deleteSubjectDirectories(subjectDirectory.uuid).then((response) => {
      commit('setSubjectDirectoryDeleted', subjectDirectory.uuid);
      return response;
    });
  },
  postSubjectDirectories: ({ commit }, subjectDirectory) => {
    return api.postSubjectDirectories(subjectDirectory).then((response) => {
      let error = false;

      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
        } else {
          commit('addNewSubjectDirectory', status.response);
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
  setSubjectDirectories: (state, subjectDirectories) => {
    state.items = subjectDirectories;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateSubjectDirectories: (state, subjectDirectories) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = subjectDirectories
        .find(subjectDirectory => subjectDirectory.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setSubjectDirectoryDeleted: (state, subjectDirectoryUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === subjectDirectoryUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
  },
  addNewSubjectDirectory: (state, newSubjectDirectory) => {
    state.items = [
      ...state.items,
      newSubjectDirectory,
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
