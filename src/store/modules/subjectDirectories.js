/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {
  // setSubjectDirectories: (state) => {
  //   return state.subjectDirectories;
  // },
};

const actions = {
  getSubjectDirectories: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getSubjectDirectories().then((response) => {
      if (response && response.data) {
        commit('setSubjectDirectories', response.data);
      }
    });
  },
  putSubjectDirectories: ({ commit }, subjectDirectory) => {
    return api.putSubjectDirectories(subjectDirectory).then((response) => {
      if (response && response.data) {
        commit('updateSubjectDirectories', response.data);
      }
      return response;
    });
  },
};

const mutations = {
  setSubjectDirectories: (state, subjectDirectories) => {
    state.items = subjectDirectories;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateSubjectDirectories: (state, subjectDirectories) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = subjectDirectories
        .find(subjectDirectory => subjectDirectory.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
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
