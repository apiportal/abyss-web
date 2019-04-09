<template>
  <div>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb d-flex justify-content-end mb-0" style="background: #036; border-radius: 0px;">
        <li class="breadcrumb-item mr-5" aria-current="page" style="color: rgba(255, 255, 255, 0.8);">Settings</li>
      </ol>
    </nav>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Account Activity">
          <ul class="list-group">
          <li class="list-group-item">
            <div class="md-v-line"></div>
            <b-form-checkbox switch class="mt-2" style="margin-left: -.4rem">
              <div class="d-flex flex-column ml-4" style="margin-top: -.6rem">
              Login Notifications
              <small>An immidiate email about new Abyss login notification</small>
              </div>
            </b-form-checkbox>
          </li>
          </ul>
        </b-tab>

        <b-tab title="Organization">
          <ul class="list-group">
          <li class="list-group-item">
            <div class="md-v-line"></div>
            <b-form-checkbox switch class="mt-2" style="margin-left: -.4rem">
              <div class="d-flex flex-column ml-4" style="margin-top: -.6rem">
              Show deleted items
              <small>Show all deleted items such as APIs, APPs, Licenses, User, Groups etc.</small>
              </div>
            </b-form-checkbox>
          </li>
          <li class="list-group-item">
            <div class="md-v-line"></div>
            <b-form-checkbox switch class="mt-2" style="margin-left: -.4rem">
              <div class="d-flex flex-column ml-4" style="margin-top: -.6rem">
              Show dark sidebar
              <small>Sidebar dark toggle button</small>
              </div>
            </b-form-checkbox>
          </li>
          <li class="list-group-item">
            <div class="md-v-line"></div>
            <b-form-checkbox switch class="mt-2" style="margin-left: -.4rem">
              <div class="d-flex flex-row ml-4">
              Delegate a user
              <button type="button" class="btn btn-secondary btn-sm mx-2">Select User</button>
              <button type="button" class="btn btn-secondary btn-sm mx-2">Select Date</button>
              </div>
            </b-form-checkbox>
          </li>
          </ul>
        </b-tab>

        <b-tab title="My Network">
          <ul class="list-group">
          <li class="list-group-item">
            <div class="md-v-line"></div>
            <b-form-checkbox switch class="mt-2" style="margin-left: -.4rem">
              <div class="d-flex flex-column ml-4" style="margin-top: -.6rem">
              News for you
              <small>A weekly email featuring about Abyss</small>
              </div>
            </b-form-checkbox>
          </li>
          </ul>
        </b-tab>

        <b-tab title="API">
          <ul class="list-group">
          <li class="list-group-item">
            <div class="md-v-line"></div>
            <b-form-checkbox switch class="mt-2" style="margin-left: -.4rem">
              <div class="d-flex flex-column ml-4">
              Allow Subscribe to my APIs without approval
              </div>
            </b-form-checkbox>
          </li>
          <li class="list-group-item">
            <div class="md-v-line"></div>
            <b-form-checkbox switch class="mt-2" style="margin-left: -.4rem">
              <div class="d-flex flex-column ml-4" style="margin-top: -.6rem">
              API Subscriptions
              <small>Get notifications about new subscriptions about your APIs</small>
              </div>
            </b-form-checkbox>
          </li>
          <li class="list-group-item">
            <div class="md-v-line"></div>
            <b-form-checkbox switch class="mt-2" style="margin-left: -.4rem">
              <div class="d-flex flex-column ml-4">
              Allow developers to promote API version without approval
              </div>
            </b-form-checkbox>
          </li>
          </ul>
        </b-tab>

        <b-tab title="APP">
          <ul class="list-group">
          <li class="list-group-item">
            <div class="md-v-line"></div>
            <b-form-checkbox switch class="mt-2" style="margin-left: -.4rem">
              <div class="d-flex flex-column ml-4" style="margin-top: -.6rem">
              APP Subscriptions
              <small>Get notifications about new subscriptions about your APPs</small>
              </div>
            </b-form-checkbox>
          </li>
          </ul>
        </b-tab>

        <b-tab title="Licenses">
          <ul class="list-group">
          <li class="list-group-item">
            <div class="md-v-line"></div>
            <b-form-checkbox switch class="mt-2" style="margin-left: -.4rem">
              <div class="d-flex flex-column ml-4" style="margin-top: -.6rem">
              License Subscriptions
              <small>Get notifications about new subscriptions about your Licenses</small>
              </div>
            </b-form-checkbox>
          </li>
          </ul>
        </b-tab>

        <b-tab title="Contracts">
          <ul class="list-group">
          <li class="list-group-item">
            <div class="md-v-line"></div>
            <b-form-checkbox switch class="mt-2" style="margin-left: -.4rem">
              <div class="d-flex flex-column ml-4" style="margin-top: -.6rem">
              Expirations
              <small>Get an email when your API or APP key, contracts and licenses are about to expire</small>
              </div>
            </b-form-checkbox>
          </li>
          </ul>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>
<script>
import Icon from '@/components/shared/Icon';

export default {
  components: {
    Icon,
  },
  data() {
    return {
      checked: false,
    };
  },
  methods: {
    onChangePassClick() {
      this.$router.push('/app/change-password');
    },
  },
};
</script>
<style>
.md-v-line {
    position: absolute;
    border-left: 1px solid rgba(0,0,0,.125);
    height: 100%;
    top: 0px;
    left: 54px;
    z-index:initial
}
</style>
