/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getSubjectMemberships: ({ commit }) => {
    api.getAllSubjectMemberships().then((response) => {
      commit('setSubjectMemberships', response.data);
    });
  },
};

const mutations = {
  setSubjectMemberships: (state, subjectMemberships) => {
    state.items = subjectMemberships;
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
