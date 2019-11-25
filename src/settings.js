module.exports = {
  title: 'CM-WMS物料管理系统',

  /**
   * @type {boolean} true | false
   * @description 是否在右面板显示设置
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description 是否需要标签查看
   */
  tagsView: false,

  /**
   * @type {boolean} true | false
   * @description 是否固定标题
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description 是否在边栏中显示图标
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description 显示错误日志组件。
   * 默认仅在生产环境中使用
   * 如果还想在其他地方使用它，则可以通过 ['production', 'development']
   */
  errorLog: 'production'
}
