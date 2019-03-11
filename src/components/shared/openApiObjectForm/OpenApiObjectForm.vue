<template>
  <div>
    <div v-for="(item, index) in Object.keys(currentObjectInterface)" v-bind:key="index">
      <div v-if="interfaces[currentObjectInterface[item].type]">
        {{ item }}
        <!-- <OpenApiObjectForm
          :type="currentObjectInterface[item].type"
        /> -->
      </div>
      <div v-else>
        {{ item }}
        {{ currentObjectInterface[item] }}
      </div>
    </div>
  </div>
</template>

<script>
import Interfaces from '@/assets/openAPI3.0.json';

export default {
  name: 'OpenApiObjectForm',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      currentObjectInterface: Interfaces[this.type],
      interfaces: Interfaces,
    };
  },
};
</script>