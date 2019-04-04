/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getPolicies: ({ commit }, { refresh = false}) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getPolicies()
    .then((response) => {
      if (response && response.data) {
        commit('setPolicies', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setPolicies', []);
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
          // alert(status.error.policymessage);
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
  setPolicies: (state, proxies) => {
    state.items = proxies;
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
  },
  addNewPolicy: (state, newPolicy) => {
    state.items = [
      ...state.items,
      newPolicy,
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
