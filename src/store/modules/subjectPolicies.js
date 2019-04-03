/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getSubjectPolicies: ({ commit }, { uuid, refresh = false  }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh ) {
      return false;
    }
    api.getSubjectPolicies(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setSubjectPolicies', response.data);
      }
    })
    .catch((error) => {
      if (error.response.status === 404) {
        commit('setSubjectPolicies', []);
      }
    });
  },
};

const mutations = {
  setSubjectPolicies: (state, subjectPolicies) => {
    state.items = subjectPolicies;
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
