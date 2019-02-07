/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getApisSharedWithUser: ({ commit }, userUuid) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getApisSharedWithUser(userUuid).then((response) => {
      if (response && response.data) {
        commit('setApisSharedWithUser', response.data);
      }
    });
  },
};

const mutations = {
  setApisSharedWithUser: (state, apisSharedWithUser) => {
    state.items = apisSharedWithUser;
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
