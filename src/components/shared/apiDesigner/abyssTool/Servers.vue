<template>
  <div>
    <div>
      <OpenApiObject
        item="servers"
        type="Server Object"
        :formData="openapidocument.servers"
        :pathArray="['openapidocument', 'servers']"
        :onChange="onChange"
        :isArray="true"
        :isCollapsedInitial="true"
      />
    </div>
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