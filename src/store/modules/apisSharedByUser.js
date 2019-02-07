/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getApisSharedByUser: ({ commit }, userUuid) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getApisSharedByUser(userUuid).then((response) => {
      if (response && response.data) {
        commit('setApisSharedByUser', response.data);
      }
    });
  },
};

const mutations = {
  setApisSharedByUser: (state, apisSharedByUser) => {
    state.items = apisSharedByUser;
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
