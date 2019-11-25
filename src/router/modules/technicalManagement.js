/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const technicalManagementRouter = {
  path: '/technical-management',
  component: Layout,
  name: 'TechnicalManagement',
  redirect: '/technical-management/quota-management',
  meta: {
    title: '技术管理',
    icon: 'technical',
    roles: ['50_206_2']
  },
  children: [
    {
      path: '/technical-management/quota-management',
      component: () => import('@/views/technical-management/quota-management'),
      redirect: '/technical-management/quota-management/formulate',
      name: 'TechQuotaManagement',
      meta: { title: '定额管理', roles: ['50_206_2'] },
      children: [
        {
          path: '/technical-management/quota-management/formulate',
          component: () => import('@/views/technical-management/quota-management/formulate/index'),
          name: 'TechQuotaFormulate',
          meta: { title: '定额制定', roles: ['50_206_2'] }
        },
        {
          path: '/technical-management/quota-management/tracking',
          component: () => import('@/views/technical-management/quota-management/tracking/index'),
          name: 'TechQuotaTracking',
          meta: { title: '定额跟踪', roles: ['50_206_2'] }
        }
      ]
    }
  ]
}

export default technicalManagementRouter
