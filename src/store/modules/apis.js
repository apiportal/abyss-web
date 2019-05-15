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
  getApis: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getApis()
    .then((response) => {
      if (response && response.data) {
        commit('setApis', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setApis', []);
      }
    });
  },
  putApis: ({ commit }, apiToPut) => {
    return api.putApis(apiToPut).then((response) => {
      commit('updateApis', response.data);
      return response;
    });
  },
  postApis: ({ commit }, apiToPost) => {
    return api.postApis(apiToPost).then((response) => {
      const apis = response.data.map((item) => item.response);
      commit('addNewApis', apis);
      return response;
    });
  },
};

const mutations = {
  setApis: (state, apis) => {
    state.items = apis;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateApis: (state, apis) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = apis
        .find(api => api.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  addNewApis: (state, apis) => {
    state.items = [
      ...state.items,
      ...apis,
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
