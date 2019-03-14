<template>
  <div>
    <div
      v-for="(tag, index) in tags"
      v-bind:key="index"
    >
      <Tag
        :tag="tag"
        :operations="operations.filter(item => item.tags.indexOf(tag) > -1)"
        :onChange="onChange"
      />
    </div>
  </div>
</template>

<script>
// import PathItem from '@/components/shared/apiDesigner/abyssTool/PathItem';
import Tag from '@/components/shared/apiDesigner/abyssTool/paths/Tag';

export default {
  props: {
    paths: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    onChange: {
      type: Function,
      required: true,
    },
  },
  components: {
    Tag,
  },
  computed: {
    operations() {
      const { paths } = this;
      const pathKeys = Object.keys(paths);
      return pathKeys.reduce((pathAccumulator, pathValue) => {
        const pathoperationsObject = paths[pathValue];
        const operationKeys = Object.keys(pathoperationsObject);
        const pathOperations = operationKeys.reduce((operationAccumulator, operationValue) => (
          [...operationAccumulator, {
            ...pathoperationsObject[operationValue],
            parentProps: {
              operationType: operationValue,
              path: pathValue,
            },
          }]
        ), []);
        return [...pathAccumulator, ...pathOperations];
      }, []);
    },
    tags() {
      const { operations } = this;
      return operations.reduce((operationAccumulator, operationValue) => {
        const { tags } = operationValue;
        const newTags = tags.filter(tag => (operationAccumulator.indexOf(tag) === -1));
        return [...operationAccumulator, ...newTags];
      }, []);
    },
  },
};
</script>
