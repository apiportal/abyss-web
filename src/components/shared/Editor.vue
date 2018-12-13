<template>
  <div class="editor"></div>
</template>

<script>
import ace from 'brace';
import json from 'brace/mode/json'; // eslint-disable-line no-unused-vars
import monokai from 'brace/theme/monokai'; // eslint-disable-line no-unused-vars

export default {
  props: {
    value: {
      type: Object,
      required: true,
    },
    lang: {
      type: String,
      required: false,
      default() { return 'json'; },
    },
    theme: {
      type: String,
      required: false,
      default() { return 'monokai'; },
    },
  },
  data() {
    return {
      isMounted: false,
      editor: null,
    };
  },
  mounted() {
    const { $el, lang, theme, value } = this;
    this.editor = ace.edit($el);
    this.editor.$blockScrolling = Infinity;
    this.editor.setOption('enableEmmet', true);
    this.editor.getSession().setMode(`ace/mode/${lang}`);
    this.editor.setTheme(`ace/theme/${theme}`);
    // this.editor.setValue(value, 1);
    this.editor.setValue(JSON.stringify(value, null, '\t'));
    // editor is ready
    this.isMounted = true;
  },
  beforeDestroy() {
    this.editor.destroy();
    this.editor.container.remove();
  },
};
</script>

<style lang="scss">
.editor {
  flex: 1 0 0;
}
</style>