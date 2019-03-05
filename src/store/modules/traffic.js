/* eslint-disable */
import api from '@/api';

const state = {
  requestsCount: 0,
  responsesCount: 0,
  isLoading: false,
};

const getters = {};

const actions = {};

const mutations = {
  increaseRequests: (state) => {
    state.requestsCount += 1;
    state.isLoading = (state.requestsCount !== state.responsesCount);
  },
  increaseResponses: (state) => {
    state.responsesCount += 1;
    state.isLoading = (state.requestsCount !== state.responsesCount);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
