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
    });

    // check user cookie
    const userUuid = document.cookie.split('; ').filter((cookie) => {
      const [name] = cookie.split('=');
      return name === 'abyss.principal.uuid';
    }).map(cookie => cookie.split('=')[1]);
    if (userUuid.length > 0) {
      this.$store.commit('user/setUuid', userUuid[0]);
    } else {
      console.log(document.cookie);
      this.$store.commit('user/setUserUnauthorized', true);
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
    }),
  },
  methods: {
    checkUser() {
      this.$store.dispatch('user/getUser');
    },
  },
  mounted() {
    const { user } = this;

    if (user.uuid) {
      this.checkUser();
    }
  },
};
</script>