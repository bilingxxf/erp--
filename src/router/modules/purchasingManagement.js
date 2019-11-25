/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const purchasingManagementRouter = {
  path: '/purchasing-management',
  component: Layout,
  name: 'PurchasingManagement',
  redirect: '/purchasing-management/material-handling',
  meta: {
    title: '采购管理',
    icon: 'purchasing',
    roles: ['50_202_1', '50_202_2', '50_200_2']
  },
  children: [
    {
      path: '/purchasing-management/material-handling',
      component: () => import('@/views/purchasing-management/material-handling/index'),
      redirect: '/purchasing-management/material-handling/in-warehouse-handing',
      name: 'MaterialHandling',
      meta: { title: '物料办理', roles: ['50_202_1', '50_202_2'] },
      children: [
        {
          path: '/purchasing-management/material-handling/in-warehouse-handing',
          component: () => import('@/views/purchasing-management/material-handling/in-warehouse-handing'),
          name: 'MatInWarehouseHanding',
          meta: { title: '入库办理', roles: ['50_202_1'] }
        },
        {
          path: '/purchasing-management/material-handling/in-warehouse-record',
          component: () => import('@/views/purchasing-management/material-handling/in-warehouse-record'),
          name: 'MatInWarehouseRecord',
          meta: { title: '入库记录', roles: ['50_202_2'] }
        },
        {
          path: '/purchasing-management/material-handling/quit-warehouse-handing',
          component: () => import('@/views/purchasing-management/material-handling/quit-warehouse-handing'),
          name: 'MatQuitWarehouseHanding',
          meta: { title: '退库办理', roles: ['50_202_2'] }
        },
        {
          path: '/purchasing-management/material-handling/quit-warehouse-record',
          component: () => import('@/views/purchasing-management/material-handling/quit-warehouse-record'),
          name: 'MatQuitWarehouseRecord',
          meta: { title: '退库记录', roles: ['50_202_2'] }
        }
      ]
    },
    {
      path: '/purchasing-management/supplier-management',
      component: () => import('@/views/purchasing-management/supplier-management'),
      redirect: '/purchasing-management/supplier-management/list',
      name: 'SupplierManagementList',
      meta: { title: '供应商管理', roles: ['50_200_2'] },
      children: [
        {
          path: '/purchasing-management/supplier-management/list',
          component: () => import('@/views/purchasing-management/supplier-management/list'),
          name: 'SupplierManagementList',
          hidden: true,
          meta: { title: '供应商列表', roles: ['50_200_2'] }
        },
        {
          path: '/purchasing-management/supplier-management/create',
          component: () => import('@/views/purchasing-management/supplier-management/create'),
          name: 'SupplierManagementCreate',
          hidden: true,
          meta: { title: '添加供应商', roles: ['50_200_1'] }
        },
        {
          path: '/purchasing-management/supplier-management/edit',
          component: () => import('@/views/purchasing-management/supplier-management/edit'),
          name: 'SupplierManagementEdit',
          hidden: true,
          meta: { title: '编辑供应商', roles: ['50_200_1'] }
        },
        {
          path: '/purchasing-management/supplier-management/transaction-record',
          component: () => import('@/views/purchasing-management/supplier-management/transaction-record'),
          name: 'SupplierManagementTranRecord',
          hidden: true,
          meta: { title: '交易记录', roles: ['50_200_2'] }
        },
        {
          path: '/bullet-box',
          component: () => import('@/views/purchasing-management/supplier-management/bullet-box'),
          name: 'SupplierManagementBulletBox',
          hidden: true,
          meta: { title: '详情', roles: ['50_200_2'] }
        }
      ]
    }
  ]
}

export default purchasingManagementRouter
