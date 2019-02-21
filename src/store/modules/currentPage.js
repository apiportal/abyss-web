/* eslint-disable */
import api from '@/api';

const state = {
  rootPath: '',
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {};

const mutations = {
  setRootPath: (state, pathName) => {
    state.rootPath = pathName;
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
