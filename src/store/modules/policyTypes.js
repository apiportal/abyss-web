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
  getPolicyTypes: ({ commit }, { refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh ) {
      return false;
    }
    api.getPolicyTypes()
    .then((response) => {
      if (response && response.data) {
        commit('setPolicyTypes', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setPolicyTypes', []);
      }
    });
  },
  putPolicyTypes: ({ commit }, policyType) => {
    return api.putPolicyTypes(policyType).then((response) => {
      commit('updatePolicyTypes', response.data);
      return response;
    });
  },
  deletePolicyTypes: ({ commit }, policyType) => {
    return api.deletePolicyTypes(policyType.uuid).then((response) => {
      commit('setPolicyTypeDeleted', policyType.uuid);
      return response;
    });
  },
  postPolicyTypes: ({ commit }, policyType) => {
    return api.postPolicyTypes(policyType).then((response) => {
      let error = false;
      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
        } else {
          commit('addPolicyTypes', status.response);
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
  setPolicyTypes: (state, policyTypes) => {
    state.items = policyTypes;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updatePolicyTypes: (state, policyTypes) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = policyTypes
        .find(policyType => policyType.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setPolicyTypeDeleted: (state, policyTypeUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === policyTypeUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
  },
  addPolicyTypes: (state, newPolicyType) => {
    state.items = [
      ...state.items,
      newPolicyType,
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
