/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getSubjectPermissions: ({ commit }, { uuid, refresh = false  }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh ) {
      return false;
    }
    api.getSubjectPermissions(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setSubjectPermissions', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setSubjectPermissions', []);
      }
    });
  },
};

const mutations = {
  setSubjectPermissions: (state, subjectPermissions) => {
    state.items = subjectPermissions;
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
