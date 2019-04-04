/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getContractStates: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getContractStates()
    .then((response) => {
      if (response && response.data) {
        commit('setContractStates', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setContractStates', []);
      }
    });
  },
};

const mutations = {
  setContractStates: (state, contractStates) => {
    state.items = contractStates;
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
