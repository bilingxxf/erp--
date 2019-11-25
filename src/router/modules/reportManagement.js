/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const reportManagementRouter = {
  path: '/report-management',
  component: Layout,
  redirect: '/report-management',
  children: [
    {
      path: '/report-management/residual-material',
      component: () => import('@/views/report-management/'),
      //   redirect: '/report-management/residual-material',
      name: 'ReportManagement',
      meta: { title: '统计报表', icon: 'chart', roles: ['50_207_2'] }
    }
  ]
}

export default reportManagementRouter
