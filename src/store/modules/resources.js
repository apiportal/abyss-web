/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getResources: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getResources()
    .then((response) => {
      if (response && response.data) {
        commit('setResources', response.data);
      }
    })
    .catch((error) => {
      if (error.response.status === 404) {
        commit('setResources', []);
      }
    });
  },
};

const mutations = {
  setResources: (state, resources) => {
    state.items = resources;
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
