<template>
  <div class="path-container">
    <header>
      <strong>{{ path }}</strong>
    </header>
    <main>
      <p>Operations:</p>
      <PathMethod
        v-for="(methodKey, index) in methodKeys"
        v-bind:key="index"
        :methodType="methodKey"
        :methodProps="methods[methodKey]"
        :path="path"
        :onMethodChange="onMethodChange"
        :onDescriptionChange="onDescriptionChange"
        :onSummaryChange="onSummaryChange"
      />
    </main>
  </div>
</template>

<script>
import PathMethod from '@/components/shared/PathMethod';

export default {
  components: {
    PathMethod,
  },
  props: {
    path: {
      type: String,
      required: true,
      default() { return ''; },
    },
    methods: {
      type: Object,
      required: true,
      default() { return {}; },
    },
    onMethodChange: {
      type: Function,
      required: true,
    },
    onDescriptionChange: {
      type: Function,
      required: true,
    },
    onSummaryChange: {
      type: Function,
      required: true,
    },
  },
  computed: {
    methodKeys() {
      return Object.keys(this.methods);
    },
  },
};
</script>