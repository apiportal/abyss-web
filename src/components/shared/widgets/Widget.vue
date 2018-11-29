<template>
  <div class="widget-container">
    <div class="header">
      <span style="float: right; margin-top: -4px;">
        <b-dropdown variant="link" size="sm" right no-caret>
          <template slot="button-content">
            <Icon icon="ellipsis-h" />
          </template>
          <b-dropdown-item href="#">Action</b-dropdown-item>
          <b-dropdown-item href="#">Another action</b-dropdown-item>
          <b-dropdown-item href="#">Something else here...</b-dropdown-item>
        </b-dropdown>
      </span>
      {{ title }}
    </div>
    <div class="body">
      <main>
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/shared/Icon';

export default {
  components: {
    Icon,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.widget-container {
  border: 1px solid silver;

  .header {
    background-color: silver;
    padding: .5em 1em;
  }

  .body {
    padding: 1em;
  }
}
</style>