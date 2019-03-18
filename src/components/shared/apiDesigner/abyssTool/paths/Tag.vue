<template>
  <div>
    <h5>{{ tag }}</h5>
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
</template>

<script>
import Operation from '@/components/shared/apiDesigner/abyssTool/paths/Operation';

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
  },
};
</script>
