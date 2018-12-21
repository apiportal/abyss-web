/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getSubjectDirectoryTypes: ({ commit }) => {
    api.getSubjectDirectoryTypes().then((response) => {
      commit('setSubjectDirectoryTypes', response.data);
    });
  },
};

const mutations = {
  setSubjectDirectoryTypes: (state, subjectDirectoryTypes) => {
    state.items = subjectDirectoryTypes;
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
