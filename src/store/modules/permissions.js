/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getPermissions: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getPermissions().then((response) => {
      if (response && response.data) {
        commit('setPermissions', response.data);
      }
    });
  },
};

const mutations = {
  setPermissions: (state, permissions) => {
    state.items = permissions;
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
