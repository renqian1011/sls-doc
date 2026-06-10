---
pageClass: sls-starops-home
---

<section class="sls-starops-hero">
  <div class="sls-starops-hero__content">
    <div class="sls-starops-hero__breadcrumb">
      <a href="/doc/index.html">阿里云可观测</a>
      <span>/</span>
      <span>STAROps</span>
    </div>
    <p class="sls-starops-hero__eyebrow">STAROps Best Practices</p>
    <h1>Agentic Ops<br /><em>最佳实践</em></h1>
    <p class="sls-starops-hero__lede">STAROps 在常见 Agentic Ops 场景下的使用案例。涵盖从入门到精通、从主动对话到异步任务、从巡检到业务守护的各类最佳实践。</p>
    <div class="sls-starops-hero__actions">
      <a class="sls-starops-btn sls-starops-btn--primary" href="https://starops.console.aliyun.com" target="_blank">进入 STAROps 控制台</a>
      <a class="sls-starops-btn sls-starops-btn--ghost" href="/doc/playground/staropsdemo.html" target="_blank">体验 Playground</a>
    </div>
    <div class="sls-starops-hero__signals" aria-label="实践主题">
      <span>UModel</span>
      <span>服务巡检</span>
      <span>告警 RCA</span>
      <span>RDS 巡检</span>
      <span>日志洞察</span>
      <span>MCP 集成</span>
      <span>Skill 集成</span>
    </div>
  </div>
</section>

<section class="sls-starops-scene-nav">
  <a class="sls-starops-scene-card" href="#onboarding" data-tone="brand">
    <h2>入门起步</h2>
    <p>第一次和 STAROps 对话前的准备与提问范式。</p>
    <span class="sls-starops-scene-card__cta">查看实践</span>
  </a>
  <a class="sls-starops-scene-card" href="#scenarios" data-tone="cyan">
    <h2>场景实践</h2>
    <p>主动巡检、主动会话、被动 RCA 三类典型场景的端到端操作流程。</p>
    <span class="sls-starops-scene-card__cta">查看实践</span>
  </a>
  <a class="sls-starops-scene-card" href="#integrations" data-tone="violet">
    <h2>扩展集成</h2>
    <p>外部工具链与数据源接入 STAROps 的合规与治理指引。</p>
    <span class="sls-starops-scene-card__cta">查看实践</span>
  </a>
  <a class="sls-starops-scene-card" href="#platform" data-tone="amber">
    <h2>平台沉淀</h2>
    <p>运维知识固化为 Skill 与确定性脚本，让 Agent 沿稳定轨道执行。</p>
    <span class="sls-starops-scene-card__cta">查看实践</span>
  </a>
</section>

<section class="sls-starops-section" id="onboarding">
  <div class="sls-starops-section__head">
    <div class="sls-starops-section__title-wrap">
      <h2 class="sls-starops-section__title">入门起步</h2>
    </div>
  </div>
  <div class="sls-starops-grid sls-starops-grid--three">
    <a class="sls-starops-card" href="/doc/starops/onboarding/effective-prompts/article.html">
      <h3 class="sls-starops-card__title">与 STAROps 有效对话</h3>
      <p class="sls-starops-card__desc">用 6 条 prompt 原则把模糊提问转成一次到位的精准请求，正反例可直接套用。</p>
      <span class="sls-starops-card__cta">查看文档</span>
    </a>
  </div>
</section>

