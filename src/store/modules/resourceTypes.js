/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getResourceTypes: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getResourceTypes()
    .then((response) => {
      commit('setResourceTypes', response.data);
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setResourceTypes', []);
      }
    });
  },
};

const mutations = {
  setResourceTypes: (state, resourceTypes) => {
    state.items = resourceTypes;
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
