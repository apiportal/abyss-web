<template>
  <div class="api-designer-container">

    <div class="api-designer-actions-bar">
      <b-button-toolbar>
        <span class="toolbar-title">{{ records[this.recordIndex].openapidocument.info.title }}</span>
        <div class="ml-auto">
          <b-button-group size="md" class="mr-1">
            <b-button
              @click="setView('abyss')"
              :class="`${ view === 'abyss' ? 'btn-selected' : '' }`"
              v-b-tooltip.hover
              title="Abyss View"
            ><Icon icon="magic" /></b-button>
            <b-button
              @click="setView('hybrid')"
              :class="`${ view === 'hybrid' ? 'btn-selected' : '' }`"
              v-b-tooltip.hover
              title="Hybrid View"
            ><Icon icon="columns" /></b-button>
            <b-button
              @click="setView('editor')"
              :class="`${ view === 'editor' ? 'btn-selected' : '' }`"
              v-b-tooltip.hover
              title="Editor View"
            ><Icon icon="code" /></b-button>
          </b-button-group>
          <b-button-group size="md" class="mr-1">
            <b-button
              @click="setMode('json')"
              :class="`${ mode === 'json' ? 'btn-selected' : '' }`"
            >JSON</b-button>
            <b-button
              @click="setMode('yaml')"
              :class="`${ mode === 'yaml' ? 'btn-selected' : '' }`"
            >YAML</b-button>
          </b-button-group>
          <b-button-group size="md" class="mr-1">
            <b-button
              @click="handleUndo"
              :disabled="recordIndex === 0"
            >
              <Icon icon="undo" />
            </b-button>
            <b-button
              @click="handleRedo"
              :disabled="recordIndex === (records.length - 1)"
            >
              <Icon icon="redo" />
            </b-button>
          </b-button-group>
        </div>
      </b-button-toolbar>
    </div>

    <div class="api-designer-columns-container">
      <div
        :class="`api-designer-abyss-container ${ (view === 'abyss' || view === 'hybrid') ? '' : 'd-none'}`"
      >
        <AbyssTool
          :api="records[recordIndex]"
          :onChange="handleChange"
        />
      </div>
      <div
        :class="`api-designer-editor-container ${ (view === 'editor' || view === 'hybrid') ? '' : 'd-none'}`"
      >
        <Editor
          :value="editorValue"
          :onChange="handleEditorChange"
          :mode="mode"
          :debounce="1000"
        />
      </div>
    </div>
    <div class="api-designer-footer">
      <div class="row">
        <div class="col-md-8">
          <b-alert class="alert-vivid alert-t-l" v-model="showNotValidAlert" variant="danger" dismissible>
            <h4>API is not valid!</h4>
            <div v-for="(error, index) in notValidMessage" v-bind:key="index">{{ error }}</div>
          </b-alert>
          <b-alert class="alert-vivid alert-t-r" v-model="showSavedAlert" variant="success" dismissible>API saved successfully!</b-alert>
          <b-alert class="alert-vivid alert-t-r" v-model="showCreatedAlert" variant="info" dismissible>New version is created successfully!</b-alert>
          <b-alert v-model="isVersionChanged" variant="info" dismissible>
            <strong>VERSION CHANGE DETECTED</strong>
            You have to save as new API if you change the version.
          </b-alert>
        </div>
        <div class="col">
          <b-button
            variant="link"
            @click="onClose"
            size="lg"
            data-qa="btnCancel"
            block
          >
            Close
          </b-button>
        </div>
        <div class="col">
          <b-button
            variant="primary"
            @click="handleSubmit"
            size="lg"
            data-qa="btnSave"
            block
          >
            <span v-if='isVersionChanged'><Icon icon="plus" /> Create New Version</span>
            <span v-else-if="role === 'add'"><Icon icon="plus" /> Create</span>
            <span v-else><Icon icon="save" /> Save</span>
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import yaml from 'js-yaml';
import Helpers from '@/helpers';
import AbyssTool from '@/components/shared/apiDesigner/abyssTool/AbyssTool';
import Editor from '@/components/shared/Editor';
import Icon from '@/components/shared/Icon';
import api from '@/api';

