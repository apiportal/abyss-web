/* eslint-disable */
import { mount } from '@vue/test-utils';
import EditMyLicenses from '@/components/routes/myLicenses/EditMyLicenses';

describe('MyLicenses', () => {
  it('renders a greeting', () => {
    const wrapper = mount(EditMyLicenses)
    console.log(wrapper.html())
  })
})