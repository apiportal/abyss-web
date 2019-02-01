/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getSubjectDirectoryTypes: ({ commit }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 ) {
      return false;
    }
    api.getSubjectDirectoryTypes().then((response) => {
      if (response && response.data) {
        commit('setSubjectDirectoryTypes', response.data);
      }
    });
  },
  putSubjectDirectoryTypes: ({ commit }, subjectDirectoryType) => {
    return api.putSubjectDirectoryTypes(subjectDirectoryType).then((response) => {
      if (response && response.data) {
        commit('updateSubjectDirectoryTypes', response.data);
      }
      return response;
    });
  },
  postSubjectDirectoryTypes: ({ commit }, subjectDirectoryType) => {
    return api.postSubjectDirectoryTypes(subjectDirectoryType).then((response) => {
      let error = false;
      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
        } else {
          commit('addSubjectDirectoryTypes', status.response);
        }
      });
      if (error) {
        return false;
      }
      return response;
    });
  },
};

const mutations = {
  setSubjectDirectoryTypes: (state, subjectDirectoryTypes) => {
    state.items = subjectDirectoryTypes;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateSubjectDirectoryTypes: (state, subjectDirectoryTypes) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = subjectDirectoryTypes
        .find(subjectDirectoryType => subjectDirectoryType.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  addSubjectDirectoryTypes: (state, newSubjectDirectoryType) => {
    state.items = [
      ...state.items,
      newSubjectDirectoryType,
    ];
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
