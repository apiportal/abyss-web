<template>
  <div>
    swagger editor
  </div>
</template>

<script>
export default {
  mounted() {
    /* eslint-disable global-require */
    require(['swagger-editor'], (SwaggerEditorBundle) => { // eslint-disable-line import/no-dynamic-require
      console.log(SwaggerEditorBundle);
    });
    /* eslint-enable global-require */
  },
};
</script>