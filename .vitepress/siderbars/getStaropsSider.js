function getSidebar() {
  return [
    {
      text: '入门起步',
      items: [{ text: '与 STAROps 有效对话', link: '/starops/onboarding/effective-prompts/article' }],
    },
    {
      text: '场景实践',
      items: [
        { text: 'UModel 指标语义与实体拓扑', link: '/starops/practices/umodel-metric-entity/article' },
        { text: 'RDS 周期性自动巡检', link: '/starops/practices/rds-inspection-via-script/article' },
        { text: '日志模式定时巡检', link: '/starops/practices/log-insight-pattern/article' },
        { text: '业务服务可靠性巡检', link: '/starops/practices/business-reliability-flow/article' },
        { text: '告警 RCA 全链路分析', link: '/starops/practices/alert-rca-flow/article' },
      ],
    },
    {
      text: '扩展集成',
      items: [
        { text: '接入外部 MCP 工具', link: '/starops/practices/mcp-integration/article' },
        { text: '集成钉钉 IM 通道', link: '/starops/practices/dingtalk-integration/article' },
        { text: 'DevOps 跨域追因建模', link: '/starops/practices/devops-code-to-runtime/article' },
      ],
    },
    {
      text: '平台沉淀',
      items: [
        { text: '编写 STAROps 运维 Skill', link: '/starops/practices/skill-authoring/article' },
        { text: '编写 Skill 确定性脚本', link: '/starops/practices/skill-script-deterministic/article' },
      ],
    },
  ]
}

module.exports = getSidebar
