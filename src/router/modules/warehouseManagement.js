/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const warehouseManagementRouter = {
  path: '/warehouse-management',
  component: Layout,
  name: 'WarehouseManagement',
  redirect: '/warehouse-management/material-management/material-warehouse',
  meta: {
    title: '仓库管理',
    icon: 'warehouse',
    roles: ['50_201_2', '50_203_2']
  },
  children: [
    {
      path: '/warehouse-management/material-management',
      component: () => import('@/views/warehouse-management/material-management'),
      redirect: '/warehouse-management/material-management/material-warehouse',
      name: 'MaterialManagement',
      meta: { title: '物料管理', roles: ['50_203_2'] },
      children: [
        {
          path: '/warehouse-management/material-management/material-warehouse',
          component: () => import('@/views/warehouse-management/material-management/material-warehouse'),
          name: 'WareMaterialWarehouse',
          meta: { title: '物料仓', roles: ['50_203_2'] }
        },
        {
          path: '/warehouse-management/material-management/in-warehouse-verify',
          component: () => import('@/views/warehouse-management/material-management/in-warehouse-verify'),
          name: 'WareInWarehouseVerify',
          meta: { title: '入库审核', roles: ['50_203_2'] }
        },
        // {
        //   path: '/warehouse-management/material-management/in-warehouse-record',
        //   component: () => import('@/views/warehouse-management/material-management/in-warehouse-record'),
        //   name: 'WareInWarehouseRecord',
        //   meta: { title: '入库记录', roles: ['admin'] }
        // },
        {
          path: '/warehouse-management/material-management/out-warehouse-record',
          component: () => import('@/views/warehouse-management/material-management/out-warehouse-record'),
          name: 'WareOutWarehouseRecord',
          meta: { title: '出库记录', roles: ['50_203_2'] }
        },
        {
          path: '/warehouse-management/material-management/quit-warehouse-verify',
          component: () => import('@/views/warehouse-management/material-management/quit-warehouse-verify'),
          name: 'WareQuitWarehouseVerify',
          meta: { title: '退库审核', roles: ['50_203_2'] }
        }
      ]
    },
    {
      path: '/warehouse-management/material-setting',
      component: () => import('@/views/warehouse-management/material-setting'),
      redirect: '/warehouse-management/material-setting/material-class',
      name: 'MaterialSetting',
      meta: { title: '物料设置', roles: ['50_201_2'] },
      children: [
        {
          path: '/warehouse-management/material-setting/material-class',
          component: () => import('@/views/warehouse-management/material-setting/material-class'),
          redirect: '/warehouse-management/material-setting/material-class/list',
          name: 'WareMaterialClass',
          meta: { title: '物料分类', roles: ['50_201_2'] },
          children: [
            {
              path: '/warehouse-management/material-setting/material-class/list',
              component: () => import('@/views/warehouse-management/material-setting/material-class/list'),
              name: 'WareMaterialClassList',
              meta: { title: '分类详情', roles: ['50_201_2'] },
              hidden: true
            }
            // {
            //   path: '/warehouse-management/material-setting/material-class/detail',
            //   component: () => import('@/views/warehouse-management/material-setting/material-class/detail'),
            //   name: 'WareMaterialClassDetail',
            //   meta: { title: '种类详情', roles: ['admin'] },
            //   hidden: true
            // }
          ]
        },
        {
          path: '/warehouse-management/material-setting/inventory-warning',
          component: () => import('@/views/warehouse-management/material-setting/inventory-warning'),
          name: 'WareInventoryWarning',
          meta: { title: '库存预警', roles: ['50_201_2'] }
        }
      ]
    }
  ]
}

export default warehouseManagementRouter
