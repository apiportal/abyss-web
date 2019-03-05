/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getApiSubscriptions: ({ commit }, { uuid, refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getApiSubscriptions(uuid).then((response) => {
      if (response && response.data) {
        commit('setApiSubscriptions', response.data);
      }
    });
  },
};

const mutations = {
  setApiSubscriptions: (state, apiSubscriptions) => {
    state.items = apiSubscriptions;
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
