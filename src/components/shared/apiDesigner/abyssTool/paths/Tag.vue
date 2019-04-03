<template>
  <div>
    <div
      class="tag-header"
      @click="handleToggleCollapse"
    >
      <h5>
        <span style="float: right;">
          <Icon :icon="(isCollapsed ? 'chevron-down' : 'chevron-right')" />
        </span>
        <span>{{ tag }}</span>
      </h5>
    </div>
    <div
      :class="`${isCollapsed ? '' : 'd-none'}`"
    >
      <div
        v-for="(item, index) in operations"
        v-bind:key="index"
      >
        <Operation
          :operation="item"
          :operationKey="item.parentProps.operationType"
          :pathKey="item.parentProps.path"
          :onChange="onChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Operation from '@/components/shared/apiDesigner/abyssTool/paths/Operation';
import Icon from '@/components/shared/Icon';

export default {
  props: {
    tag: {
      type: String,
      required: true,
    },
    operations: {
      type: Array,
      required: true,
    },
    onChange: {
      type: Function,
      required: true,
    },
  },
  components: {
    Operation,
    Icon,
  },
  data() {
    return {
      isCollapsed: true,
    };
  },
  methods: {
    handleToggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
};
</script>

<style lang="scss" scoped>
.tag-header {
  cursor: pointer;
  border-bottom: 1px solid silver;
  margin-bottom: .5rem;
}
</style>