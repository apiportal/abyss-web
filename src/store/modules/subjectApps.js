/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getSubjectApps: ({ commit }, { uuid, refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getSubjectApps(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setSubjectApps', response.data);
      }
    })
    .catch((error) => {
      if (error.response.status === 404) {
        commit('setSubjectApps', []);
      }
    });
  },
};

const mutations = {
  setSubjectApps: (state, apps) => {
    state.items = apps;
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
