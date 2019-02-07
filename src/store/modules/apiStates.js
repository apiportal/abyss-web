/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getApiStates: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getApiStates().then((response) => {
      if (response && response.data) {
        commit('setApiStates', response.data);
      }
    });
  },
};

const mutations = {
  setApiStates: (state, apiStates) => {
    state.items = apiStates;
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
