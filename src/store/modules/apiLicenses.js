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
  getApiLicensesRefs: ({ commit }) => {
  // getApiLicensesRefs: ({ rootState, commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getApiLicensesRefs()
    // api.getApiLicensesRefsByUuid(rootState.user.uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setApiLicensesRefs', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setApiLicensesRefs', []);
      }
    });
  },
  putApiLicensesRefs: ({ commit }, apilicense) => {
    return api.putApiLicensesRefs(apilicense).then((response) => {
      commit('updateApiLicensesRefs', response.data);
      return response;
    });
  },
  deleteApiLicensesRefs: ({ commit }, apilicense) => {
    return api.deleteApiLicensesRefs(apilicense.uuid).then((response) => {
      commit('setApilicenseDeleted', apilicense.uuid);
      return response;
    });
  },
  postApiLicensesRefs: ({ commit }, apilicense) => {
    return api.postApiLicensesRefs(apilicense).then((response) => {
      let error = false;
      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
        } else {
          commit('addApiLicensesRefs', status.response);
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
  setApiLicensesRefs: (state, apilicenses) => {
    state.items = apilicenses;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateApiLicensesRefs: (state, apilicenses) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = apilicenses
        .find(apilicense => apilicense.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setApilicenseDeleted: (state, apilicenseUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === apilicenseUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
  },
  addApiLicensesRefs: (state, newApiLicense) => {
    state.items = [
      ...state.items,
      newApiLicense,
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
