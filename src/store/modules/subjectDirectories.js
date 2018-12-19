/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
};

const getters = {
  // setSubjectDirectories: (state) => {
  //   return state.subjectDirectories;
  // },
};

const actions = {
  getSubjectDirectories: ({ commit }) => {
    api.getSubjectDirectories().then((response) => {
      commit('setSubjectDirectories', response.data);
    });
  },
};

const mutations = {
  setSubjectDirectories: (state, subjectDirectories) => {
    state.items = subjectDirectories;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
