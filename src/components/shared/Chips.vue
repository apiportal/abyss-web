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
          class="btn btn-secondary chip-btn btn-icon"
          :class="`${chip.color} ${chip.isdeleted ? 'is-deleted' : ''}`"
        >
          <span :title="chip.value">
            {{ chip.text }}
          </span>
          <b-link
            v-if="!chip.isdeleted"
            v-b-tooltip.hover 
            title="Delete"
            @click="() => onDeleteChip(index, chip)"
          >
            <Icon icon="times" />
          </b-link>
        </li>
        <li class="chip-btn btn-icon">
          <b-button
            variant="primary"
            id="addPopover"
            @click="toggleAddPopover"
          >
            <span class="text-uppercase font-weight-bold">{{ addItemText }}</span> <Icon icon="plus" />
          </b-button>
          <b-popover target="addPopover" :show.sync="isAddPopoverVisible" triggers="click blur">
            <template slot="title">{{ addItemText }}</template>
            <div>
              <div>
                <form @submit="handleSubmit">
                  <b-input-group>
                    <input
                      v-model="freeText"
                      type="text"
                      class="form-control"
                      placeholder="Type here"
                    />
                    <b-input-group-append slot="append">
                      <b-button type="submit">
                        <Icon icon="plus" />
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                </form>
              </div>
              <hr />
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
      freeText: '',
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
    handleSubmit(evt) {
      evt.preventDefault();
      this.addChip({
        chip: {
          text: this.freeText,
          value: this.freeText,
        },
      });
      this.freeText = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.chips-container {
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