<section class="sls-starops-section" id="scenarios">
  <div class="sls-starops-section__head">
    <div class="sls-starops-section__title-wrap">
      <h2 class="sls-starops-section__title">场景实践</h2>
    </div>
  </div>
  <div class="sls-starops-grid sls-starops-grid--three">
    <a class="sls-starops-card" href="/doc/starops/practices/umodel-metric-entity/article.html">
      <h3 class="sls-starops-card__title">UModel 使用指南</h3>
      <p class="sls-starops-card__desc">基于 UModel 语义层让 Agent 走显式语义而非靠猜，8 组正反例覆盖指标、拓扑、日志、链路、事件。</p>
      <span class="sls-starops-card__cta">查看文档</span>
    </a>
    <a class="sls-starops-card" href="/doc/starops/practices/rds-inspection-via-script/article.html">
      <h3 class="sls-starops-card__title">RDS 周期性自动巡检</h3>
      <p class="sls-starops-card__desc">把人工 SSH + SQL 的 RDS 巡检改成数字员工 + 长期任务自动跑 21 项检查，按 cron 主动送达。</p>
      <span class="sls-starops-card__cta">查看文档</span>
    </a>
    <a class="sls-starops-card" href="/doc/starops/practices/log-insight-pattern/article.html">
      <h3 class="sls-starops-card__title">日志模式定时巡检</h3>
      <p class="sls-starops-card__desc">日志模式聚类从一次性应急排查升级为周期巡检，新增、消失与异常模式主动报到。</p>
      <span class="sls-starops-card__cta">查看文档</span>
    </a>
    <a class="sls-starops-card" href="/doc/starops/practices/business-reliability-flow/article.html">
      <h3 class="sls-starops-card__title">业务服务可靠性巡检</h3>
      <p class="sls-starops-card__desc">5 Phase 串接业务基线、应用、拓扑、告警、报告，产出含 SLO 与行动项的服务可靠性体检报告。</p>
      <span class="sls-starops-card__cta">查看文档</span>
    </a>
    <a class="sls-starops-card" href="/doc/starops/practices/alert-rca-flow/article.html">
      <h3 class="sls-starops-card__title">告警 RCA 全链路分析</h3>
      <p class="sls-starops-card__desc">告警触发后 6 Phase 串接分诊、确认、根因、证据、修复、复盘，把 RCA 从「定位」做到「闭环」。</p>
      <span class="sls-starops-card__cta">查看文档</span>
    </a>
  </div>
</section>

<section class="sls-starops-section" id="integrations">
  <div class="sls-starops-section__head">
    <div class="sls-starops-section__title-wrap">
      <h2 class="sls-starops-section__title">扩展集成</h2>
    </div>
  </div>
  <div class="sls-starops-grid sls-starops-grid--three">
    <a class="sls-starops-card" href="/doc/starops/practices/mcp-integration/article.html">
      <h3 class="sls-starops-card__title">接入外部 MCP 工具</h3>
      <p class="sls-starops-card__desc">外部 MCP Server 一次接入、所有数字员工复用：5 步接入流程 + 5 项接入前检查 + 4 类执行策略匹配。</p>
      <span class="sls-starops-card__cta">查看文档</span>
    </a>
    <a class="sls-starops-card" href="/doc/starops/practices/dingtalk-integration/article.html">
      <h3 class="sls-starops-card__title">集成钉钉 IM 通道</h3>
      <p class="sls-starops-card__desc">钉钉应用 + AppFlow 连接流 + STAROps 数字员工三平台串联，4 步完成企业 IM 内对话式运维。</p>
      <span class="sls-starops-card__cta">查看文档</span>
    </a>
    <a class="sls-starops-card" href="/doc/starops/practices/devops-code-to-runtime/article.html">
      <h3 class="sls-starops-card__title">DevOps 跨域追因建模</h3>
      <p class="sls-starops-card__desc">将代码仓库、Release、镜像接入 UModel，补全告警到代码变更的 5 层追因链路。</p>
      <span class="sls-starops-card__cta">查看文档</span>
    </a>
  </div>
</section>

<section class="sls-starops-section" id="platform">
  <div class="sls-starops-section__head">
    <div class="sls-starops-section__title-wrap">
      <h2 class="sls-starops-section__title">平台沉淀</h2>
    </div>
  </div>
  <div class="sls-starops-grid sls-starops-grid--three">
    <a class="sls-starops-card" href="/doc/starops/practices/skill-authoring/article.html">
      <h3 class="sls-starops-card__title">编写 STAROps 运维 Skill</h3>
      <p class="sls-starops-card__desc">Skill 设计的 7 要素合规约束：触发、流程、脚本、输出、风控、失败、推理边界，附模板与自检 Checklist。</p>
      <span class="sls-starops-card__cta">查看文档</span>
    </a>
    <a class="sls-starops-card" href="/doc/starops/practices/skill-script-deterministic/article.html">
      <h3 class="sls-starops-card__title">编写 Skill 确定性脚本</h3>
      <p class="sls-starops-card__desc">数值计算交给脚本不交给 LLM——单位换算、聚合、阈值判断必须纯函数化，附 4 段 Python 模板。</p>
      <span class="sls-starops-card__cta">查看文档</span>
    </a>
  </div>
</section>
