<template>
  <Modal
    bodyClass="edit-my-license"
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
  >
    <template slot="header">
      <h5 class="modal-title">
        {{ role === 'edit' ? 'Edit License' : 'Add New License' }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
      <div style="padding: 1rem;">
        <b-form-group
          id="licenseNameGroup"
          label="License Name*:"
          :invalid-feedback="licenseNameInvalidFeedback"
          :state="licenseNameState"
        >
        <b-form-input
          id="licenseNameInput"
          type="text"
          v-model="licenseEditable.name"
          placeholder="License Name"
          :state="licenseNameState"
          required
        >
        </b-form-input>
        </b-form-group>
        <b-form-group
          id="licenseVersionGroup"
          label="License Version*:"
          :invalid-feedback="licenseVersionInvalidFeedback"
          :state="licenseVersionState"
        >
        <b-form-input
          id="licenseVersionInput"
          type="text"
          v-model="licenseEditable.version"
          placeholder="License Version"
          :state="licenseVersionState"
          required
        >
        </b-form-input>
        </b-form-group>
        <b-form-group
          id="titleGroup"
          label="Title*:"
          :invalid-feedback="titleInvalidFeedback"
          :state="titleState"
        >
        <b-form-input
          id="titleInput"
          type="text"
          v-model="licenseEditable.licensedocument.info.title"
          placeholder="Title"
          :state="titleState"
          required
        >
        </b-form-input>
        </b-form-group>
        <b-form-group
          id="descriptionGroup"
          label="Description*:"
          :invalid-feedback="licenseDescriptionInvalidFeedback"
          :state="licenseDescriptionState"
        >
        <b-form-textarea
          id="descriptionTextarea"
          type="text"
          v-model="licenseEditable.licensedocument.info.description"
          placeholder="Description"
          :state="licenseDescriptionState"
          :rows="3"
          required
        >
        </b-form-textarea>
        </b-form-group>
        <b-form-group id="licenseEnabledGroup">
          <b-form-checkbox
              id="licenseEnabledChecks"
              v-model="licenseEditable.isactive"
              :value="true"
              :unchecked-value="false"
          >
              Is Active?
          </b-form-checkbox>
          </b-form-group>
        <b-form-group
        id="licenseVisibilityGroup"
        label="Visibility*"
        label-for="licenseVisibilityInput"
        :invalid-feedback="visibilityInvalidFeedback"
        :state="visibilityState"
        >
        <b-form-select
          id="licenseVisibilityInput"
          v-model="licenseEditable.licensedocument.info.visibility"
          :state="visibilityState"
          :options="[
              {
                value: null,
                text: 'Please select',
              },
              ...visibilityTypes.map(visibilityType => ({
            value: visibilityType.name,
            text: visibilityType.name,
            })),
          ]"
        />
        </b-form-group>
        <b-form-group
          id="slaTierNameGroup"
          label="SLA Tier Name*:"
          label-for="slaTierNameInput"
          :invalid-feedback="tierNameInvalidFeedback"
          :state="tierNameState"
        >
        <b-form-input
          id="slaTierNameInput"
          v-model="licenseEditable.licensedocument.sla.tierName"
          type="text"
          placeholder="SLA Tier Name"
          :state="tierNameState"
          required
        >
        </b-form-input>
        </b-form-group>
        <b-form-group
          id="slaDescriptionGroup"
          label="SLA Description*:"
          :invalid-feedback="slaDescriptionInvalidFeedback"
          :state="slaDescriptionState"
        >
        <b-form-textarea
          id="slaDescriptionTextarea"
          type="text"
          v-model="licenseEditable.licensedocument.sla.description"
          placeholder="SLA Description"
          :state="slaDescriptionState"
          :rows="3"
          required
        >
        </b-form-textarea>
        </b-form-group>
        <b-form-group
          id="slaSupportHoursGroup"
          label="SLA Support Hours*:"
          label-for="slaSupportHoursInput"
          :invalid-feedback="supportHoursInvalidFeedback"
          :state="supportHoursState"
        >
        <b-form-input
          id="slaSupportHoursInput"
          type="text"
          v-model="licenseEditable.licensedocument.sla.supportHours"
          placeholder="SLA Support Hours"
          :state="supportHoursState"
          required
        >
        </b-form-input>
        </b-form-group>
        <b-form-group
          id="availabilityGroup"
          label="Availability*:"
          label-for="availabilityInput"
          :invalid-feedback="availabilityInvalidFeedback"
          :state="availabilityState"
        >
        <b-form-input
          id="availabilityInput"
          type="text"
          v-model="licenseEditable.licensedocument.sla.availability"
          placeholder="Availability"
          :state="availabilityState"
          required
        >
        </b-form-input>
        </b-form-group>
        <b-form-group
          id="slaBlackoutHoursPerYearGroup"
          label="SLA Blackout Hours Per Year*:"
          label-for="slaBlackoutHoursPerYearInput"
          :invalid-feedback="blackOutHoursPerYearInvalidFeedback"
          :state="blackOutHoursPerYearState"
        >
        <b-form-input
          id="slaBlackoutHoursPerYearInput"
          type="text"
          v-model="licenseEditable.licensedocument.sla.blackOutHoursPerYear"
          placeholder="SLA Blackout Hours Per Year"
          :state="blackOutHoursPerYearState"
          required
        >
        </b-form-input>
        </b-form-group>
        <b-form-group
          id="slaPerformanceGroup"
          label="SLA Performance*:"
          label-for="slaPerformanceInput"
          :invalid-feedback="performanceInvalidFeedback"
          :state="performanceState"
        >
        <b-form-input
          id="slaPerformanceInput"
          type="text"
          v-model="licenseEditable.licensedocument.sla.performance"
          placeholder="SLA Performance"
          :state="performanceState"
          required
        >
        </b-form-input>
        </b-form-group>
        <b-form-group
          id="legalAgreementNameGroup"
          label="Legal Agreement Name*:"
          label-for="legalAgreementNameInput"
          :invalid-feedback="legalAgreementNameInvalidFeedback"
          :state="legalAgreementNameState"
        >
        <b-form-input
          id="legalAgreementNameInput"
          type="text"
          v-model="licenseEditable.licensedocument.legal.name"
          placeholder="Legal Agreement Name"
          :state="legalAgreementNameState"
          required
        >
        </b-form-input>
        </b-form-group>
        <b-form-group
          id="legalAgreementDescriptionGroup"
          label="Legal Agreement Description*:"
          :invalid-feedback="legalAgreementDescriptionInvalidFeedback"
          :state="legalAgreementDescriptionState"
        >
        <b-form-textarea
          id="legalAgreementDescriptionTextarea"
          type="text"
          v-model="licenseEditable.licensedocument.legal.description"
          placeholder="Legal Agreement Description"
          :state="legalAgreementDescriptionState"
          :rows="3"
          required
        >
        </b-form-textarea>
        </b-form-group>
        <b-form-group
        id="agreementTypeGroup"
        label="Agreement Type*"
        label-for="agreementTypeInput"
        :invalid-feedback="legalAgreementTypeInvalidFeedback"
        :state="legalAgreementTypeState"
        >
        <b-form-select
          id="agreementTypeInput"
          v-model="licenseEditable.licensedocument.legal.agreementType"
          :state="legalAgreementTypeState"
          :options="[
              {
                value: null,
                text: 'Please select',
              },
              {
                value: 'signup',
                text: 'signup',
              },{
                value: 'eula',
                text: 'eula',
              },
          ]"
        />
        </b-form-group>
        <b-form-group
        id="documentStateGroup"
        label="Document State*"
        label-for="documentStateInput"
        :invalid-feedback="documentStateInvalidFeedback"
        :state="documentStateState"
        >
        <b-form-select
          id="documentStateInput"
          v-model="licenseEditable.licensedocument.legal.documentState"
          :state="documentStateState"
          :options="[
              {
                value: null,
                text: 'Please select',
              },
              {
                value: 'draft',
                text: 'draft',
              },
              {
                value: 'active',
                text: 'active',
              },
              {
                value: 'inactive',
                text: 'inactive',
              },
          ]"
        />
        </b-form-group>
        <b-form-group
          id="legalAgreementLinkGroup"
          label="Legal Agreement Link*:"
          label-for="legalAgreementLinkInput"
          :invalid-feedback="legalAgreementLinkInvalidFeedback"
          :state="legalAgreementLinkState"
        >
        <b-form-input
          id="legalAgreementLinkInput"
          type="text"
          v-model="licenseEditable.licensedocument.legal.link"
          placeholder="Legal Agreement Link"
          :state="legalAgreementLinkState"
          required
        >
        </b-form-input>
        </b-form-group>
        <b-form-group
          id="documentTextGroup"
          label="Document Text*:"
          :invalid-feedback="documentTextInvalidFeedback"
          :state="documentTextState"
        >
        <b-form-textarea
          id="documentTextTextarea"
          type="text"
          v-model="licenseEditable.licensedocument.legal.documentText"
          placeholder="Document Text"
          :state="documentTextState"
          :rows="3"
          required
        >
        </b-form-textarea>
        </b-form-group>
      </div>
      <footer class="modal-footer">
        <b-button
          variant="secondary"
          @click="onClose"
        >
          Cancel
        </b-button>
        <b-button
          variant="success"
          type="submit"
          @click="onUpdate"
        >
          Save
        </b-button>
      </footer>
      </b-form>
    </template>
  </Modal>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import Modal from '@/components/shared/modals/Modal';
