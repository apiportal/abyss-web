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
  userApiContracts: [],
  userAppContracts: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getUserContracts: ({ commit }, { uuid, refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getUserContracts(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setUserContracts', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setUserContracts', []);
      }
    });
  },
  getUserApiContracts: ({ commit }, { uuid, refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getUserApiContracts(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setUserApiContracts', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setUserApiContracts', []);
      }
    });
  },
  getUserAppContracts: ({ commit }, { uuid, refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getUserAppContracts(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setUserAppContracts', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setUserAppContracts', []);
      }
    });
  },
};

const mutations = {
  setUserContracts: (state, userContracts) => {
    state.items = userContracts;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setUserApiContracts: (state, userApiContracts) => {
    state.userApiContracts = userApiContracts;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setUserAppContracts: (state, userAppContracts) => {
    state.userAppContracts = userAppContracts;
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
