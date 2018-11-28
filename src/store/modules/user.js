const state = {
  user: {},
};

const getters = {
  GET_USER: (state) => {
    return state.user;
  },
};

const actions = {};

const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};