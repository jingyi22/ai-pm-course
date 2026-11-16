COURSE_MODULES.push({
  id: "m6",
  title: "Roadmap、指标与实验",
  icon: "🗺️",
  lessons: [
    {
      id: "m6-l1",
      title: "AI 产品的指标体系与北极星指标",
      type: "learn",
      learnHtml: `
        <h3>为什么不能拿「模型准确率」当北极星</h3>
        <p>模型准确率是<strong>模型指标</strong>，不是<strong>产品指标</strong>。一个准确率 95% 但用户根本不用、或者每次要等 10 秒的功能，商业上是失败的。AI PM 要把「模型好不好」翻译成「产品有没有创造价值」。</p>
        <h3>AI 产品的指标分层</h3>
        <div class="code-block">业务层：收入、成本节省、效率提升
采纳层：DAU/MAU、激活率、功能使用率
任务层：任务完成率、自动化率（无需人工介入的比例）
AI 质量层：正确率、幻觉率、拒答准确率
安全层：违规输出率、投诉率、越权调用次数
系统层：延迟（p95）、可用性、错误率
经济层：每任务 token 消耗、每次交互成本</div>
        <p>分层的好处：<strong>出问题时能定位到是哪一层坏了</strong>。整体指标掉了，是采纳低了、质量差了、还是延迟高了？看分层就知道。</p>
        <h3>北极星指标（North Star）怎么选</h3>
        <p>好的 AI 产品北极星要同时体现两件事：<strong>AI 有效时用户获得的价值</strong>，以及<strong>AI 失效时带来的成本</strong>。</p>
        <ul>
          <li>Copilot 类：<strong>借助 AI 完成任务的用户数</strong>（不是"调用次数"——调用了但没用上不算价值）</li>
          <li>客服自动化类：<strong>无需人工升级即解决的工单占比</strong>（既含"解决了"，也含"没甩给人"）</li>
          <li>工作流类：<strong>用户每周节省的时间</strong></li>
        </ul>
        <div class="callout callout-warn">
          <span class="callout-title">⚠️ 反例</span>
          「AI 调用量」不是北极星——刷次数很容易，不代表价值。「模型准确率」也不是——它是输入不是产出。北极星必须是<strong>用户/业务视角的最终价值</strong>。
        </div>
      `,
      practice: {
        prompt: "案例判断：某 AI 客服产品的团队把「AI 自动回复的条数」定为北极星指标。上线后回复条数暴涨，但人工客服的工作量没有下降，用户投诉还上升了。请判断这个北极星指标的问题。",
        noExec: true,
        codeToRead: `北极星指标：「AI 自动回复的条数」
现象：回复条数暴涨
     人工客服工作量没降
     用户投诉上升`,
        choiceQuestion: "这个北极星指标的核心问题是什么？",
        choices: [
          "指标数值太低，应该想办法再冲高",
          "它衡量的是「AI 输出了多少」而不是「用户的问题有没有被解决」——AI 回得越多但如果答不到点上，用户还是要找人工、还会投诉。应改为「无需人工升级即解决的工单占比」这类包含「解决了」的指标",
          "应该把指标改成「模型准确率」",
          "应该统计 AI 回复的平均字数",
        ],
        answerIndex: 1,
        explain: "「回复条数」是容易刷的产出量，不是价值。「人工工作量没降 + 投诉上升」证明 AI 输出没转化为解决。北极星应含「解决」语义，比如无需升级即解决的占比，并配套人工工作量、投诉率作为护栏指标。",
      },
    },

    {
      id: "m6-l2",
      title: "漏斗与 activation：第一次用上 AI 价值",
      type: "learn",
      learnHtml: `
        <h3>activation 不是「注册」也不是「点了按钮」</h3>
        <p><strong>Activation（激活）</strong>指的是用户<strong>第一次真正用上产品核心价值</strong>的那一刻。对 AI 产品，它通常是「第一次成功完成一个任务且结果被用户接受」。</p>
        <h3>为什么 AI 产品的 activation 特别关键</h3>
        <p>AI 产品的价值是「体验后才能感知」的。如果第一次体验就失败、慢、或者答得离谱，用户不会给第二次机会。<strong>AI 产品的漏斗在第一次就死掉的比例非常高</strong>。</p>
        <h3>一个 AI 助手的三级漏斗（示例）</h3>
        <div class="code-block">① 触达：打开含 AI 的入口          100%
   ↓
② 首次交互：发出第一个问题          68%
   ↓
③ 价值达成：收到一个被接受的回答     41%   ← activation
   ↓
④ 复用：7 天内再次使用               23%</div>
        <p>每一层掉了多少、为什么掉，就是产品要解决的事。比如 ②→③ 掉得多，往往是<strong>第一次回答质量不够</strong>——这时该去修 prompt / 检索，而不是做拉新。</p>
        <h3>怎么定义「被接受的回答」</h3>
        <p>要具体：比如"回答了之后 60 秒内没有再次追问同一问题""没有点踩""复制了答案内容""点击了推荐下一步"。</p>
        <div class="callout callout-tip">
          <span class="callout-title">💡 记住这个判断</span>
          漏斗的<strong>最大流失环节 = 当前最该投入的地方</strong>。很多团队一上来就做增长，但如果是 ②→③ 塌方，拉来的人只会更快流失。
        </div>
      `,
      practice: {
        prompt: "案例判断：某 AI 旅行助手的漏斗为：打开入口 100% → 首次提问 70% → 得到被接受的回答 38% → 7 天复用 30%。团队目前的资源准备全部投在「拉新/买量」上。请判断这个决策是否合理。",
        noExec: true,
        codeToRead: `漏斗：
打开入口      100%
首次提问       70%
被接受的回答   38%   ← 最大流失（70% → 38%，掉了 32 个点）
7 天复用       30%`,
        choiceQuestion: "把资源全投在拉新上是否合理？",
        choices: [
          "合理，用户越多越好",
          "不合理：最大流失发生在「首次提问 → 被接受的回答」这一层，说明首次回答质量/体验是瓶颈；此时买量只会让更多人快速流失。应优先提升首次体验（prompt/检索/延迟），把漏斗修好再拉新",
          "合理，因为 7 天复用率已经 30%，很高了",
          "应该先把指标改成「打开入口」",
        ],
        answerIndex: 1,
        explain: "漏斗分析的第一原则是「先修最大的漏」。首次提问到被接受掉了 32 个点，是明显瓶颈。在体验没修好前放大流量，会让获客成本白花。先做体验优化（本质是提升 activation），再谈增长。",
      },
    },

    {
      id: "m6-l3",
      title: "RICE 优先级与 AI 的额外关卡",
      type: "learn",
      learnHtml: `
        <h3>RICE：把"该先做哪个"变成可讨论的数</h3>
        <div class="code-block">RICE = (Reach × Impact × Confidence) / Effort

Reach      触及用户数（一段时间内多少人受影响）
Impact     对每个用户的影响强度（常用 0.25 / 0.5 / 1 / 2 / 3）
Confidence 对 Reach 和 Impact 估计的把握（常用 100% / 80% / 50%）
Effort     总投入（人月）</div>
        <p>RICE 的价值不是"算出一个绝对正确的排序"，而是<strong>逼迫团队把假设摊开</strong>：凭什么说影响是 2 不是 1？凭什么是 3 个人月？争论从"我觉得"变成"这个假设成不成立"。</p>
        <h3>AI 功能要额外过三关</h3>
        <p>算完 RICE 不代表就能排进 Roadmap。AI 功能还要额外考虑：</p>
        <ul>
          <li><strong>安全与合规关</strong>：这个功能会不会输出违规内容、泄露隐私？合规上允许吗？</li>
          <li><strong>HITL（人类在环）关</strong>：哪些操作必须人确认？需要新增人工审核成本吗？</li>
          <li><strong>prompt injection / 越权关</strong>：用户能通过输入诱导它做不该做的事吗？工具权限边界清楚吗？</li>
        </ul>
        <p>一个 RICE 很高但过不了这三关的功能，不能上。<strong>反过来，过不了关的功能要写进 Roadmap 的"阻塞项"，说明卡在哪、需要先解决什么。</strong></p>
        <h3>Roadmap 要写清的两件事</h3>
        <ol>
          <li><strong>排序理由</strong>：为什么 A 先于 B？（价值 × 成本 × 风险）</li>
          <li><strong>依赖关系</strong>：B 依赖 A 的什么？哪些事必须先后？</li>
        </ol>
        <div class="callout callout-exam">
          <span class="callout-title">📝 面试会追问</span>
          「为什么这个先做、那个后做？」——回答时把 RICE 的三要素和你判断的风险/依赖讲出来，而不是"因为我觉得这个更重要"。
        </div>
      `,
      practice: {
        type: "writing",
        prompt: "写作练习：给你自己了解的一个 AI 产品（TripGenie 或任选），列出<strong>6 个候选功能</strong>，用 RICE 给每个打分（写出 Reach/Impact/Confidence/Effort 的具体值），算出分数，然后排一版季度 Roadmap。并写清：① 为什么这个顺序；② 每个功能是否需要过安全/HITL/injection 关、卡在哪；③ 主要依赖关系。",
        hint: "RICE 的数字不必精确，重点是假设要写出来（为什么 Impact 给 2 而不是 1）。排序理由和依赖关系比分数本身更重要——面试官看的是判断力。",
        checklist: [
          {item: "列出了 6 个候选功能"},
          {item: "每个功能都算了 RICE 分（四要素都写了具体值）", hint: "Reach/Impact/Confidence/Effort"},
          {item: "对 Impact 或 Effort 的估计给出了理由", hint: "为什么是 2 不是 1"},
          {item: "给出了最终排序"},
          {item: "写了排序理由（价值×成本×风险）", hint: "不是「我觉得」"},
          {item: "指出至少一个功能的 AI 额外关卡（安全/HITL/injection）", hint: "以及它卡在哪"},
          {item: "写了功能之间的依赖关系", hint: "哪个必须先做"},
          {item: "覆盖了一个季度的时间安排", hint: "大致分到 1~3 个月"},
        ],
        modelAnswer: `【季度 Roadmap 示例】（示例，不要照抄）

候选功能与 RICE：
| 功能 | Reach | Impact | Confidence | Effort | RICE |
|------|-------|--------|-----------|--------|------|
| A 行程草稿生成 | 40000 | 2 | 80% | 3 | 21333 |
| B 实时改签助手 | 12000 | 3 | 60% | 4 | 5400 |
| C 多语言支持 | 8000 | 1 | 90% | 2 | 3600 |
| D 语音输入 | 15000 | 0.5 | 80% | 2 | 3000 |
| E 智能报销归类 | 3000 | 2 | 50% | 3 | 1000 |
| F 情绪安抚话术优化 | 25000 | 0.5 | 90% | 1 | 11250 |

排序（Q1）：
1. A 行程草稿生成（RICE 最高，且是留存核心；Impact=2 理由：直接决定新用户首次价值达成）
2. F 情绪安抚话术优化（高 Reach 低成本，Effort=1 只改 prompt + 评测；先做快速收益）
3. D 语音输入（中等，Effort=2）
→ Q2 再看 B（实时改签）：Impact=3（高风险高价值），但卡在 HITL 关——改签涉及金额与不可逆操作，必须先做「用户确认 + 大额人工审核」的交互与权限设计，且需注入防护（用户可能诱导直接改签）。依赖：B 依赖 A 的对话编排框架。
→ E 智能报销：Confidence 仅 50%（不确定财务数据可得），暂缓。

AI 额外关卡：
- B 实时改签：HITL 必须（Level 2）；工具权限最小化；prompt injection 测试必做
- A 行程生成：输出护栏（不编造营业时间）；失败兜底
- F 话术优化：需防止"过度安抚"掩盖真实问题，评测里加「是否如实说明限制」维度

依赖关系：
- B 依赖 A 的对话编排框架
- F 依赖现有评测集扩容（情绪类样本）

为什么这个顺序：先修首次体验（A）和低成本快赢（F），把漏斗转化提上来；高风险高价值的 B 先做设计准备、Q2 再上；Confidence 低或依赖未满足的往后放。

【好答案的特征】
- RICE 四要素都有具体值和理由（不是随便填）
- 排序理由基于价值×成本×风险，不是感觉
- 识别出 AI 额外关卡（HITL / injection）并说明阻塞
- 有依赖关系</br>`,
      },
    },

        {
      id: "m6-l4",
      title: "A/B 实验设计：样本量与显著性",
      type: "learn",
      learnHtml: `
        <h3>为什么 AI 产品的 A/B 测试更需要注意样本量</h3>
        <p>AI 产品的效果往往"看起来在动"——分数波动、用户行为噪声大。样本量不够，你会把随机波动当成显著变化，做出错误决策。</p>
        <h3>决定样本量的四个输入</h3>
        <ul>
          <li><strong>基线 p0</strong>：现状的转化率/成功率。必须用真实近期数据。</li>
          <li><strong>MDE（最小可检测效应）</strong>：你希望检测到的最小变化。想检测的变化越小，需要的样本越多（平方级增长）。</li>
          <li><strong>显著性 α</strong>：常用 0.05（双侧 z≈1.96）——容忍 5% 的假阳性。</li>
          <li><strong>功效 1−β</strong>：常用 0.8（z≈0.842）——有 80% 把握检测到真实效应。</li>
        </ul>
        <h3>每组样本量（两组比例比较的常用近似）</h3>
        <div class="code-block">n = (z_α/2 + z_β)² × [p1(1−p1) + p2(1−p2)] / (p1 − p2)²

其中 p1 = p0，p2 = p0 + MDE
z_α/2 ≈ 1.96（α=0.05 双侧）
z_β   ≈ 0.842（功效 0.8）</div>
        <h3>从"需要多少样本"到"要跑几天"</h3>
        <div class="code-block">最少实验天数 = 每组所需样本量 ÷ 每日流量（每组）
并且：至少覆盖完整的一周（防止周内效应——工作日和周末的用户不一样）</div>
        <div class="callout callout-warn">
          <span class="callout-title">⚠️ 两个常见错误</span>
          ① <strong>提前偷看结果</strong>：看到显著就停，会大幅提高假阳性率（"peeking"问题）。要事先定好样本量和停止条件。<br>
          ② <strong>同时测多个指标却不校正</strong>：测的指标越多，碰巧显著的概率越高。
        </div>
        <p>下面的量化练习，你算一次真实场景的样本量与天数。</p>
      `,
      practice: {
        prompt: "量化练习：某功能基线转化率 <code>p0 = 0.042</code>（4.2%），你想检测 <code>MDE = 0.004</code>（即提升到 0.046）的绝对提升。每日流量每组 <code>daily = 13000</code>。请计算：<code>n_per_group</code>（每组所需样本量，向上取整）、<code>days_needed</code>（最少实验天数，向上取整），存入变量并打印。",
        setupCode: `p0 = 0.042
mde = 0.004
p1 = p0
p2 = p0 + mde
daily = 13000
z_a = 1.96      # alpha=0.05 双侧
z_b = 0.842     # power=0.8`,
        starterCode: `import math

# TODO: 按公式计算每组样本量
n_per_group = None
# 提示: ((z_a+z_b)**2) * (p1*(1-p1) + p2*(1-p2)) / ((p2-p1)**2)

# TODO: 向上取整
n_per_group = None

# TODO: 计算实验天数（向上取整）
days_needed = None

print(f"每组需要样本: {n_per_group}")
print(f"最少需要天数: {days_needed}")`,
        referenceCode: `import math

n_per_group = ((z_a + z_b) ** 2) * (p1*(1-p1) + p2*(1-p2)) / ((p2 - p1) ** 2)
n_per_group = math.ceil(n_per_group)
days_needed = math.ceil(n_per_group / daily)

print(f"每组需要样本: {n_per_group}")
print(f"最少需要天数: {days_needed}")`,
        checkCode: `
try:
    import math
    expected_n = ((1.96 + 0.842) ** 2) * (0.042*0.958 + 0.046*0.954) / ((0.046-0.042)**2)
    expected_n_ceil = math.ceil(expected_n)
    expected_days = math.ceil(expected_n_ceil / 13000)
    assert n_per_group is not None, "n_per_group 还是 None"
    assert abs(n_per_group - expected_n_ceil) < 1e-9, f"n_per_group 不对，期望向上取整后 {expected_n_ceil}（原始 {expected_n:.1f}）"
    assert days_needed is not None, "days_needed 还是 None"
    assert abs(days_needed - expected_days) < 1e-9, f"days_needed 不对，期望 {expected_days}"
    __CHECK_RESULT__ = {"passed": True, "message": f"正确！每组约需 {expected_n_ceil:,} 个样本，约 {expected_days} 天。注意：MDE 只有 0.4 个百分点，样本量却要这么多——想检测更小的变化，样本量会指数级上升。这也是为什么很多团队只能把实验目标定在「能检测到有意义的最小变化」上。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m6-l5",
      title: "PMF 验证与 kill/scale 标准",
      type: "learn",
      learnHtml: `
        <h3>PMF 不是"用户说喜欢"，是行为证据</h3>
        <p><strong>PMF（Product-Market Fit，产品市场契合）</strong>的标志是：用户不仅用，而且<strong>离了就难受</strong>。验证信号通常是：</p>
        <ul>
          <li><strong>留存</strong>：次周/次月还在用的人有多少</li>
          <li><strong>主动复用</strong>：不用提醒也会回来用</li>
          <li><strong>推荐意愿</strong>：愿意推荐给同事/朋友</li>
          <li><strong>付费意愿</strong>：愿意付钱或愿意为公司内部推广出力</li>
        </ul>
        <h3>kill/scale 标准：事先写下来</h3>
        <p>最贵的错误不是"做错了"，而是"做错了但舍不得停"。所以要在<strong>开始前</strong>就写下：</p>
        <div class="code-block">Scale（加码）信号：
  4 周留存 ≥ X%；主动复用 ≥ Y%；NPS ≥ Z
Kill/转向（停）信号：
  跑满 8 周，留存仍 < X'；或获客成本 > 单用户价值
观察窗口：必须在同一时间窗下比较（别拿"第一周"和"第八周"比）</div>
        <h3>为什么 AI 产品特别需要 kill 标准</h3>
        <p>AI 功能很容易陷入「一直调、一直觉得快好了」的状态——因为总有个别例子看起来有改进。没有 kill 标准，就会无限烧资源。<strong>事先设好止损线，是把"沉没成本"关在门外。</strong></p>
        <div class="callout callout-exam">
          <span class="callout-title">📝 面试加分</span>
          被问「你怎么判断一个 AI 功能该不该继续投」时，答"我有事先定义的 kill/scale 标准和观察窗口"比"看用户反馈"专业得多。
        </div>
      `,
      practice: {
        prompt: "案例判断：某团队做了一个 AI 报销分类功能，跑了 10 周，复用率一直停在 12%（团队事先定的 scale 线是 25%、kill 线是 15%）。团队负责人说『再给我们两个月，模型准确率还能再提 5 个点』。请判断最合理的建议。",
        noExec: true,
        codeToRead: `已跑：10 周（观察窗口已远超原定 8 周）
复用率：12%（持平）
预设：scale 线 25%，kill 线 15%
负责人：再给两个月，模型准确率还能提 5 个点`,
        choiceQuestion: "最合理的建议是什么？",
        choices: [
          "同意，再给两个月，准确率提升后复用率自然会上去",
          "应执行事先定好的 kill 标准：已超过观察窗口且复用率低于 kill 线，说明「准确率」不是瓶颈（否则准确率提升应该带动复用）；应先诊断真正原因（是否用户根本不需要这个分类？体验太慢？），而不是继续投入调模型",
          "把 kill 线改成 10%，这样就算达标了",
          "立刻全量推广，看看能不能靠量带动",
        ],
        answerIndex: 1,
        explain: "kill 标准的意义就在于「到了就该停」。已经跑超观察窗口、复用率低于止损线，继续投模型是典型的沉没成本陷阱——而且准确率提 5 个点很可能不是瓶颈。正确做法是执行 kill 决策并做归因（需求是不是真的存在？），或转向/收敛范围。随意下调标准是自欺欺人。",
      },
    },

    {
      id: "m6-quiz",
      title: "模块小测",
      type: "quiz",
      quiz: {
        questions: [
          {
            q: "为什么「模型准确率」不适合当 AI 产品的北极星指标？",
            options: [
              "因为准确率太难测",
              "它是模型层的输入指标，不是用户/业务视角的最终价值；高准确率不等于用户获得价值",
              "因为准确率总是很低",
              "因为准确率不能量化",
            ],
            answerIndex: 1,
            explain: "北极星必须是用户/业务视角的最终价值。模型指标只是实现手段，不能直接当北极星。",
          },
          {
            q: "AI 产品漏斗里，如果「首次提问 → 被接受的回答」这一层流失最大，最该优先做什么？",
            options: [
              "加大拉新投入",
              "优先修首次体验（prompt/检索/延迟/兜底），提高 activation，再谈增长",
              "把指标改成「打开入口」",
              "减少功能",
            ],
            answerIndex: 1,
            explain: "先修漏斗最大的漏洞。体验没修好前放大流量只会让更多用户快速流失。",
          },
          {
            q: "RICE 里的 Confidence 指的是什么？",
            options: [
              "对模型输出准确率的信心",
              "对 Reach 和 Impact 估计值的把握程度",
              "用户对产品的信任度",
              "团队对技术方案的信心",
            ],
            answerIndex: 1,
            explain: "RICE 的 Confidence 是对前两项估计的确定性，常见取 100%/80%/50%。",
          },
          {
            q: "想让 A/B 测试能检测到更小的变化（更小的 MDE），会发生什么？",
            options: [
              "需要的样本量减少",
              "需要的样本量大幅增加（近似与 MDE 的平方成反比）",
              "样本量不变",
              "不再需要基线数据",
            ],
            answerIndex: 1,
            explain: "检测更小的效应需要更多样本，MDE 减半，样本量大约增至四倍。这是实验设计的核心权衡。",
          },
          {
            q: "为什么 AI 功能尤其需要事先定义 kill 标准？",
            options: [
              "为了让团队显得专业",
              "因为 AI 功能容易陷入「总觉得快调好了」的无限投入，事先设止损线能避免沉没成本陷阱",
              "因为 AI 功能一定失败",
              "kill 标准是给老板看的",
            ],
            answerIndex: 1,
            explain: "AI 的改进空间永远存在，容易无限投入。事先的 kill/scale 标准是防止沉没成本的纪律。",
          },
        ],
      },
    },
  ],
});
