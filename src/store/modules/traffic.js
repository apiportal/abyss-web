/* eslint-disable */
import api from '@/api';

const state = {
  requestsCount: 0,
  responsesCount: 0,
};

const getters = {};

const actions = {};

const mutations = {
  increaseRequests: (state) => {
    state.requestsCount += 1;
  },
  increaseResponses: (state) => {
    state.responsesCount += 1;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
