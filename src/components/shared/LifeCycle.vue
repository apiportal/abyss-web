<template>
  <div class="life-cycle">
    <div class="d-flex flex-wrap p-2 border-bottom">
      <b-button class="btn-life-cycle" :variant="buttonStatus('Draft')" @click="changeState('Draft')" @mouseover="showInfo('Draft')">Draft</b-button>
      <b-button class="btn-life-cycle" :variant="buttonStatus('Staged')" @click="changeState('Staged')" @mouseover="showInfo('Staged')">Staged</b-button>
      <b-button class="btn-life-cycle" :variant="buttonStatus('Published')" @click="changeState('Published')" @mouseover="showInfo('Published')">Published</b-button>
      <b-button class="btn-life-cycle" :variant="buttonStatus('Promoted')" @click="changeState('Promoted')" @mouseover="showInfo('Promoted')">Promoted</b-button>
      <b-button class="btn-life-cycle" :variant="buttonStatus('Demoted')" @click="changeState('Demoted')" @mouseover="showInfo('Demoted')">Demoted</b-button>
      <b-button class="btn-life-cycle" :variant="buttonStatus('Deprecated')" @click="changeState('Deprecated')" @mouseover="showInfo('Deprecated')">Deprecated</b-button>
      <b-button class="btn-life-cycle" :variant="buttonStatus('Retired')" @click="changeState('Retired')" @mouseover="showInfo('Retired')">Retired</b-button>
      <b-button class="btn-life-cycle" :variant="buttonStatus('Archived')" @click="changeState('Archived')" @mouseover="showInfo('Archived')">Archived</b-button>
    </div>

    <b-alert class="state-description" show variant="light">
      <h6>{{ infoText.name }}</h6>
      {{ infoText.description + '.' }}
    </b-alert>
    <div class="p-3 border-top">
        <span class="px-3 active-state">Current State : {{ currentApiState.name }}</span>
        <span class="px-3 target-state">Next State : {{ nextApiState.name }}</span>
    </div>
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
    role: {
      type: String,
      required: false,
    },
  },
  computed: {
    ...mapState({
      apiStates: state => state.apiStates.items,
    }),
  },
  data() {
    return {
      infoText: this.currentApiState,
      nextApiState: '',
      buttonStatus(state) {
        return (this.currentApiState.name === state) ? 'primary' : 'outline-success';
      },
    };
  },
  methods: {
    showInfo(state) {
      const { apiStates } = this;
      this.infoText = apiStates.find(item => item.name === state);
    },
    changeState(state) {
      const { apiStates, role } = this;
      this.nextApiState = apiStates.find(item => item.name === state);
      if (role === 'proxyApi') {
        this.$store.commit('proxies/setNextStateId', this.nextApiState.uuid);
      } else if (role === 'businessApi') {
        this.$store.commit('businessApis/setNextStateId', this.nextApiState.uuid);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.life-cycle {
  // padding: 1rem;
}
.btn-life-cycle {
  width: 110px;
  margin: 5px 5px;
}
.state-description {
  margin-top: 10px;
  height: 160px;
}
.state-status {
  margin: 0 0 10px 20px;
}
.active-state {
  background: #0069d9;
  color: white;
  border: 1px solid #007bff;
  border-radius: .25rem;
  padding: 5px;
}
.target-state {
  background: #28a745;
  color: white;
  border: 1px solid #28a745;
  border-radius: .25rem;
  padding: 5px;
}
</style>