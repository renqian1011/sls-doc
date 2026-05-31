function getSidebar() {
  return [
    {
      text: '入门起步',
      items: [{ text: '与 STAROps 有效对话', link: '/starops/onboarding/effective-prompts/article' }],
    },
    {
      text: '场景实践',
      items: [
        { text: 'RDS 周期性自动巡检', link: '/starops/practices/rds-inspection-via-script/article' },
        { text: '业务可靠性守护', link: '/starops/practices/business-reliability-flow/article' },
      ],
    },
    {
      text: '扩展集成',
      items: [{ text: 'MCP 集成与治理检查清单' }],
    },
    {
      text: '自定义扩展',
      items: [{ text: '编写 Skill 确定性脚本' }],
    },
  ]
}

module.exports = getSidebar
