/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getSubjectLicenses: ({ commit }, { uuid }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getSubjectLicenses(uuid).then((response) => {
      if (response && response.data) {
        commit('setSubjectLicenses', response.data);
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
