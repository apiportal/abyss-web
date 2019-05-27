<template>
  <div>
    <b-button-group size="sm" class="w-100" v-if="showGroupButtons">
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
      <div v-if="computedDefaultTags.length">
        <Tag
          :tag="'default'"
          :operations="computedDefaultTags"
          :onChange="onChange"
          :refs="refs"
          :securitySchemes="securitySchemes"
          :tags="tags"
        />
      </div>
      <div
        v-for="(tag, index) in operationTags"
        v-bind:key="index"
      >
        <Tag
          :tag="tag"
          :operations="operations.filter(item => item.tags && item.tags.length && item.tags.indexOf(tag) > -1)"
          :onChange="onChange"
          :refs="refs"
          :securitySchemes="securitySchemes"
          :tags="tags"
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
          :pathArray="[...pathArray, path]"
          :operations="operations.filter(item => item.parentProps.path === path)"
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
import PathItem from '@/components/shared/apiDesigner/abyssTool/paths/PathItem';
import Tag from '@/components/shared/apiDesigner/abyssTool/paths/Tag';

export default {
  props: {
    paths: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    pathArray: {
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
    showGroupButtons: {
      type: Boolean,
      required: false,
      default() { return false; },
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
              tags: pathoperationsObject[operationValue].tags || ['default'],
            },
          }]
        ), []);
        return [...pathAccumulator, ...pathOperations];
      }, []);
    },
    operationTags() {
      const { operations } = this;
      return operations.reduce((operationAccumulator, operationValue) => {
        const tags = operationValue.tags || [];
        const newTags = tags.filter(tag => (operationAccumulator.indexOf(tag) === -1));
        return [...operationAccumulator, ...newTags];
      }, []);
    },
    computedDefaultTags() {
      return this.operations.filter(item => !item.tags || !item.tags.length);
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
