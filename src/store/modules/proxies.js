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
  getProxies: ({ commit }, { uuid, refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getProxies(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setProxies', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setProxies', []);
      }
    });
  },
  putProxies: ({ commit }, proxy) => {
    return api.putProxies(proxy).then((response) => {
      commit('updateProxies', response.data);
      return response;
    });
  },
  postProxies: ({ commit }, proxy) => {
    return api.postProxies(proxy).then((response) => {
      const proxies = response.data.map((item) => item.response);
      commit('addNewProxies', proxies);
      return response;
    });
  },
};

const mutations = {
  setProxies: (state, proxies) => {
    state.items = proxies;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateProxies: (state, proxies) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = proxies
        .find(api => api.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  addNewProxies: (state, proxies) => {
    state.items = [
      ...state.items,
      ...proxies,
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
