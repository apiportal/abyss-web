<template>
  <div>
    <div class="oao-tag-header"
      @click="handleToggleCollapse"
    >
      <span class="oao-arrow">
        <Icon :icon="(isCollapsed ? 'chevron-down' : 'chevron-right')" />
      </span>
      <div>{{ tag }}</div>
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
          :refs="refs"
          :securitySchemes="securitySchemes"
          :tags="tags"
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
    refs: {
      type: Array,
      required: false,
      default() { return []; },
    },
    securitySchemes: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    tags: {
      type: Array,
      required: false,
      default() { return []; },
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
.oao-tag-header {
  cursor: pointer;
  min-height: 2.5rem;
  > div {
    padding: .5rem 1rem .5rem 0;
  }
  font-size: 1.25rem;
  font-weight: bold;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  margin-bottom: 1rem;
}
.oao-arrow {
  float: right;
  padding: .5rem 0;
  width: 2.5rem;
  text-align: center;
  svg { width: 1rem; }
}
</style>