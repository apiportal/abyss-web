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
  getGroups: ({ commit }, { refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getGroups()
    .then((response) => {
      if (response && response.data) {
        commit('setGroups', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setGroups', []);
      }
    });
  },
  putGroups: ({ commit }, group) => {
    return api.putGroups(group).then((response) => {
      commit('updateGroups', response.data);
      return response;
    });
  },
  deleteGroups: ({ commit }, group) => {
    return api.deleteGroups(group.uuid).then((response) => {
      commit('setGroupDeleted', group.uuid);
      return response;
    });
  },
  postGroups: ({ commit }, group) => {
    return api.postGroups(group).then((response) => {
      let error = false;

      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
          alert(status.error.usermessage);
        } else {
          commit('addNewGroup', status.response);
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
  setGroups: (state, groups) => {
    state.items = groups;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateGroups: (state, groups) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = groups
        .find(group => group.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setGroupDeleted: (state, groupUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === groupUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
  },
  addNewGroup: (state, newGroup) => {
    state.items = [
      ...state.items,
      newGroup,
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
