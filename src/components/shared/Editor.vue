<template>
  <div class="editor"></div>
</template>

<script>
import ace from 'brace';
import json from 'brace/mode/json'; // eslint-disable-line no-unused-vars
import yaml from 'brace/mode/yaml'; // eslint-disable-line no-unused-vars
import tomorrowNightEighties from 'brace/theme/tomorrow_night_eighties'; // eslint-disable-line no-unused-vars
// import eclipse from 'brace/theme/eclipse'; // eslint-disable-line no-unused-vars

export default {
  props: {
    value: {
      type: String,
      required: false,
      default() { return ''; },
    },
    mode: {
      type: String,
      required: false,
      default() { return 'json'; },
    },
    theme: {
      type: String,
      required: false,
      default() { return 'tomorrow_night_eighties'; },
    },
    onChange: {
      type: Function,
      required: true,
    },
    debounce: {
      type: Number,
      required: false,
    },
  },
  watch: {
    value(newValue) {
      const now = (new Date()).getTime();
      const { updated } = this;
      if (now - updated > 100) { // prevent ping-pong changes
        this.editor.setValue(newValue);
        this.editor.clearSelection();
      }
    },
    mode(mode) {
      this.editor.getSession().setMode(`ace/mode/${mode}`);
    },
  },
  data() {
    return {
      isMounted: false,
      editor: null,
      updatedByProp: false,
      updated: 0,
      timer: null,
    };
  },
  mounted() {
    const { $el, mode, value, theme } = this;
    this.editor = ace.edit($el);
    this.editor.$blockScrolling = Infinity;
    // this.editor.setOption('enableEmmet', true);
    this.editor.getSession().setMode(`ace/mode/${mode}`);
    this.editor.setTheme(`ace/theme/${theme}`);
    this.editor.getSession().setTabSize(2);
    this.editor.setValue(value);
    this.editor.clearSelection();
    // editor is ready
    this.isMounted = true;

    this.editor.on('change', () => {
      if (this.editor.curOp && this.editor.curOp.command.name) {
        if (this.debounce) {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(function() { // eslint-disable-line
            this.onChange(this.editor.getValue());
            this.updated = (new Date()).getTime();
          }.bind(this), this.debounce);
        } else {
          this.onChange(this.editor.getValue());
          this.updated = (new Date()).getTime();
        }
      }
    });
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
  word-spacing: 0 !important; // never ever remove this line
}
</style>