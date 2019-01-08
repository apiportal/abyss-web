/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getAccessManagerTypes: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getAccessManagerTypes().then((response) => {
      commit('setAccessManagerTypes', response.data);
    });
  },
};

const mutations = {
  setAccessManagerTypes: (state, accessManagerTypes) => {
    state.items = accessManagerTypes;
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
