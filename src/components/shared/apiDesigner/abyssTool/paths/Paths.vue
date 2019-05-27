<template>
  <div>
    <b-button-group size="sm" style="width: 100%;">
      <b-button
        :class="`${ groupBy === 'paths' ? 'btn-selected' : '' }`"
        @click="handleGroupBy('paths')"
      >
        Group by Paths
      </b-button>
      <b-button
        :class="`${ groupBy === 'tags' ? 'btn-selected' : '' }`"
        @click="handleGroupBy('tags')"
      >
        Group by Tags
      </b-button>
    </b-button-group>
    <div v-if="groupBy === 'tags'" class="mt-3">
      <div
        v-for="(tag, index) in tags"
        v-bind:key="index"
      >
        <Tag
          :tag="tag"
          :operations="operations.filter(item => item.tags.indexOf(tag) > -1)"
          :onChange="onChange"
          :refs="refs"
          :securitySchemes="securitySchemes"
        />
      </div>
    </div>
    <div v-else-if="groupBy === 'paths'" class="mt-3">
      <div
        v-for="(path, index) in Object.keys(paths)"
        v-bind:key="index"
      >
        <PathItem
          :path="path"
          :pathObject="paths[path]"
          :operations="operations.filter(item => item.parentProps.path === path)"
          :onChange="onChange"
          :refs="refs"
          :securitySchemes="securitySchemes"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PathItem from '@/components/shared/apiDesigner/abyssTool/paths/PathItem';
import Tag from '@/components/shared/apiDesigner/abyssTool/paths/Tag';

export default {
  props: {
    paths: {
      type: Object,
      required: false,
      default() { return {}; },
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
    onChange: {
      type: Function,
      required: true,
    },
  },
  components: {
    Tag,
    PathItem,
  },
  computed: {
    operations() {
      const { paths } = this;
      const pathKeys = Object.keys(paths);
      return pathKeys.reduce((pathAccumulator, pathValue) => {
        const pathoperationsObject = paths[pathValue];
        const operationKeys = Object.keys(pathoperationsObject);
        const pathOperations = operationKeys
        .filter(item => (
          item !== 'description' &&
          item !== 'servers' &&
          item !== 'parameters' &&
          item !== 'summary'
        ))
        .reduce((operationAccumulator, operationValue) => (
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
    // tags() {
    //   const { operations } = this;
    //   return operations.reduce((operationAccumulator, operationValue) => {
    //     const { tags } = operationValue;
    //     const newTags = tags.filter(tag => (operationAccumulator.indexOf(tag) === -1));
    //     return [...operationAccumulator, ...newTags];
    //   }, []);
    // },
    tags() {
      const { operations } = this;
      return operations.reduce((operationAccumulator, operationValue) => {
        const tags = operationValue.tags || ['default'];
        const newTags = tags.filter(tag => (operationAccumulator.indexOf(tag) === -1));
        return [...operationAccumulator, ...newTags];
      }, []);
    },
  },
  data() {
    return {
      groupBy: 'paths',
    };
  },
  methods: {
    handleGroupBy(groupBy) {
      this.groupBy = groupBy;
    },
  },
};
</script>

<style lang="scss" scoped>
.btn.btn-secondary.btn-selected {
  background-color: #5a6268;
  border-color: #545b62;
}
</style>
