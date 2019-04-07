/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getSubjectLicenses: ({ commit }, { uuid, refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh ) {
      return false;
    }
    api.getSubjectLicenses(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setSubjectLicenses', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setSubjectLicenses', []);
      }
    });
  },
};

const mutations = {
  setSubjectLicenses: (state, licenses) => {
    state.items = licenses;
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
