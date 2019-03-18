<template>
  <div>
    <div>
      <label v-if="label">{{ label }}</label>
    </div>
    <div class="chips-container">
      <ul class="chips-ul">
        <li 
          v-for="(chip, index) in chips" 
          v-bind:key="index"
          class="btn btn-secondary chip-btn"
        >
          {{ chip.text }}
          <b-link
            v-b-tooltip.hover 
            title="Delete"
            @click="() => onDeleteChip(index)"
          >
            <Icon icon="times" />
          </b-link>
        </li>
        <li class="chip-btn">
          <b-button
            variant="info"
            id="addPopover"
            @click="toggleAddPopover"
          >
            <Icon icon="plus" /> {{ addItemText }}
          </b-button>
          <b-popover target="addPopover" :show.sync="isAddPopoverVisible">
            <template slot="title">{{ addItemText }}</template>
            <div>
              <div style="min-width: 400px;">
              </div>
              <div>
                <b-button
                  v-for="(chip, index) in computedOptions" 
                  v-bind:key="index"
                  variant="secondary"
                  @click="() => addChip({ chip })"
                  style="margin: .125em;"
                >
                  {{ chip.text }}
                </b-button>
              </div>
            </div>
          </b-popover>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/shared/Icon';

export default {
  components: {
    Icon,
  },
  props: {
    autocompleteOptions: {
      type: Array,
      required: false,
      default() { return []; },
    },
    chips: {
      type: Array,
      required: false,
      default() { return []; },
    },
    onDeleteChip: {
      type: Function,
      required: true,
    },
    onAddChip: {
      type: Function,
      required: true,
    },
    label: {
      type: String,
      required: false,
    },
    addItemText: {
      type: String,
      required: false,
      default() { return 'Add Item'; },
    },
  },
  computed: {
    computedOptions() {
      const { autocompleteOptions, chips } = this;
      return autocompleteOptions
        .filter(option => chips.filter(chip => chip.value === option.value).length === 0);
    },
  },
  data() {
    return {
      isAddPopoverVisible: false,
    };
  },
  methods: {
    toggleAddPopover() {
      this.isAddPopoverVisible = !this.isAddPopoverVisible;
    },
    addChip({ chip }) {
      this.onAddChip(chip);
      this.toggleAddPopover();
    },
  },
};
</script>

<style lang="scss" scoped>
.chips-container {
  // border: 1px solid #ced4da;
  // border-radius: .25em;
  // padding: 1em;

  .chips-ul {
    list-style-type: none;
    padding: 0;
    margin: 0 -.125rem;

    li {
      display: inline-block;
      margin: .125rem;

      &.chip-btn {
        cursor: default;

        a {
          color: white;
          text-decoration: none;
        }
      }
    }
  }
}
</style>