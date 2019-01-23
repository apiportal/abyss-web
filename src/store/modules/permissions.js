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
  putPermissions: ({ commit }, permission) => {
    api.putPermissions(permission).then((response) => {
      commit('updatePermissions', response.data);
    });
  },
};
const mutations = {
  setPermissions: (state, permissions) => {
    state.items = permissions;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updatePermissions: (state, permissions) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = permissions
        .find(permission => permission.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
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
