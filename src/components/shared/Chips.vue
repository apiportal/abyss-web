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
            v-if="!chip.disabled"
            v-b-tooltip.hover
            title="Delete"
            class="text-white"
            @click="() => onDeleteChip(index, chip)"
          >
            <Icon icon="times" />
          </b-link>
        </li>
        <li class="chip-btn btn-icon px-0">
          <b-dropdown variant="primary" size="md" class="dropodown-chip" right no-caret>
            <template slot="button-content">
              <span class="text-uppercase font-weight-bold">{{ addItemText }}</span> <Icon icon="plus" />
            </template>
            <b-dropdown-form class="pt-3 path-form" @submit="handleSubmit" v-if="showAddChip">
              <b-input-group>
                <input
                  v-model="freeText"
                  :type="inputType"
                  class="form-control"
                  placeholder="Type here"
                />
                <b-input-group-append slot="append">
                  <b-button type="submit">
                    <Icon icon="plus" />
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-dropdown-form>
            <b-dropdown-text>
              <b-button
                v-for="(chip, index) in computedOptions"
                v-bind:key="index"
                variant="secondary"
                @click="() => addChip({ chip })"
                style="margin: .125em;"
                :class="`btn-block ${chip.color} ${chip.isdeleted ? 'is-deleted' : ''}`"
              >
                {{ chip.text }}
              </b-button>
            </b-dropdown-text>
          </b-dropdown>

          <!-- <b-button
            variant="primary"
            id="addPopover"
            @click="toggleAddPopover"
          >
            <span class="text-uppercase font-weight-bold">{{ addItemText }}</span> <Icon icon="plus" />
          </b-button>
          <b-popover target="addPopover" :show.sync="isAddPopoverVisible" triggers="click blur">
            <template slot="title">{{ addItemText }}</template>
            <div>
              <div class="py-2" v-if="showAddChip">
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
              <hr v-if="showAddChip" />
              <div class="py-1">
                <b-button
                  v-for="(chip, index) in computedOptions"
                  v-bind:key="index"
                  variant="secondary"
                  @click="() => addChip({ chip })"
                  style="margin: .125em;"
                  :class="`${chip.color} ${chip.isdeleted ? 'is-deleted' : ''}`"
                >
                  {{ chip.text }}
                </b-button>
              </div>
            </div>
          </b-popover> -->
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
    type: {
      type: String,
      required: false,
      default() { return 'string'; },
    },
    addItemText: {
      type: String,
      required: false,
      default() { return 'Add Item'; },
    },
    showAddChip: {
      type: Boolean,
      required: false,
      default() { return true; },
    },
  },
  computed: {
    computedOptions() {
      const { autocompleteOptions, chips } = this;
      return autocompleteOptions
        .filter(option => chips.filter(chip => chip.value === option.value).length === 0);
    },
    inputType() {
      if (this.type === 'number') {
        return 'number';
      }
      return 'text';
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
      if (!chip.isdeleted) {
        this.onAddChip(chip);
        // this.toggleAddPopover();
      }
    },
    handleSubmit(evt) {
      evt.preventDefault();
      this.addChip({
        chip: {
          text: this.freeText,
          value: this.type === 'number' ? Number(this.freeText) : this.freeText,
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
          text-decoration: none;
        }
      }
    }
  }
}
</style>