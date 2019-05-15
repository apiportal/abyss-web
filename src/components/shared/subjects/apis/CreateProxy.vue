<template>
  <div>
    <ConfirmModal
      v-if="isBusinessApisLoaded"
      title="Create New Proxy API?"
      confirm="Create New Proxy"
      :text="`You are about to create new Proxy API from ${api.openapidocument.info.title} Business API`"
      :onClose="handleModalClose"
      :onConfirm="handleModalConfirm"
    />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import ConfirmModal from '@/components/shared/modals/ConfirmModal';

export default {
  components: {
    ConfirmModal,
  },
  props: {
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
  },
  methods: {
    ...mapActions('proxies', ['postProxies']),
    ...mapActions('resources', ['postResources']),
    ...mapActions('permissions', ['postPermissions']),
    handleModalClose() {
      this.$router.push(this.routePath);
    },
    handleModalConfirm() {
      const { api, currentUser, postProxies, postResources, postPermissions } = this;
      const { uuid, created, updated, deleted, isdeleted, ...rest } = api;
      const proxyToAdd = [{
        ...rest,
      }];
      console.log('proxyToAdd: ', proxyToAdd); // eslint-disable-line
      postProxies(proxyToAdd).then((response) => {
        if (response && response.data) {
          const createdApi = response.data[0].response;
          /* // !!! replace after cascade
          this.$store.dispatch('proxies/getProxies', {
            uuid: currentUser.uuid,
            refresh: true,
          });
          this.$router.push(`/app/my-apis/my-proxy-apis/1/edit-api/${createdApi.uuid}`);
          // !!! */
          const resourceToAdd = [{
            organizationid: createdApi.organizationid,
            crudsubjectid: createdApi.crudsubjectid,
            resourcetypeid: '505099b4-19da-401c-bd17-8c3a85d89743',
            resourcename: `${createdApi.openapidocument.info.title} ${createdApi.openapidocument.info.version} PROXY API`,
            description: createdApi.openapidocument.info.description,
            resourcerefid: createdApi.uuid,
            isactive: true,
          }];
          postResources(resourceToAdd).then((responseResource) => {
            if (responseResource && responseResource.data) {
              const createdResource = responseResource.data[0].response;
              const permissionToAdd = [{
                organizationid: createdApi.organizationid,
                crudsubjectid: createdApi.crudsubjectid,
                permission: `Ownership of ${createdApi.openapidocument.info.title} PROXY API by ${currentUser.props.displayname}`,
                description: `Ownership of ${createdApi.openapidocument.info.title} PROXY API by ${currentUser.props.displayname}`,
                effectivestartdate: this.$moment.utc().toISOString(),
                effectiveenddate: this.$moment.utc().add(50, 'years').toISOString(),
                subjectid: createdApi.subjectid,
                resourceid: createdResource.uuid,
                resourceactionid: 'd5318796-9ad3-4445-892f-27670cda77d6',
                accessmanagerid: '6223ebbe-b30f-4976-bcf9-364003142379', // Abyss Access Manager
                isactive: true,
              }];
              postPermissions(permissionToAdd).then((responsePermission) => {
                if (responsePermission && responsePermission.data) {
                  this.$store.dispatch('proxies/getProxies', {
                    uuid: currentUser.uuid,
                    refresh: true,
                  });
                  this.$router.push(`/app/my-apis/my-proxy-apis/1/edit-api/${createdApi.uuid}`);
                }
              });
            }
          });
          // !!!
        }
      });
    },
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      businessApis: state => state.businessApis.items,
      isBusinessApisLoaded: state => state.businessApis.lastUpdatedAt,
    }),
    api() {
      const { apiId, businessApis, currentUser } = this;
      const api = businessApis.find(item => item.uuid === apiId);
      const newExtendedDocument = () => {
        const extendeddocument = JSON.parse(JSON.stringify(api.openapidocument));
        extendeddocument.security = [];
        extendeddocument.components.securitySchemes = {
          abyssApiKeyAuth: {
            in: 'header',
            name: 'abyss-gateway-api-access-token',
            type: 'apiKey',
          },
        };
        const paths = Object.keys(extendeddocument.paths);
        for (let i = 0; i < paths.length; i += 1) {
          extendeddocument.paths[paths[i]]['x-abyss-path'] = paths[i];
          const operations = Object.keys(extendeddocument.paths[paths[i]]);
          for (let o = 0; o < operations.length; o += 1) {
            delete extendeddocument.paths[paths[i]][operations[o]].security;
          }
        }
        const servers = extendeddocument.servers;
        for (let i = 0; i < servers.length; i += 1) {
          servers[i]['x-abyss-url'] = servers[i].url;
          servers[i].url = `${currentUser.gatewayUrl}${api.uuid}`;
        }
        return extendeddocument;
      };
      const newOpenapiDocument = () => {
        const openapidocument = JSON.parse(JSON.stringify(newExtendedDocument()));
        const servers = openapidocument.servers;
        for (let i = 0; i < servers.length; i += 1) {
          delete servers[i]['x-abyss-url'];
        }
        const paths = Object.keys(openapidocument.paths);
        for (let i = 0; i < paths.length; i += 1) {
          delete openapidocument.paths[paths[i]]['x-abyss-path'];
        }
        return openapidocument;
      };
      const proxyToAdd = {
        ...api,
        crudsubjectid: currentUser.uuid,
        businessapiid: api.uuid,
        isproxyapi: true,
        extendeddocument: newExtendedDocument(),
        openapidocument: newOpenapiDocument(),
      };
      console.log('proxyToAdd--: ', proxyToAdd); // eslint-disable-line
      return proxyToAdd;
    },
  },
  data() {
    return {
      apiId: this.$route.params.apiId,
    };
  },
};
</script>