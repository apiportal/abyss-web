<template>
  <div class="life-cycle">
    <b-button class="btn-life-cycle" :variant="buttonStatus('Draft')" @click="changeState('Draft')" @mouseover="showInfo('Draft')">Draft</b-button>
    <b-button class="btn-life-cycle" :variant="buttonStatus('Staged')" @click="changeState('Staged')" @mouseover="showInfo('Staged')">Staged</b-button>
    <b-button class="btn-life-cycle" :variant="buttonStatus('Published')" @click="changeState('Published')" @mouseover="showInfo('Published')">Published</b-button>
    <b-button class="btn-life-cycle" :variant="buttonStatus('Promoted')" @click="changeState('Promoted')" @mouseover="showInfo('Promoted')">Promoted</b-button>
    <b-button class="btn-life-cycle" :variant="buttonStatus('Demoted')" @click="changeState('Demoted')" @mouseover="showInfo('Demoted')">Demoted</b-button>  
    <b-button class="btn-life-cycle" :variant="buttonStatus('Deprecated')" @click="changeState('Deprecated')" @mouseover="showInfo('Deprecated')">Deprecated</b-button>
    <b-button class="btn-life-cycle" :variant="buttonStatus('Retired')" @click="changeState('Retired')" @mouseover="showInfo('Retired')">Retired</b-button>
    <b-button class="btn-life-cycle" :variant="buttonStatus('Archived')" @click="changeState('Archived')" @mouseover="showInfo('Archived')">Archived</b-button>

    <b-alert class="state-description" show variant="light"> 
      <span class="info-header">{{ infoText.name }}</span>
      <hr/>{{ infoText.description + '.' }}
    </b-alert>
    <div class="state-status">
        <span class="active-state">Active State : {{ currentApiState.name }}</span>
        <span class="target-state">Target State : {{ targetState }}</span>
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
    onStateChange: {
      type: Function,
      required: true,
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
      targetState: '',
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
      this.targetState = state;
      this.onStateChange(state);
    },
  },
};
</script>

<style lang="scss" scoped>
.life-cycle {
  text-align: justify;
}
.btn-life-cycle {
  width: 110px;
  margin: 5px 5px;
}
.info-header {
  font-weight: bold;
}
.state-description {
  margin-top: 10px;
  height: 200px;
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