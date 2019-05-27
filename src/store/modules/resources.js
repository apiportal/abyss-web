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
  getResources: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getResources()
    .then((response) => {
      if (response && response.data) {
        commit('setResources', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setResources', []);
      }
    });
  },
  putResources: ({ commit }, resource) => {
    return api.putResources(resource).then((response) => {
      commit('updateResources', response.data);
      return response;
    });
  },
  deleteResources: ({ commit }, resource) => {
    return api.deleteResources(resource.uuid).then((response) => {
      commit('setResourceDeleted', resource.uuid);
      return response;
    });
  },
  postResources: ({ commit }, resource) => {
    return api.postResources(resource).then((response) => {
      let error = false;

      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
        } else {
          commit('addNewResource', status.response);
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
  setResources: (state, resources) => {
    state.items = resources;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateResources: (state, resources) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = resources
        .find(resource => resource.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setResourceDeleted: (state, resourceUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === resourceUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
  },
  addNewResource: (state, newResource) => {
    state.items = [
      ...state.items,
      newResource,
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
