/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
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
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
