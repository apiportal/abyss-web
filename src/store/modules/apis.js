/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getApis: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getApis()
    .then((response) => {
      if (response && response.data) {
        commit('setApis', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setApis', []);
      }
    });
  },
};

const mutations = {
  setApis: (state, apis) => {
    state.items = apis;
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
