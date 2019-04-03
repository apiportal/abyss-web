/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getResourceActions: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getResourceActions()
    .then((response) => {
      commit('setResourceActions', response.data);
    })
    .catch((error) => {
      if (error.response.status === 404) {
        commit('setResourceActions', []);
      }
    });
  },
};

const mutations = {
  setResourceActions: (state, resourceActions) => {
    state.items = resourceActions;
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
