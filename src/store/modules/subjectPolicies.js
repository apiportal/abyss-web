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
  getSubjectPolicies: ({ commit }, { uuid, refresh = false  }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh ) {
      return false;
    }
    api.getSubjectPolicies(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setSubjectPolicies', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setSubjectPolicies', []);
      }
    });
  },
  putPolicies: ({ commit }, policy) => {
    return api.putPolicies(policy).then((response) => {
      commit('updatePolicies', response.data);
      return response;
    });
  },
  deletePolicies: ({ commit }, policy) => {
    return api.deletePolicies(policy.uuid).then((response) => {
      commit('setPolicyDeleted', policy.uuid);
      return response;
    });
  },
  postPolicies: ({ commit }, policy) => {
    return api.postPolicies(policy).then((response) => {
      let error = false;

      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
        } else {
          commit('addNewPolicy', status.response);
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
  setSubjectPolicies: (state, subjectPolicies) => {
    state.items = subjectPolicies;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updatePolicies: (state, policies) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = policies
        .find(policy => policy.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setPolicyDeleted: (state, policyUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === policyUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  addNewPolicy: (state, newPolicy) => {
    state.items = [
      ...state.items,
      newPolicy,
    ];
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
