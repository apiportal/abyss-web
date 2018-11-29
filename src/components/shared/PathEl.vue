<template>
  <div class="path-container">
    <header>
      {{ path }}
    </header>
    <main>
      <PathMethod
        v-for="(methodKey, index) in methodKeys"
        v-bind:key="index"
        :methodType="methodKey"
        :methodProps="methods[methodKey]"
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
  },
  data() {
    return {
      methodKeys: Object.keys(this.methods),
    };
  },
};
</script>