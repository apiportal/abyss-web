/*
 * Copyright 2019 Verapi Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable */
import api from '@/api';

const state = {
  items: [],
  lastUpdatedAt: 0,
};

const getters = {};

const actions = {
  getSubjectLicenses: ({ commit }, { uuid, refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh ) {
      return false;
    }
    // api.getSubjectLicenses(uuid)
    api.getSubjectLicensesCascaded(uuid)
    .then((response) => {
      if (response && response.data) {
        commit('setSubjectLicenses', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setSubjectLicenses', []);
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
    // return api.postLicenses(license).then((response) => {
    return api.postSubjectLicensesCascaded(license.crudsubjectid, license).then((response) => {
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
  setSubjectLicenses: (state, licenses) => {
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
