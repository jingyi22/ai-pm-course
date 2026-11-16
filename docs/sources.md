# 来源清单

> 采集日期：2026-11-16。检索工具：WebSearch。
> 可信度备注说明：
> - **A** = 有明确权威来源/广泛共识的最佳实践
> - **B** = 多个来源一致，但数字阈值随场景变化，课程中需标注"常见取值"
> - **C** = 单一或聚合来源，仅作参考方向，不作事实引用

## 本轮检索主题 → 来源

### 1. AI PM 面试（产品 sense / AI 权衡 / 指标体系）

- 检索词：`AI product manager interview questions LLM product sense evaluation 2026`
- 可信度：**B**（面试要点属行业共识，但"2026 年具体考什么"会随市场变化）
- 用到的结论：面试三类能力、MVM（minimum viable model）、"假设 AI 就是答案"是致命失分、指标体系分层（业务/采纳/任务/质量/安全/系统/经济）、latency p50/p95/p99、token efficiency、用户纠错频率。
- 用于课程：m1 全模块、m2-l1、m6-l1、m8-l3、m8-l4、m9

### 2. LLM 评测最佳实践（golden set / LLM-as-Judge）

- 检索词：`LLM evaluation best practices LLM-as-judge golden dataset design 2026`
- 可信度：**B**（golden set 200–500 条、85–90% 对齐率是常见建议区间，非硬标准）
- 用到的结论：golden set 代表性/边界/失败模式、像代码一样版本化、200–500 条起步、LLM judge 三类偏差（长度/位置/同族）、人工对齐 85–90%、异步执行、抽样控成本、混合评测（judge 打底 + 人工复核分歧）。
- 用于课程：m4-l1、m4-l3、m4-l4、m4-l5、m4-l6

### 3. RAG vs 微调 vs 提示

- 检索词：`RAG vs fine-tuning vs prompting decision framework when to use what product manager`
- 可信度：**A**（"先提示→知识缺口用 RAG→行为缺口才微调"是业界广泛共识）
- 用到的结论：三级阶梯决策顺序、"RAG 改知道什么 / 微调改默认怎么表现"、微调灌事实会加重幻觉、>20 万次/月时微调小模型降本、RAG 的运维与检索失败风险。
- 用于课程：m1-l2、m1-l3

### 4. Agent 机制（ReAct / Function Calling / MCP / Context Engineering）

- 检索词：`Agent loop ReAct tool use function calling MCP context engineering explained product manager`
- 可信度：**A**（机制定义明确，属公开技术共识）
- 用到的结论：ReAct = Thought→Action→Observation；Function Calling 由应用层执行、权限在应用层；MCP 用统一协议解耦工具（stdio/HTTP、JSON-RPC）；Context Engineering 防 token 膨胀；迭代上限防死循环。
- 用于课程：m1-l4、m1-l5、m7-l3

### 5. 模型选型与推理经济学

- 检索词：`LLM model selection cost latency accuracy tradeoff context window pricing per million tokens comparison 2026`
- 可信度：**C**（具体价格与模型名随时变动，**课程中一律使用合成的价格表，不引用真实公司当前价格**）
- 用到的结论：按每百万 token 计价、输出通常是输入 2–10 倍、长上下文溢价、缓存约 90% 折扣、批处理约 50% 折扣、算"每答案成本"含重试与工具调用、模型路由分层。
- 用于课程：m2-l1、m2-l2、m2-l4

### 6. Prompt 版本化管理

- 检索词：`prompt versioning few-shot systematic prompt management evaluation regression AI product`
- 可信度：**B**
- 用到的结论：prompt 当代码资产（版本 ID/改动原因/关联模型/评测结果）、评测闸门防静默回归、few-shot 是 prompt 的一部分需一并版本化、历史回测与版本对比。
- 用于课程：m3-l2、m3-l3

### 7. A/B 测试样本量

- 检索词：`A/B test sample size calculation formula proportion z-test significance AI product experimentation`
- 可信度：**A**（统计公式是标准的）
- 用到的结论：p0 / MDE / α=0.05（z≈1.96）/ 功效 0.8（z≈0.842）、样本量公式、需 ÷ 日流量并覆盖整周。
- 用于课程：m6-l4（code 练习）

### 8. Cohen's kappa

- 检索词：`Cohen's kappa inter-rater agreement human vs LLM judge calibration threshold interpretation`
- 可信度：**A**（公式与判读带是统计标准）
- 用到的结论：κ=(po−pe)/(1−pe)；0.6 可接受 / 0.8 强；先验人工之间 κ；≥300 条/ rubric 才有统计意义；裸一致率会因类别不平衡骗人；定期重校准。
- 用于课程：m4-l4（code 练习）

### 9. AI PM 作品集

- 检索词：`AI PM portfolio case study structure problem method evidence result hired`
- 可信度：**B**
- 用到的结论：四段式（问题—方法—证据—结果）、作品集是"决策记录"而非作品陈列、高价值信号（界定模糊问题 / 懂模型行为 / 交付真实产物）、诚实报告失败与迭代、Loom 演示。
- 用于课程：m8-l1、m8-l2

### 10. PRD 结构

- 检索词：`PRD template AI product requirements document sections acceptance criteria 2026`
- 可信度：**B**
- 用到的结论：PRD 十二要素、AI 专属需求（自主度、输入输出与数据源、护栏、失败模式与兜底、人工升级）、验收标准 ≠ 成功指标、AI 验收需 eval 数据集+阈值、要论证"为什么必须用 AI"。
- 用于课程：m5-l1 ~ m5-l5

### 11. RICE / 优先级 / HITL / prompt injection

- 检索词：`RICE prioritization framework roadmap AI features guardrails human in the loop prompt injection product requirements`
- 可信度：**B**
- 用到的结论：RICE=(R×I×C)/E、AI 特征额外过安全/HITL/prompt injection 关、HITL 三种闸（规则闸/风险闸/抽检）。
- 用于课程：m6-l3、m7-l3

---

## 写作纪律（引用这些材料时）

1. **不引用真实公司的当前定价、真实招聘要求、真实内部工具名**——课程里凡是数字都标"示例/合成"。
2. 数字阈值（200–500 条、85–90%、κ≥0.6、>20 万次/月）在课程里一律写成"常见取值/经验区间"，并说明会随场景变化。
3. 所有案例用 TripGenie（Elena 自己的项目）或虚构通用场景，不影射真实公司内部。
4. 统计公式必须自己在 Pyodide 里算过、验证过再写进练习的 `checkCode`。
