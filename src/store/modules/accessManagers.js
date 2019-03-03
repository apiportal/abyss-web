/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {
  // setAccessManagers: (state) => {
  //   return state.accessManagers;
  // },
};

const actions = {
  getAccessManagers: ({ commit }, { refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getAccessManagers().then((response) => {
      commit('setAccessManagers', response.data);
    });
  },
  putAccessManagers: ({ commit }, accessManager) => {
    api.putAccessManagers(accessManager).then((response) => {
      commit('updateAccessManagers', response.data);
    });
  },
};

const mutations = {
  setAccessManagers: (state, accessManagers) => {
    state.items = accessManagers;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateAccessManagers: (state, accessManagers) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = accessManagers
        .find(accessManager => accessManager.uuid === item.uuid);
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
