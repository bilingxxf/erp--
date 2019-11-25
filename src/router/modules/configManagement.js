/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const configManagementRouter = {
  path: '/config-management',
  component: Layout,
  name: 'ConfigManagement',
  redirect: '/config-management/residual-material',
  meta: {
    title: '配置管理',
    icon: 'config',
    roles: ['50_204_2']
  },
  children: [
    {
      path: '/config-management/residual-material',
      component: () => import('@/views/config-management/residual-material'),
      //   redirect: '/config-management/residual-material',
      name: 'ConfigResidualMaterial',
      meta: { title: '废料定义', roles: ['50_204_2'] },
      children: []
    }
  ]
}

export default configManagementRouter
