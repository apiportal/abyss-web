/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getExploreApis: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getAllProxies()
    .then((response) => {
      if (response && response.data) {
        commit('setExploreApis', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setExploreApis', []);
      }
    });
  },
};

const mutations = {
  setExploreApis: (state, apis) => {
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
