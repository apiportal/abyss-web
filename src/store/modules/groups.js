/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getGroups: ({ commit }) => {
    api.getGroups().then((response) => {
      commit('setGroups', response.data);
    });
  },
};

const mutations = {
  setGroups: (state, groups) => {
    state.items = groups;
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
