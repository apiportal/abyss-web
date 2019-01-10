/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getGroups: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getGroups().then((response) => {
      if (response && response.data) {
        commit('setGroups', response.data);
      }
    });
  },
  putGroups: ({ commit }, group) => {
    // api.putSubjects(group).then((response) => {
    //   commit('updateGroups', response.data);
    // });
  },
};

const mutations = {
  setGroups: (state, groups) => {
    state.items = groups;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateGroups: (state, groups) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = groups
        .find(group => group.uuid === item.uuid);
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
