/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
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
};

const mutations = {
  setUserContracts: (state, contracts) => {
    state.items = contracts;
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
