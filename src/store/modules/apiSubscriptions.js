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
    api.getApiSubscriptions(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setApiSubscriptions', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setApiSubscriptions', []);
      }
    });
  },
};

const mutations = {
  setApiSubscriptions: (state, apiSubscriptions) => {
    state.items = apiSubscriptions.filter(item => item.resourceactionid === 'c5639f00-94c9-4cc9-8ad9-df76f9d162a8');
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
