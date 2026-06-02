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
    <h2>平台沉淀</h2>
    <p>运维知识固化为平台资产，让 Agent 沿确定性轨道执行，结果可预期、可复跑。</p>
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
      <p class="sls-starops-card__desc">写给 STAROps 的 6 条 prompt 原则，配反例 / 正例对照与可直接套用的模板，让 Agent 一次拿到正确实体、走完正确推理路径。</p>
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
    <a class="sls-starops-card" href="/doc/starops/practices/rds-inspection-via-script/article.html">
      <h3 class="sls-starops-card__title">RDS 周期性自动巡检</h3>
      <p class="sls-starops-card__desc">用数字员工 + 长期任务自动调度巡检脚本，覆盖核心指标、性能、安全共 19 项检查。结果可通过邮件、群机器人或 Webhook 送达。</p>
      <span class="sls-starops-card__cta">查看文档</span>
    </a>
    <a class="sls-starops-card" href="/doc/starops/practices/business-reliability-flow/article.html">
      <h3 class="sls-starops-card__title">业务服务可靠性巡检</h3>
      <p class="sls-starops-card__desc">在同一 thread 内按 5 Phase 串接业务指标基线 → 应用指标关联 → 依赖拓扑 → 告警事件 → 综合报告，依托 ARMS APM 指标与 UModel 语义化拓扑产出含 SLO 评估与行动项的服务可靠性报告。</p>
      <span class="sls-starops-card__cta">查看文档</span>
    </a>
    <a class="sls-starops-card" href="/doc/starops/practices/alert-rca-flow/article.html">
      <h3 class="sls-starops-card__title">告警 RCA 全链路分析</h3>
      <p class="sls-starops-card__desc">告警触发后，在同一 thread 内按 6 Phase 串接分诊 → 数据确认 → 根因定位 → 证据采集 → 修复建议 → 复盘治理，跨指标 / 日志 / trace 关联归因，产出含根因假设、证据包与 Action Items 的 RCA 报告。</p>
      <span class="sls-starops-card__cta">查看文档</span>
    </a>
    <a class="sls-starops-card" href="/doc/starops/practices/umodel-metric-entity/article.html">
      <h3 class="sls-starops-card__title">UModel 指标语义与实体拓扑</h3>
      <p class="sls-starops-card__desc">通过 5 个正反例样例覆盖 STAROps 中 @ 实体提问的 5 类常见场景：单位 / 聚合口径 / 实体维度 / 拓扑链 / UModel 缺失字段，附实测回包截图与受影响应用清单。</p>
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
    <div class="sls-starops-card sls-starops-card--placeholder">
      <h3 class="sls-starops-card__title">MCP 集成与治理检查清单</h3>
      <p class="sls-starops-card__desc">MCP 接入前需要确认的几项：集成范围、访问边界、通知方式、回滚路径。</p>
    </div>
  </div>
</section>

<section class="sls-starops-section" id="platform">
  <div class="sls-starops-section__head">
    <div class="sls-starops-section__title-wrap">
      <h2 class="sls-starops-section__title">平台沉淀</h2>
    </div>
  </div>
  <div class="sls-starops-grid sls-starops-grid--three">
    <div class="sls-starops-card sls-starops-card--placeholder">
      <h3 class="sls-starops-card__title">编写 Skill 确定性脚本</h3>
      <p class="sls-starops-card__desc">把单位换算、聚合计算、阈值判断从模型推理改为脚本执行，保证同输入同输出。</p>
    </div>
  </div>
</section>
