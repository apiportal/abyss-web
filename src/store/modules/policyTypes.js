/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getPolicyTypes: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
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
};

const mutations = {
  setPolicyTypes: (state, policyTypes) => {
    state.items = policyTypes;
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
