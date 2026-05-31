---
pageClass: sls-starops-home
---

<section class="sls-starops-hero">
  <div class="sls-starops-hero__content">
    <div class="sls-starops-hero__breadcrumb">
      <a href="/doc/">阿里云可观测</a>
      <span>/</span>
      <span>STAROps</span>
    </div>
    <p class="sls-starops-hero__eyebrow">STAROps Best Practices</p>
    <h1>智能运维场景化<br /><em>最佳实践库</em></h1>
    <p class="sls-starops-hero__lede">STAROps 在常见运维场景下的使用案例。每条实践对应一个真实操作流程，包含步骤说明、配置示例和脚本结构。</p>
    <div class="sls-starops-hero__signals" aria-label="实践主题">
      <span>业务指标守护</span>
      <span>告警 RCA</span>
      <span>RDS 巡检</span>
      <span>日志洞察</span>
      <span>MCP 集成</span>
      <span>UModel · Skill</span>
    </div>
  </div>
</section>

<section class="sls-starops-scene-nav">
  <a class="sls-starops-scene-card" href="#onboarding" data-tone="brand">
    <h2>入门起步</h2>
    <p>账号开通、数字员工创建、第一次提问的步骤说明。</p>
    <span class="sls-starops-scene-card__cta">查看实践</span>
  </a>
  <a class="sls-starops-scene-card" href="#scenarios" data-tone="cyan">
    <h2>场景实践</h2>
    <p>业务指标守护、告警 RCA、RDS 巡检、日志洞察等场景的完整操作流程。</p>
    <span class="sls-starops-scene-card__cta">查看实践</span>
  </a>
  <a class="sls-starops-scene-card" href="#integrations" data-tone="violet">
    <h2>扩展集成</h2>
    <p>把现有工具链和数据源接入 STAROps，包括 MCP 工具与 CI/CD 数据。</p>
    <span class="sls-starops-scene-card__cta">查看实践</span>
  </a>
  <a class="sls-starops-scene-card" href="#platform" data-tone="amber">
    <h2>自定义扩展</h2>
    <p>把团队流程写成 Skill、把指标写成 UModel、把判断写成确定性脚本。</p>
    <span class="sls-starops-scene-card__cta">查看实践</span>
  </a>
</section>

<section class="sls-starops-section" id="onboarding">
  <div class="sls-starops-section__head">
    <div class="sls-starops-section__title-wrap">
      <span class="sls-starops-section__kicker">01 · 入门起步</span>
      <h2 class="sls-starops-section__title">入门起步</h2>
    </div>
  </div>
  <div class="sls-starops-grid sls-starops-grid--three">
    <a class="sls-starops-card" href="/doc/starops/onboarding/effective-prompts/article">
      <h3 class="sls-starops-card__title">与 STAROps 有效对话</h3>
      <p class="sls-starops-card__desc">写给 STAROps 的 6 条 prompt 原则，配反例 / 正例对照与可直接套用的模板，让 Agent 一次拿到正确实体、走完正确推理路径。</p>
      <span class="sls-starops-card__cta">查看文档</span>
    </a>
  </div>
</section>

<section class="sls-starops-section" id="scenarios">
  <div class="sls-starops-section__head">
    <div class="sls-starops-section__title-wrap">
      <span class="sls-starops-section__kicker">02 · 场景实践</span>
      <h2 class="sls-starops-section__title">场景实践</h2>
    </div>
  </div>
  <div class="sls-starops-grid sls-starops-grid--three">
    <a class="sls-starops-card" href="/doc/starops/practices/rds-inspection-via-script/article">
      <h3 class="sls-starops-card__title">RDS 周期性自动巡检</h3>
      <p class="sls-starops-card__desc">用数字员工 + 长期任务自动调度巡检脚本，覆盖核心指标、性能、安全共 19 项检查。结果可通过邮件、群机器人或 Webhook 送达。</p>
      <span class="sls-starops-card__cta">查看文档</span>
    </a>
    <a class="sls-starops-card" href="/doc/starops/practices/business-reliability-flow/article">
      <h3 class="sls-starops-card__title">业务可靠性守护</h3>
      <p class="sls-starops-card__desc">在同一 thread 内按 5 Phase 串接业务指标基线 → 应用指标关联 → 依赖拓扑 → 告警事件 → 综合报告，依托 APM 指标与 UModel 语义化拓扑产出含 SLO 评估与行动项的业务可靠性报告。</p>
      <span class="sls-starops-card__cta">查看文档</span>
    </a>
  </div>
</section>

<section class="sls-starops-section" id="integrations">
  <div class="sls-starops-section__head">
    <div class="sls-starops-section__title-wrap">
      <span class="sls-starops-section__kicker">03 · 扩展集成</span>
      <h2 class="sls-starops-section__title">扩展集成</h2>
    </div>
  </div>
  <div class="sls-starops-grid sls-starops-grid--three">
    <div class="sls-starops-card sls-starops-card--placeholder">
      <h3 class="sls-starops-card__title">MCP 集成与治理检查清单</h3>
      <p class="sls-starops-card__desc">MCP 接入前需要确认的几项：集成范围、访问边界、通知方式、回滚路径。</p>
    </div>
  </div>
</section>

<section class="sls-starops-section" id="platform">
  <div class="sls-starops-section__head">
    <div class="sls-starops-section__title-wrap">
      <span class="sls-starops-section__kicker">04 · 自定义扩展</span>
      <h2 class="sls-starops-section__title">自定义扩展</h2>
    </div>
  </div>
  <div class="sls-starops-grid sls-starops-grid--three">
    <div class="sls-starops-card sls-starops-card--placeholder">
      <h3 class="sls-starops-card__title">编写 Skill 确定性脚本</h3>
      <p class="sls-starops-card__desc">把单位换算、聚合计算、阈值判断从模型推理改为脚本执行，保证同输入同输出。</p>
    </div>
  </div>
</section>

<section class="sls-starops-cta">
  <div class="sls-starops-cta__inner">
    <div>
      <h3 class="sls-starops-cta__title">开始使用 STAROps</h3>
      <p class="sls-starops-cta__desc">Playground 提供只读演示环境，控制台用于真实配置。</p>
    </div>
    <div class="sls-starops-cta__btns">
      <a class="sls-starops-btn sls-starops-btn--primary" href="https://starops.console.aliyun.com" target="_blank">进入 STAROps 控制台</a>
      <a class="sls-starops-btn sls-starops-btn--ghost" href="/doc/playground/staropsdemo.html" target="_blank">体验 Playground</a>
    </div>
  </div>
</section>