export default {
  components: {
    AbyssTool,
    Editor,
    Icon,
  },
  props: {
    api: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    title: {
      type: String,
      required: false,
    },
    initialView: {
      type: String,
      required: false,
      default() { return 'hybrid'; },
    },
    onClose: {
      type: Function,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      view: this.initialView,
      records: [(JSON.parse(JSON.stringify(this.api)))],
      apiInitialVersion: this.api.openapidocument.info.version,
      recordIndex: 0,
      licensesToClone: [],
      showNotValidAlert: false,
      notValidMessage: [],
      showSavedAlert: false,
      showCreatedAlert: false,
      isVersionChanged: false,
      mode: 'json',
    };
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
    }),
    editorValue() {
      const { records, recordIndex, mode } = this;
      const { openapidocument } = records[recordIndex];
      if (mode === 'json') {
        return JSON.stringify(openapidocument, null, '\t');
      } else if (mode === 'yaml') {
        return yaml.dump(openapidocument);
      }
      return openapidocument;
    },
    apiVersion() {
      return this.records[this.recordIndex].openapidocument.info.version;
    },
  },
  mounted() {
    this.getApiLicenses();
  },
  watch: {
    apiVersion(newValue) {
      if (newValue) {
        console.log('newValue: ', newValue); // eslint-disable-line
        if (newValue !== this.apiInitialVersion) {
          this.isVersionChanged = true;
        } else {
          this.isVersionChanged = false;
        }
      }
    },
  },
  methods: {
    ...mapActions('businessApis', ['putBusinessApis', 'postBusinessApis']),
    ...mapActions('proxies', ['putProxies', 'postProxies']),
    ...mapActions('apiLicenses', ['postApiLicensesRefs']),
    ...mapActions('resources', ['postResources']),
    ...mapActions('permissions', ['postPermissions']),
    getApiLicenses() {
      if (this.api.isproxyapi) {
        api.getApiLicensesRefsApi(this.api.uuid).then((response) => {
          if (response && response.data) {
            this.licensesToClone = response.data.filter(item => !item.isdeleted);
          }
        })
        .catch((error) => {
          if (error.status === 404) {
            this.licensesToClone = [];
          }
        });
      }
    },
    setView(view) {
      this.view = view;
    },
    setMode(mode) {
      this.mode = mode;
    },
    handleChange(propAddress, newPropValue, customAction, replaceItem) {
      console.log('pa, npv, ca: ', propAddress, newPropValue, customAction); // eslint-disable-line
      const { records, recordIndex } = this;
      const { objectDeepUpdate } = Helpers;
      let newRecord = JSON.parse(JSON.stringify(records[recordIndex])); // eslint-disable-line
      objectDeepUpdate(propAddress, newPropValue, newRecord, customAction);
      if (replaceItem) {
        objectDeepUpdate(propAddress.slice(0, -1), { [replaceItem]: newPropValue }, newRecord);
      }
      this.records = [...this.records.slice(0, (recordIndex + 1)), newRecord];
      this.recordIndex += 1;
      api.validateApi({ spec: records[recordIndex].openapidocument }).then(() => {
      })
      .catch((error) => {
        this.showNotValidAlert = true;
        this.notValidMessage = JSON.parse(error.data.usermessage);
      });
    },
    handleEditorChange(newValue) {
      try {
        const { records, recordIndex, mode } = this;
        let newRecord = { // eslint-disable-line
          ...records[recordIndex],
          openapidocument: {
            ...(mode === 'json' ? JSON.parse(newValue) : yaml.load(newValue)),
          },
        };
        this.records = [...this.records.slice(0, (recordIndex + 1)), newRecord];
        this.recordIndex += 1;
        api.validateApi({ spec: newRecord.openapidocument }).then(() => {
        })
        .catch((error) => {
          this.showNotValidAlert = true;
          this.notValidMessage = JSON.parse(error.data.usermessage);
        });
        return true;
      } catch (e) {
        return false;
      }
    },
    handleUndo() {
      if (this.recordIndex > 0) {
        this.recordIndex -= 1;
      }
    },
    handleRedo() {
      if (this.recordIndex < (this.records.length - 1)) {
        this.recordIndex += 1;
      }
    },
    addBusinessApi(item) {
      const { postBusinessApis, currentUser, postResources, postPermissions } = this;
      postBusinessApis(item).then((response) => {
        if (response && response.data) {
          const createdApi = response.data[0].response;
          /* // !!! replace after cascade
          this.showCreatedAlert = true;
          setTimeout(() => {
            this.showCreatedAlert = false;
            this.onClose();
          }, 3000);
          // !!! */
          const resourceApiToAdd = [{
            organizationid: createdApi.organizationid,
            crudsubjectid: createdApi.crudsubjectid,
            resourcetypeid: 'e2c446ad-f947-4a56-aed4-397534376aeb',
            resourcename: `${createdApi.openapidocument.info.title} ${createdApi.openapidocument.info.version} BUSINESS API ${createdApi.uuid}`,
            description: createdApi.openapidocument.info.description,
            resourcerefid: createdApi.uuid,
            isactive: true,
          }];
          postResources(resourceApiToAdd).then((responseResource) => {
            if (responseResource && responseResource.data) {
              const createdResource = responseResource.data[0].response;
              const permissionToAdd = [{
                organizationid: createdApi.organizationid,
                crudsubjectid: createdApi.crudsubjectid,
                permission: `Ownership of ${createdApi.openapidocument.info.title} BUSINESS API by ${currentUser.props.displayname}`,
                description: `Ownership of ${createdApi.openapidocument.info.title} BUSINESS API by ${currentUser.props.displayname}`,
                effectivestartdate: this.$moment.utc().toISOString(),
                effectiveenddate: this.$moment.utc().add(50, 'years').toISOString(),
                subjectid: createdApi.subjectid,
                resourceid: createdResource.uuid,
                resourceactionid: 'be55e687-8495-481f-a953-b450bb185f17', // ALL_BUSINESS_API_ACTION
                accessmanagerid: '6223ebbe-b30f-4976-bcf9-364003142379', // Abyss Access Manager
                isactive: true,
              }];
              postPermissions(permissionToAdd).then((responsePermission) => {
                if (responsePermission && responsePermission.data) {
                  this.showCreatedAlert = true;
                  setTimeout(() => {
                    this.showCreatedAlert = false;
                    this.onClose();
                  }, 3000);
                }
              });
            }
          });
          // !!!
        }
      });
    },
    handleSubmit() {
      const { records, recordIndex, role,
        putBusinessApis, putProxies, postProxies,
        postApiLicensesRefs, currentUser, postResources, postPermissions } = this;
      const currentApi = records[recordIndex];
      const { openapidocument, businessapiid } = currentApi;
      // VALIDATE API
      api.validateApi({ spec: openapidocument }).then(() => {
        if (this.isVersionChanged) { // VERSION CREATE
          const apiToVersion = {
            ...currentApi,
            version: currentApi.openapidocument.info.version,
            // apioriginid: currentApi.apioriginid,
            apioriginid: currentApi.apioriginid !== null ? currentApi.apioriginid : currentApi.uuid,
            apiparentid: currentApi.uuid,
            businessapiid: businessapiid !== null ? businessapiid : currentApi.uuid,
          };
          const { uuid, created, updated, deleted, isdeleted, ...restVersion } = apiToVersion;
          if (currentApi.isproxyapi) {
            postProxies([{ // PROXY VERSION CREATE
              ...restVersion,
            }]).then((response) => {
              if (response && response.data) {
                const createdProxy = response.data[0].response;
                /* // !!! replace after cascade
                // licenses
                if (this.licensesToClone.length) {
                  const licenses = this.licensesToClone.map(item => ({
                    organizationid: createdProxy.organizationid,
                    crudsubjectid: createdProxy.crudsubjectid,
                    apiid: createdProxy.uuid,
                    licenseid: item.licenseid,
                    isactive: true,
                  }));
                  for (let i = 0; i < licenses.length; i += 1) {
                    postApiLicensesRefs([licenses[i]]).then((res) => {
                      if (res && i === licenses.length - 1) {
                        this.showCreatedAlert = true;
                        setTimeout(() => {
                          this.showCreatedAlert = false;
                          this.onClose();
                        }, 3000);
                      }
                    })
                    .catch((error) => {
                      if (error && i === licenses.length - 1) {
                        this.onClose();
                      }
                    });
                  }
                }
                // licenses
                // !!! */
                const resourceProxyToAdd = [{
                  organizationid: createdProxy.organizationid,
                  crudsubjectid: createdProxy.crudsubjectid,
                  resourcetypeid: '505099b4-19da-401c-bd17-8c3a85d89743',
                  resourcename: `${createdProxy.openapidocument.info.title} ${createdProxy.openapidocument.info.version} PROXY API`,
                  description: createdProxy.openapidocument.info.description,
                  resourcerefid: createdProxy.uuid,
                  isactive: true,
                }];
                postResources(resourceProxyToAdd).then((responseResource) => {
                  if (responseResource && responseResource.data) {
                    const createdResource = responseResource.data[0].response;
                    const permissionToAdd = [{
                      organizationid: createdProxy.organizationid,
                      crudsubjectid: createdProxy.crudsubjectid,
                      permission: `Ownership of ${createdProxy.openapidocument.info.title} PROXY API by ${currentUser.props.displayname}`,
                      description: `Ownership of ${createdProxy.openapidocument.info.title} PROXY API by ${currentUser.props.displayname}`,
                      effectivestartdate: this.$moment.utc().toISOString(),
                      effectiveenddate: this.$moment.utc().add(50, 'years').toISOString(),
                      subjectid: createdProxy.subjectid,
                      resourceid: createdResource.uuid,
                      resourceactionid: 'd5318796-9ad3-4445-892f-27670cda77d6',
                      accessmanagerid: '6223ebbe-b30f-4976-bcf9-364003142379', // Abyss Access Manager
                      isactive: true,
                    }];
                    postPermissions(permissionToAdd).then((responsePermission) => {
                      if (responsePermission && responsePermission.data) {
                        // licenses
                        if (this.licensesToClone.length) {
                          const licenses = this.licensesToClone.map(item => ({
                            organizationid: createdProxy.organizationid,
                            crudsubjectid: createdProxy.crudsubjectid,
                            apiid: createdProxy.uuid,
                            licenseid: item.licenseid,
                            isactive: true,
                          }));
                          for (let i = 0; i < licenses.length; i += 1) {
                            postApiLicensesRefs([licenses[i]]).then((res) => {
                              if (res && i === licenses.length - 1) {
                                this.showCreatedAlert = true;
                                setTimeout(() => {
                                  this.showCreatedAlert = false;
                                  this.onClose();
                                }, 3000);
                              }
                            })
                            .catch((error) => {
                              if (error && i === licenses.length - 1) {
                                this.onClose();
                              }
                            });
                          }
                        }
                        // licenses
                      }
                    });
                  }
                });
                // !!
              }
            });
          } else { // BUSINESS VERSION CREATE
            this.addBusinessApi([{
              ...restVersion,
            }]);
          }
        } else if (role === 'edit') { // UPDATE API
          const apiToUpdate = {
            ...currentApi,
            version: currentApi.openapidocument.info.version,
            apioriginid: currentApi.uuid,
            apiparentid: currentApi.uuid,
            businessapiid: businessapiid !== null ? businessapiid : currentApi.uuid,
          };
          if (currentApi.isproxyapi) {
            putProxies({
              ...apiToUpdate,
            })
            .then(() => {
              this.showSavedAlert = true;
              setTimeout(() => {
                this.showSavedAlert = false;
              }, 3000);
            });
          } else {
            putBusinessApis({
              ...apiToUpdate,
            })
            .then(() => {
              this.showSavedAlert = true;
              setTimeout(() => {
                this.showSavedAlert = false;
              }, 3000);
            });
          }
        } else if (role === 'add') { // CREATE API
          this.addBusinessApi([{
            ...currentApi,
          }]);
        }
      })
      .catch((error) => {
        console.log('error: ', error); // eslint-disable-line
        this.showNotValidAlert = true;
        this.notValidMessage = JSON.parse(error.data.usermessage);
        // setTimeout(() => {
        //   this.showNotValidAlert = false;
        // }, 3000);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.api-designer-container {
  .api-designer-actions-bar {
    border-bottom: 1px solid #e9ecef;
    padding: 1rem 1rem;

    .toolbar-title {
      display: inline-flex;
      vertical-align: middle;
      font-size: 1.5rem;
      font-weight: 500;
      margin-right: 1rem;
    }

    .btn.btn-secondary.btn-selected {
      background-color: #5a6268;
      border-color: #545b62;
    }
  }

  .api-designer-columns-container {
    display: flex;
    flex-direction: row;
    flex: 1 0 0;
    height: calc(100vh - 215px);

    .api-designer-abyss-container {
      display: flex;
      flex: 1 0 0;
    }

    .api-designer-editor-container {
      display: flex;
      flex: 1 0 0;
    }
  }

  .api-designer-footer {
    padding: 1rem;
    border-top: 1px solid #dee2e6;
  }
}
</style>
