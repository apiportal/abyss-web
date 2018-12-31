/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getUsers: ({ commit }) => {
    api.getUsers().then((response) => {
      commit('setUsers', response.data);
    });
  },
};

const mutations = {
  setUsers: (state, organizations) => {
    state.items = organizations;
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
