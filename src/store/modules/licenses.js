/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getLicenses: ({ commit }, { refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getLicenses().then((response) => {
      if (response && response.data) {
        commit('setLicenses', response.data);
      }
    });
  },
  putLicenses: ({ commit }, license) => {
    return api.putLicenses(license).then((response) => {
      commit('updateLicenses', response.data);
      return response;
    });
  },
  deleteLicenses: ({ commit }, license) => {
    return api.deleteLicenses(license.uuid).then((response) => {
      commit('setLicenseDeleted', license.uuid);
      return response;
    });
  },
  postLicenses: ({ commit }, license) => {
    return api.postLicenses(license).then((response) => {
      let error = false;

      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
          alert(status.error.usermessage);
        } else {
          commit('addNewLicense', status.response);
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
  setLicenses: (state, licenses) => {
    state.items = licenses;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateLicenses: (state, licenses) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = licenses
        .find(license => license.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setLicenseDeleted: (state, licenseUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === licenseUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
  },
  addNewLicense: (state, newLicense) => {
    state.items = [
      ...state.items,
      newLicense,
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