<template>
  <b-alert
    show
    :variant="variant"
    :dismissible="dismissable"
  >
    <h4 class="alert-heading" v-if="!hideHeader">{{ title }}</h4>
    <p v-if="!hideHeader || !hideFooter">
      {{ text }}
    </p>
    <span v-if="hideHeader && hideFooter">{{ text }}</span>
    <hr v-if="!hideFooter">
    <p v-if="!hideFooter" class="mb-0">
      {{ footer }}
    </p>
  </b-alert>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
    },
    text: {
      type: String,
      required: false,
    },
    footer: {
      type: String,
      required: false,
    },
    variant: {
      type: String,
      required: false,
      default() { return 'danger'; },
    },
    dismissable: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    hideHeader: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    hideFooter: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
  },
};
</script>