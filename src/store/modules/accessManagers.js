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
  getAccessManagers: ({ commit }, { refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getAccessManagers()
    .then((response) => {
      if (response && response.data) {
        commit('setAccessManagers', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setAccessManagers', []);
      }
    });
  },
  putAccessManagers: ({ commit }, accessManager) => {
    return api.putAccessManagers(accessManager).then((response) => {
      commit('updateAccessManagers', response.data);
      return response;
    });
  },
  deleteAccessManagers: ({ commit }, accessManager) => {
    return api.deleteAccessManagers(accessManager.uuid).then((response) => {
      commit('setAccessManagerDeleted', accessManager.uuid);
      return response;
    });
  },
  postAccessManagers: ({ commit }, accessManager) => {
    return api.postAccessManagers(accessManager).then((response) => {
      let error = false;

      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
        } else {
          commit('addNewAccessManager', status.response);
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
  setAccessManagers: (state, accessManagers) => {
    state.items = accessManagers;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateAccessManagers: (state, accessManagers) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = accessManagers
        .find(accessManager => accessManager.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setAccessManagerDeleted: (state, accessManagerUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === accessManagerUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
  },
  addNewAccessManager: (state, newAccessManager) => {
    state.items = [
      ...state.items,
      newAccessManager,
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
