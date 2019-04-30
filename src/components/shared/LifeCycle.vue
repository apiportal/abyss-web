<template>
  <div class="life-cycle">
    <b-button class="btn-life-cycle" v-on:mouseover="showInfo('Draft')">Draft</b-button>
    <b-button class="btn-life-cycle" v-on:mouseover="showInfo('Staged')">Staged</b-button>
    <b-button class="btn-life-cycle" v-on:mouseover="showInfo('Published')">Published</b-button>
    <b-button class="btn-life-cycle" v-on:mouseover="showInfo('Promoted')">Promoted</b-button>
    <b-button class="btn-life-cycle" v-on:mouseover="showInfo('Demoted')">Demoted</b-button>  
    <b-button class="btn-life-cycle" v-on:mouseover="showInfo('Deprecated')">Deprecated</b-button>
    <b-button class="btn-life-cycle" v-on:mouseover="showInfo('Retired')">Retired</b-button>
    <b-button class="btn-life-cycle" v-on:mouseover="showInfo('Archived')">Archived</b-button>
    <b-alert show variant="info"> {{ currentApiState.description }}</b-alert>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    currentApiState: {
      type: Object,
      required: false,
    },
  },
  computed: {
    ...mapState({
      apiStates: state => state.apiStates.items,
    }),
  },
  methods: {
    showInfo(state) {
      const { apiStates } = this;
      return apiStates.find(item => item.name === state);
    },
  },
};
</script>

<style lang="scss" scoped>
.life-cycle {
  text-align: center;
}
.btn {
  margin: 10px 10px;
}
ul {
  list-style: none;
}
</style>