<template>
  <div>
    <OpenApiObject
      item="tags"
      type="Tag Object"
      :formData="openapidocument.tags"
      :pathArray="['openapidocument', 'tags']"
      :onChange="onChange"
      :isArray="true"
      :isCollapsedInitial="true"
    />
    <OpenApiObject
      item="components"
      type="Components Object"
      :formData="openapidocument.components"
      :pathArray="['openapidocument', 'components']"
      :onChange="onChange"
      :isCollapsedInitial="true"
      :refs="refs"
      :isMenu="false"
    />
  </div>
</template>

<script>
import OpenApiObject from '@/components/shared/apiDesigner/abyssTool/OpenApiObject';

export default {
  props: {
    openapidocument: {
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
    OpenApiObject,
  },
};
</script>