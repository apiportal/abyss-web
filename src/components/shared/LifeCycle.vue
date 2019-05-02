<template>
  <div class="life-cycle">
    <b-button class="btn-life-cycle" :variant="buttonStatus('Draft')" @mouseover="showInfo('Draft')">Draft</b-button>
    <b-button class="btn-life-cycle" :variant="buttonStatus('Staged')" @mouseover="showInfo('Staged')">Staged</b-button>
    <b-button class="btn-life-cycle" :variant="buttonStatus('Published')" @mouseover="showInfo('Published')">Published</b-button>
    <b-button class="btn-life-cycle" :variant="buttonStatus('Promoted')" @mouseover="showInfo('Promoted')">Promoted</b-button>
    <b-button class="btn-life-cycle" :variant="buttonStatus('Demoted')" @mouseover="showInfo('Demoted')">Demoted</b-button>  
    <b-button class="btn-life-cycle" :variant="buttonStatus('Deprecated')" @mouseover="showInfo('Deprecated')">Deprecated</b-button>
    <b-button class="btn-life-cycle" :variant="buttonStatus('Retired')" @mouseover="showInfo('Retired')">Retired</b-button>
    <b-button class="btn-life-cycle" :variant="buttonStatus('Archived')" @mouseover="showInfo('Archived')">Archived</b-button>

    <b-alert class="state-description" show variant="light"> 
      <span class="info-header">{{ infoText.name }}</span>
      <hr/>{{ infoText.description + '.' }}
    </b-alert>
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
  data() {
    return {
      infoText: this.currentApiState,
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
</style>