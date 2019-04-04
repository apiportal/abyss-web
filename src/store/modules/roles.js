/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getRoles: ( { commit }, { refresh = false })  => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getRoles()
    .then((response) => {
      if (response && response.data) {
        commit('setRoles', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setRoles', []);
      }
    });
  }
};

const mutations = {
  setRoles: (state, roles) => {
    state.items = roles;
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