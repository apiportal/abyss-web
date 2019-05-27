<template>
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
    <OpenApiObject
      item="security"
      type="Security Requirement Object"
      :formData="openapidocument.security"
      :pathArray="['openapidocument', 'security']"
      :securitySchemes="openapidocument.components.securitySchemes"
      :onChange="onChange"
      :isArray="true"
      :isCollapsedInitial="true"
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