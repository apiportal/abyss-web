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
  getUsers: ({ commit }, { refresh = false }) => {
    const { lastUpdatedAt } = state;
    if (lastUpdatedAt > 0 && !refresh) {
      return false;
    }
    api.getUsers()
    .then((response) => {
      if (response && response.data) {
        commit('setUsers', response.data);
      }
    })
    .catch((error) => {
      if (error.status === 404) {
        commit('setUsers', []);
      }
    });
  },
  putUsers: ({ commit }, user) => {
    return api.putUsers(user).then((response) => {
      commit('updateUsers', response.data);
      return response;
    });
  },
  deleteUsers: ({ commit }, user) => {
    return api.deleteUsers(user.uuid).then((response) => {
      commit('setUserDeleted', user.uuid);
      return response;
    });
  },
  postUsers: ({ commit }, user) => {
    return api.postUsers(user).then((response) => {
      let error = false;

      response.data.map((status) => {
        if (status.error.code !==0) {
          error = true;
          alert(status.error.usermessage);
        } else {
          commit('addNewUser', status.response);
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
  setUsers: (state, users) => {
    state.items = users;
    state.lastUpdatedAt = (new Date()).getTime();
  },
  updateUsers: (state, users) => {
    state.items = state.items.map((item) => {
      const itemShouldUpdate = users
        .find(user => user.uuid === item.uuid);
      return itemShouldUpdate ? itemShouldUpdate : item;
    });
    state.lastUpdatedAt = (new Date()).getTime();
  },
  setUserDeleted: (state, userUuid) => {
    state.items = state.items.map((item) => {
      if (item.uuid === userUuid) {
        return {
          ...item,
          isdeleted: true,
        };
      }
      return item;
    });
  },
  addNewUser: (state, newUser) => {
    state.items = [
      ...state.items,
      newUser,
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
