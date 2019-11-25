/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const SupportManagementRouter = {
  path: '/support-management',
  component: Layout,
  redirect: '/support-management',
  children: [
    {
      path: '/support-management',
      component: () => import('@/views/support-management'),
      name: 'SupportManagement',
      meta: { title: '售后支持', icon: 'after-sale' }
    }
  ]
}

export default SupportManagementRouter
