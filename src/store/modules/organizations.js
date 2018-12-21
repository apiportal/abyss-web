/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getOrganizations: ({ commit }) => {
    api.getOrganizations().then((response) => {
      commit('setOrganizations', response.data);
    });
  },
};

const mutations = {
  setOrganizations: (state, organizations) => {
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