import Icon from '@/components/shared/Icon';

export default {
  components: {
    Modal,
    Icon,
  },
  props: {
    hideHeader: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    hideFooter: {
      type: Boolean,
      required: false,
      default() { return true; },
    },
    noCloseOnBackdrop: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    noCloseOnEsc: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    hideHeaderClose: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    size: {
      type: String,
      required: false,
      default() { return 'lg'; },
    },
    onClose: {
      type: Function,
      required: true,
    },
    onUpdate: {
      type: Function,
      required: true,
    },
    license: {
      type: Object,
      required: false,
    },
    role: {
      type: String,
      required: false,
      default() { return 'edit'; },
    },
    visibilityTypes: {
      type: Array,
      required: false,
      default() { return []; },
    },
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
    }),
    licenseVersionInvalidFeedback() {
      const { version } = this.licenseEditable;
      if (version) {
        return 'Please enter something';
      }
      return '';
    },
    licenseVersionState() {
      const { version } = this.licenseEditable;
      return Boolean(version);
    },
    licenseNameInvalidFeedback() {
      const { name } = this.licenseEditable;
      if (name) {
        return 'Please enter something';
      }
      return '';
    },
    licenseNameState() {
      const { name } = this.licenseEditable;
      return Boolean(name);
    },
    titleInvalidFeedback() {
      const { title } = this.licenseEditable.licensedocument.info;
      if (title.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    titleState() {
      const { title } = this.licenseEditable.licensedocument.info;
      return title.length > 0;
    },
    licenseDescriptionInvalidFeedback() {
      const { description } = this.licenseEditable.licensedocument.info;
      if (description.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    licenseDescriptionState() {
      const { description } = this.licenseEditable.licensedocument.info;
      return description.length > 0;
    },
    visibilityInvalidFeedback() {
      const { visibility } = this.licenseEditable.licensedocument.info;
      if (visibility.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    visibilityState() {
      const { visibility } = this.licenseEditable.licensedocument.info;
      return visibility.length > 0;
    },
    tierNameInvalidFeedback() {
      const { tierName } = this.licenseEditable.licensedocument.sla;
      if (tierName.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    tierNameState() {
      const { tierName } = this.licenseEditable.licensedocument.sla;
      return tierName.length > 0;
    },
    slaDescriptionInvalidFeedback() {
      const { description } = this.licenseEditable.licensedocument.sla;
      if (description.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    slaDescriptionState() {
      const { description } = this.licenseEditable.licensedocument.sla;
      return description.length > 0;
    },
    supportHoursInvalidFeedback() {
      const { supportHours } = this.licenseEditable.licensedocument.sla;
      if (supportHours.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    supportHoursState() {
      const { supportHours } = this.licenseEditable.licensedocument.sla;
      return supportHours.length > 0;
    },
    availabilityInvalidFeedback() {
      const { availability } = this.licenseEditable.licensedocument.sla;
      if (availability) {
        return 'Please enter something';
      }
      return '';
    },
    availabilityState() {
      const { availability } = this.licenseEditable.licensedocument.sla;
      return Boolean(availability);
    },
    blackOutHoursPerYearInvalidFeedback() {
      const { blackOutHoursPerYear } = this.licenseEditable.licensedocument.sla;
      if (blackOutHoursPerYear) {
        return 'Please enter something';
      }
      return '';
    },
    blackOutHoursPerYearState() {
      const { blackOutHoursPerYear } = this.licenseEditable.licensedocument.sla;
      return Boolean(blackOutHoursPerYear);
    },
    performanceInvalidFeedback() {
      const { performance } = this.licenseEditable.licensedocument.sla;
      if (performance.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    performanceState() {
      const { performance } = this.licenseEditable.licensedocument.sla;
      return performance.length > 0;
    },
    legalAgreementNameInvalidFeedback() {
      const { name } = this.licenseEditable.licensedocument.legal;
      if (name.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    legalAgreementNameState() {
      const { name } = this.licenseEditable.licensedocument.legal;
      return name.length > 0;
    },
    legalAgreementDescriptionInvalidFeedback() {
      const { description } = this.licenseEditable.licensedocument.legal;
      if (description.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    legalAgreementDescriptionState() {
      const { description } = this.licenseEditable.licensedocument.legal;
      return description.length > 0;
    },
    legalAgreementTypeInvalidFeedback() {
      const { agreementType } = this.licenseEditable.licensedocument.legal;
      if (agreementType.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    legalAgreementTypeState() {
      const { agreementType } = this.licenseEditable.licensedocument.legal;
      return agreementType.length > 0;
    },
    documentStateInvalidFeedback() {
      const { documentState } = this.licenseEditable.licensedocument.legal;
      if (documentState.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    documentStateState() {
      const { documentState } = this.licenseEditable.licensedocument.legal;
      return documentState.length > 0;
    },
    legalAgreementLinkInvalidFeedback() {
      const { link } = this.licenseEditable.licensedocument.legal;
      if (link.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    legalAgreementLinkState() {
      const { link } = this.licenseEditable.licensedocument.legal;
      return link.length > 0;
    },
    documentTextInvalidFeedback() {
      const { documentText } = this.licenseEditable.licensedocument.legal;
      if (documentText.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    documentTextState() {
      const { documentText } = this.licenseEditable.licensedocument.legal;
      return documentText.length > 0;
    },
  },
  data() {
    const { license } = this;

    return {
      licenseEditable: JSON.parse(JSON.stringify(license)),
    };
  },
  methods: {
    ...mapActions('licenses', ['putLicenses', 'postLicenses']),
    handleSubmit(evt) {
      evt.preventDefault();
      const { licenseEditable, putLicenses, postLicenses, onUpdate, role } = this;
      if (role === 'edit') {
        putLicenses(licenseEditable).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      } else if (role === 'add') {
        const { currentUser } = this;
        const { uuid } = currentUser.props;
        const crudsubjectid = uuid;
        const licenseToUpdate = [{
          ...licenseEditable,
          crudsubjectid,
        }];
        postLicenses(licenseToUpdate)
          .then((response) => {
            if (response && response.data) {
              onUpdate();
            }
          });
      }
    },
  },
};
</script>
<style lang="scss">
.modal-body {
  &.edit-my-license {
    padding: 0;
  }
}

.configure-my-license {
  border: 1px solid #e9ecef;
  border-radius: .3rem;
  padding: 1rem;
  position: relative;

  &:before {
    bottom: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(233, 236, 239, 0);
    border-bottom-color: #e9ecef;
    border-width: 11px;
    margin-left: -11px;
  }
}
</style>