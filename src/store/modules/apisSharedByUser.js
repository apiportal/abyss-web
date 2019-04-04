/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getApisSharedByUser: ({ commit }, { uuid, refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getApisSharedByUser(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setApisSharedByUser', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setApisSharedByUser', []);
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
