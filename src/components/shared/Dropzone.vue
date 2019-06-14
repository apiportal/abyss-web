<template>
  <vue-dropzone
    ref="myVueDropzone"
    id="dropzone"
    :options="options"></vue-dropzone>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';

export default {
  components: {
    vueDropzone: vue2Dropzone,
  },
  props: {
    options: {
      type: Object,
      required: false,
      default() { return {}; },
    },
  },
};
</script>