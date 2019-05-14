<template>
  <Modal
    bodyClass="edit-organization"
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
    data-qa="modalEditOrganization"
  >
    <template slot="header">
      <h5 class="modal-title" data-qa="modalTitle">
        {{ role === 'edit' ? 'Edit Organization' : 'Add New Organization' }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <b-row align-v="center">
            <b-col md=9>
              <b-form-group 
                id="organizationNameGroup"
              >
                <label>
                  Name:
                  <span class="text-danger">*</span>
                </label>
                <b-form-input
                  id="organizationNameInput"
                  type="text"
                  v-model="organizationEditable.name"
                  :state="nameState"
                  placeholder="Name"
                  required
                >
                </b-form-input>
              </b-form-group>
              <b-form-group 
                id="organizationDescriptionGroup"
              >
                <label>
                  Description:
                  <span class="text-danger">*</span>
                </label>
                <b-form-textarea
                  id="organizationDescriptionTextarea"
                  v-model="organizationEditable.description"
                  :state="descriptionState"
                  placeholder="Description"
                  :rows="3"
                  required
                >
                </b-form-textarea>
              </b-form-group>
            </b-col>
            <b-col md=3>
              <div class="d-flex">
                <div class="item p-0"> 
                  <img
                    v-if="organizationEditable.picture"
                    :src="organizationEditable.picture" 
                    :alt="organizationEditable.name" 
                    class="bg-cover mb-2 bg-secondary embed-responsive embed-responsive-1by1 img-thumbnail" 
                    style="width: 200px;" 
                    v-b-tooltip.hover 
                    title="Click to change picture"
                    @click="$refs.fileInput.click()"
                  >
                  <img 
                    v-if="!organizationEditable.picture" 
                    src="@/assets/avatar.jpg" 
                    :alt="organizationEditable.name" 
                    class="bg-cover mb-2 bg-secondary embed-responsive embed-responsive-1by1 img-thumbnail" 
                    style="width: 200px;" 
                    v-b-tooltip.hover 
                    title="Click to change picture"
                    @click="$refs.fileInput.click()" />
                  <input type="file" id="image-upload" ref="fileInput" @change="onFileSelected" accept="image/*"/>
                </div>
              </div>
            </b-col>
          </b-row>
          <b-form-group 
            id="organizationOrganizationIdGroup"
          >
            <label>
              Parent Organization:
              <span class="text-danger">*</span>
            </label>
            <b-form-select
              id="organizationOrganizationIdInput"
              v-model="organizationEditable.organizationid" 
              :state="organizationIdState"
              :options="[
                { value: null, text: 'Please Select'},
                ...parentOrganizations.map(organization => ({
                  value: organization.uuid,
                  text: organization.name,
                  disabled: organization.isdeleted,
                }))
              ]"
              required
            />
          </b-form-group>
          <b-form-group id="organizationEnabledGroup">
            <b-form-checkbox
                id="organizationEnabledChecks"
                v-model="organizationEditable.isactive"
                :value="true"
                :unchecked-value="false"
            >
                Is Active?
            </b-form-checkbox>
          </b-form-group>
          <b-form-group 
            id="organizationUrlGroup"
          >
            <label>
              Url:
            </label>
            <b-form-input
              id="organizationUrlInput"
              type="text"
              v-model="organizationEditable.url"
              placeholder="Url"
            >
            </b-form-input>
          </b-form-group>
        </div>
        <footer class="modal-footer">
          <b-button
            variant="secondary"
            @click="onClose"
            data-qa="btnCancel"
          >
            Cancel
          </b-button>
          <b-button
            variant="success"
            type="submit"
            data-qa="btnSave"
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
    organization: {
      type: Object,
      required: false,
    },
    organizations: {
      type: Array,
      required: false,
      default() { return []; },
    },
    role: {
      type: String,
      required: false,
      default() { return 'edit'; },
    },
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      subjectOrganizations: state => state.subjectOrganizations.items,
    }),
    nameState() {
      const { name } = this.organizationEditable;
      if (name && name.length > 0) {
        return true;
      }
      return false;
    },
    descriptionState() {
      const { description } = this.organizationEditable;
      if (description && description.length > 0) {
        return true;
      }
      return false;
    },
    organizationIdState() {
      const { organizationid } = this.organizationEditable;
      if (organizationid) {
        return true;
      }
      return false;
    },
    parentOrganizations() {
      const parentOrganizations = this.organizations.filter(item =>
        this.subjectOrganizations.some(f =>
          f.organizationrefid === item.uuid && f.subjectid === this.currentUser.uuid,
        ),
      );
      return parentOrganizations;
    },
  },
  data() {
    return {
      organizationEditable: JSON.parse(JSON.stringify(this.organization)),
    };
  },
  created() { },
  methods: {
    ...mapActions('organizations', ['putOrganizations', 'postOrganizations']),
    ...mapActions('subjectOrganizations', ['putSubjectOrganizations', 'postSubjectOrganizations']),
    ...mapActions('resources', ['postResources']),
    ...mapActions('permissions', ['postPermissions']),
    validateJson(obj) {
      try {
        return JSON.parse(obj);
      } catch (e) {
        return false;
      }
    },
    handleSubmit(evt) {
      evt.preventDefault();
      const { putOrganizations,
        postOrganizations,
        postSubjectOrganizations, postResources, postPermissions,
        organizationEditable,
        onUpdate,
        role } = this;
      const { picture } = organizationEditable;
      let organizationToUpdate = {
        ...organizationEditable,
        picture: (picture === null ? '' : picture),
      };
      if (role === 'edit') {
        putOrganizations(organizationToUpdate).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      } else if (role === 'add') {
        const { currentUser } = this;
        const { uuid } = currentUser.props;
        const crudsubjectid = uuid;
        organizationToUpdate = [{
          ...organizationToUpdate,
          crudsubjectid,
        }];
        console.log('organizationToUpdate: ', organizationToUpdate); // eslint-disable-line
        postOrganizations(organizationToUpdate).then((response) => {
          if (response && response.data) {
            const createdOrganization = response.data[0].response;
            /* // !!! replace after cascade
            // this.$store.dispatch('organization/getOrganizations', {
              // refresh: true,
            // });
            onUpdate();
            // !!! */
            const userOrganizationToAdd = [{
              organizationid: createdOrganization.uuid,
              crudsubjectid: createdOrganization.crudsubjectid,
              organizationrefid: createdOrganization.uuid,
              // subjectid: currentUser.uuid,
              subjectid: createdOrganization.crudsubjectid,
              isactive: true,
              isowner: true,
            }];
            postSubjectOrganizations(userOrganizationToAdd).then((responseSubjectOrganizations) => {
              if (responseSubjectOrganizations && responseSubjectOrganizations.data) {
                const createdUserOrganization = responseSubjectOrganizations.data[0].response;
                const resourceToAdd = [{
                  organizationid: createdOrganization.organizationid,
                  crudsubjectid: createdOrganization.crudsubjectid,
                  resourcetypeid: '1ea5f7f1-249a-4219-8f86-32d2e8e42b93',
                  resourcename: `${createdOrganization.name} ORGANIZATON ${createdOrganization.uuid}`,
                  description: createdOrganization.description,
                  resourcerefid: createdOrganization.uuid,
                  isactive: true,
                }];
                postResources(resourceToAdd).then((responseResource) => {
                  if (responseResource && responseResource.data) {
                    const createdResource = responseResource.data[0].response;
                    const permissionToAdd = [{
                      organizationid: createdOrganization.organizationid,
                      crudsubjectid: createdOrganization.crudsubjectid,
                      permission: `Ownership of ${createdOrganization.name} ORGANIZATON by ${currentUser.props.displayname}`,
                      description: `Ownership of ${createdOrganization.name} ORGANIZATON by ${currentUser.props.displayname}`,
                      effectivestartdate: this.$moment.utc().toISOString(),
                      effectiveenddate: this.$moment.utc().add(50, 'years').toISOString(),
                      subjectid: createdUserOrganization.subjectid,
                      resourceid: createdResource.uuid,
                      resourceactionid: '7a2cf490-d8a6-4055-b94b-27d54115ea5f', // ALL_ORGANIZATION_ACTION
                      accessmanagerid: '6223ebbe-b30f-4976-bcf9-364003142379', // Abyss Access Manager
                      isactive: true,
                    }];
                    postPermissions(permissionToAdd).then((responsePermission) => {
                      if (responsePermission && responsePermission.data) {
                        // this.$store.dispatch('organization/getOrganizations', {
                        //   refresh: true,
                        // }); // ??
                        onUpdate();
                      }
                    });
                  }
                });
                // !!!
              }
            });
          }
        });
      }
    },
    onFileSelected(event) {
      event.preventDefault();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        this.organizationEditable.picture = reader.result;
      };
      reader.readAsDataURL(file);
    },
  },
};
</script>

<style lang="scss">
.modal-body {
  &.edit-organization {
    padding: 0;
  }
}

.configure-organization {
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
input[type="file"] {
    display: none;
}
</style>