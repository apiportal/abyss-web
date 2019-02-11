/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getPolicies: ({ commit }, userUuid) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getPolicies(userUuid).then((response) => {
      if (response && response.data) {
        commit('setPolicies', response.data);
      }
    });
  },
};

const mutations = {
  setPolicies: (state, proxies) => {
    state.items = proxies;
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
