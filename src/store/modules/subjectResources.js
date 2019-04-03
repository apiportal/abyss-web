/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getSubjectResources: ({ commit }, { uuid, refresh = false  }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh ) {
      return false;
    }
    api.getSubjectResources(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setSubjectResources', response.data);
      }
    })
    .catch((error) => {
      if (error.response.status === 404) {
        commit('setSubjectResources', []);
      }
    });
  },
};

const mutations = {
  setSubjectResources: (state, subjectResources) => {
    state.items = subjectResources;
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
