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
  getAccessManagerTypes: ({ commit }, { refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getAccessManagerTypes()
    .then((response) => {
      if (response && response.data) {
        commit('setAccessManagerTypes', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setAccessManagerTypes', []);
      }
    });
  },
  putAccessManagerTypes: ({ commit }, accessManagerType) => {
    return api.putAccessManagerTypes(accessManagerType).then((response) => {
      commit('updateAccessManagerTypes', response.data);
      return response;
    });
  },
  deleteAccessManagerTypes: ({ commit }, accessManagerType) => {
    return api.deleteAccessManagerTypes(accessManagerType.uuid).then((response) => {
      commit('setAccessManagerTypeDeleted', accessManagerType.uuid);
      return response;
    });
  },
  postAccessManagerTypes: ({ commit }, accessManagerType) => {
    return api.postAccessManagerTypes(accessManagerType).then((response) => {
      let error = false;
      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
        } else {
          commit('addAccessManagerTypes', status.response);
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
  setAccessManagerTypes: (state, accessManagerTypes) => {
    state.items = accessManagerTypes;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateAccessManagerTypes: (state, accessManagerTypes) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = accessManagerTypes
        .find(accessManagerType => accessManagerType.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setAccessManagerTypeDeleted: (state, accessManagerTypeUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === accessManagerTypeUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
  },
  addAccessManagerTypes: (state, newAccessManagerType) => {
    state.items = [
      ...state.items,
      newAccessManagerType,
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
