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
import Helpers from '@/helpers';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getApisSharedByUser: ({ commit }, { uuid, refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getApisSharedByUser(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setApisSharedByUser', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setApisSharedByUser', []);
      }
    });
  },
};

const mutations = {
  setApisSharedByUser: (state, apisSharedByUser) => {
    // Remove after api is fixed
    state.items = Helpers.getUnique(apisSharedByUser, 'uuid');
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
