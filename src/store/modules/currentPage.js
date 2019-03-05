/* eslint-disable */
import api from '@/api';

const state = {
  rootPath: '',
  firstChildPath: '',
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {};

const mutations = {
  setRootPath: (state, pathName) => {
    state.rootPath = pathName;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setFirstChildPath: (state, pathName) => {
    state.firstChildPath = pathName;
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
