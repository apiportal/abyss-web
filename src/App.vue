<template>
  <router-view></router-view>
</template>

<script>
import axios from 'axios';

export default {
  created() {
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
      // console.log(error.response.status === 401);
      this.$store.commit('user/setTokenStatus', (error.response.status !== 401));
      this.$store.commit('traffic/increaseResponses');
    });
  },
};
</script>