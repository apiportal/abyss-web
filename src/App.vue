<template>
  <router-view></router-view>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  watch: {
    user(newVal) {
      this.checkUser(newVal.uuid);
    },
  },
  created() {
    // axios global listeners
    axios.interceptors.request.use((config) => {
      this.$store.commit('traffic/increaseRequests');
      return config;
    }, () => {
      // error
      this.$store.commit('traffic/increaseRequests');
    });
    axios.interceptors.response.use((response) => {
      this.$store.commit('traffic/increaseResponses');
      return response;
    }, (error) => {
      // error
      this.$store.commit('user/setUserUnauthorized', (error.response.status === 401));
      this.$store.commit('traffic/increaseResponses');

      if (error.response.status === 401) {
        this.$router.push('/auth/login');
      }
      return Promise.reject(error);
    });

    // check user cookie
    const userUuid = document.cookie.split('; ').filter((cookie) => {
      const [name] = cookie.split('=');
      return name === 'abyss.principal.uuid';
    }).map(cookie => cookie.split('=')[1]);
    if (userUuid.length > 0) {
      this.$store.commit('user/setUuid', userUuid[0]);
      this.$store.dispatch('user/getUser', { principalid: userUuid[0] });
    } else {
      this.$store.commit('user/setUserUnauthorized', true);
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
    }),
  },
};
</script>