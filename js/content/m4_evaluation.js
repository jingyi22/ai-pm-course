COURSE_MODULES.push({
  id: "m4",
  title: "评测体系设计",
  icon: "📏",
  lessons: [
    {
      id: "m4-l1",
      title: "为什么 AI 产品必须建评测",
      type: "learn",
      learnHtml: `
        <h3>确定性产品怎么验收，AI 产品为什么不行</h3>
        <p>传统软件：点「提交」→ 订单进数据库 → 验收标准是「订单出现了」——<strong>确定性、可复现、pass/fail 明确</strong>。</p>
        <p>AI 功能：问「东京三天怎么玩」→ 生成一段行程——追问「对不对」，就麻烦了：<strong>同一个问题问两次可能给两个不同的行程，两个可能都还行，也可能一个漏了预算一个编了营业时间</strong>。</p>
        <div class="callout callout-exam">
          <span class="callout-title">📝 一句话</span>
          AI 产品的验收不能是「跑一次看看」，必须是「<strong>一批有代表性的输入 × 一套明确的评分标准 × 一个阈值</strong>」。这三件事合起来就叫<strong>评测（Evaluation, Eval）</strong>。
        </div>
        <h3>没有评测会发生什么</h3>
        <ul>
          <li><strong>改一个 prompt 不知道是好是坏</strong>：只能靠"我试了几条感觉还行"。</li>
          <li><strong>静默回归</strong>：修好 A 问题，B 问题冒出来，但没人发现，直到用户投诉。</li>
          <li><strong>换代/换模型没有依据</strong>：想升级模型，凭什么说新的更好？</li>
          <li><strong>面试也过不了</strong>：AI PM 面试必问「你怎么评估你的 AI 功能好不好」，答不出来就直接出局。</li>
        </ul>
        <h3>AI PM 在评测里扮演什么角色</h3>
        <p>评测不是纯工程活。PM 要定义：<strong>评什么（维度）、什么叫好（rubric）、用哪些样本（数据集）、多少分算能上线（阈值）</strong>。算法同事负责把评测跑起来，但你决定"好是什么样"。</p>
        <div class="callout callout-tip">
          <span class="callout-title">💡 本模块路线</span>
          这一模块是全课最重要的部分之一。你会依次学：写 rubric（评分标准）→ 建 golden set（评测集）→ 用 LLM 当裁判并校准（kappa 实操）→ 排查"离线好线上差" → 把 BadCase 沉淀成回归集。
        </div>
      `,
      practice: {
        prompt: "案例判断：某 AI 摘要功能，产品经理说「上线前我看了大概二十条生成的摘要，都挺通顺的，可以上线了」。请判断这个验收方式的问题。",
        noExec: true,
        codeToRead: `验收方式：
- 人工看约 20 条输出
- 判断标准：「通顺」
- 结论：可以上线`,
        choiceQuestion: "这个验收方式最主要的问题是什么？",
        choices: [
          "没有问题，20 条已经不少了",
          "问题有三：样本少且可能不具代表性（没有覆盖边界与失败模式）；标准「通顺」不等于「准确/有用」（一段流畅但编造事实的摘要也是通顺的）；没有量化和阈值，无法对比版本、无法防回归",
          "问题只是没有用英文样本",
          "问题在于应该用更大的模型重新生成",
        ],
        answerIndex: 1,
        explain: "这是最典型的「靠感觉验收」。三个缺口：① 样本代表性与规模不足；② 只评了「通顺」这一个易得但不关键的维度，漏了准确性/事实一致性；③ 没有分数和阈值，既不能横向比版本，也不能防静默回归。",
      },
    },

    {
      id: "m4-l2",
      title: "rubric：把「好」拆成可打分的档位",
      type: "learn",
      learnHtml: `
        <h3>rubric 是什么</h3>
        <p><strong>rubric（评分细则）</strong>是分维度、分档位、每档都有明确定义和示例的评分标准。它让"这个回答好不好"从主观直觉变成可重复的判断。</p>
        <h3>一个可用的四维 rubric（课程默认框架）</h3>
        <div class="code-block">维度 1：准确性（Accuracy）
  3 分：事实全对，依据充分
  2 分：主体正确，细节有轻微偏差
  1 分：有明显错误或编造
  0 分：完全错误 / 答非所问

维度 2：相关性（Relevance）
  3 分：直接回答了用户真正想问的
  2 分：回答了问题但夹带无关内容
  1 分：答偏了
  0 分：完全无关

维度 3：信任度（Trust）
  3 分：标注来源/不确定处明确说明，不装懂
  2 分：基本可信，但有一处不透明的断言
  1 分：多处自信断言无法验证
  0 分：明显谎报或伪装确定

维度 4：可操作性（Actionability）
  3 分：用户能直接按它行动
  2 分：需要少量二次加工
  1 分：只是泛泛而谈
  0 分：无法据此做任何事</div>
        <h3>好 rubric 的三条标准</h3>
        <ul>
          <li><strong>可操作</strong>：换一个人来打，也大致打一样的分。只写「好/中/差」不写定义，做不到这一点。</li>
          <li><strong>有正反例</strong>：每一档最好配一个真实样例，说明"为什么这个是 2 分不是 3 分"。</li>
          <li><strong>维度正交</strong>：准确性和相关性是两件事——一个答案可能准确但不相关，也可能相关但不准确。不要混成一个"总体好不好"。</li>
        </ul>
        <div class="callout callout-warn">
          <span class="callout-title">⚠️ 最关键的一步：先让两个人都打一遍</span>
          写好的 rubric 必须先让两个人独立打同一批样本，看他们打出来的分一不一致。<strong>如果人工之间都对不齐，说明 rubric 本身含糊——这时任何自动评测都不可信。</strong>下一课会用 Cohen's kappa 量化这件事。
        </div>
      `,
      practice: {
        prompt: "案例判断：某团队给 AI 客服回答质量的 rubric 只有三档：「好、一般、差」，没有任何定义和示例。请判断这份 rubric 能不能用。",
        noExec: true,
        codeToRead: `rubric（当前版本）：
- 好
- 一般
- 差
（无定义、无示例、无维度拆分）`,
        choiceQuestion: "这份 rubric 的主要问题是什么？",
        choices: [
          "能用，三档已经够了",
          "不能用：没有定义、没有维度拆分、没有示例，「好」和「一般」之间的边界完全靠个人理解，两个人打同一批样本会严重不一致，导致评测结果不可信、不可复现",
          "问题只是档位太少，加到十档就好了",
          "问题在于应该改成百分制",
        ],
        answerIndex: 1,
        explain: "档位数不是关键，可操作性和一致性才是。没有定义的三档 rubric，本质上是「凭感觉打标签」，人工之间都对不齐，更无法用来校准自动评测。正确做法是分维度、每档写定义和示例，先验证人工间一致性。",
      },
    },

    {
      id: "m4-l3",
      title: "golden set：评测集怎么建",
      type: "learn",
      learnHtml: `
        <h3>什么是 golden set</h3>
        <p><strong>golden set（黄金评测集）</strong>是一批精心挑选的样本，每条都有可信的"标准答案"或明确的评分依据，作为衡量模型表现的固定标尺。</p>
        <h3>样本从哪来</h3>
        <ul>
          <li><strong>真实用户使用</strong>：最宝贵。尤其是负反馈、投诉、用户点踩的 BadCase——这是产品真正会遇到的。</li>
          <li><strong>边界样例</strong>：超长输入、空输入、多语言混输、含错别字的输入。</li>
          <li><strong>对抗样例</strong>：故意刁钻的问法、诱导性提问、prompt injection 尝试（见模块 7）。</li>
        </ul>
        <h3>规模与分布</h3>
        <p>经验起点通常是 <strong>200~500 条</strong>（高风险决策场景可以更多），关键不是绝对数量，而是<strong>分布要覆盖真实场景的构成</strong>：常见问题占大头，但难例、边界、对抗样本必须有。</p>
        <h3>纪律：像代码一样版本化</h3>
        <div class="callout callout-warn">
          <span class="callout-title">⚠️ 为什么必须版本化</span>
          如果评测集悄悄变了，分数就没法比——<strong>测试集换了，模型分数变化可能根本不是模型变好或变坏，而是题目变了</strong>。后果是：你以为模型退步了，去回滚一个其实更好的版本；或者以为进步了，其实只是题目变简单了。<br><br>
          所以：每次增删改样本都要有记录、有版本号，改动要有理由。
        </div>
        <h3>一条样本长什么样</h3>
        <div class="code-block">{
  "id": "eval-0042",
  "input": "帮我查下明天从上海到东京的航班，预算 3000 以内",
  "context": "（订单/用户信息，或 RAG 检索到的片段）",
  "expected": "应列出可选航班、标注价格是否在预算内、不编造不存在航班",
  "rubric_scores": {"accuracy": 3, "relevance": 3, "trust": 3, "actionability": 2},
  "source": "真实用户日志 2026-03-12",
  "tags": ["航班查询", "预算约束", "常见"]
}</div>
        <p>注意 <code>source</code> 和 <code>tags</code>：前者说明它从哪来（可追溯），后者让你能按类别看评测结果（"航班查询类全挂了"比"整体掉了 3 分"有用得多）。</p>
      `,
      practice: {
        prompt: "案例判断：某团队建了 300 条评测集，全部是从「产品刚上线时最典型的 20 个问题」复制扩写出来的。上线三个月后，模型在评测集上分数很高，但用户投诉越来越多。请判断最可能的原因。",
        noExec: true,
        codeToRead: `评测集构成：
- 300 条样本
- 全部来自上线初期的 20 个典型问题（复制扩写）
- 不包含负反馈、边界、对抗样本
现象：评测分高，但用户投诉增长`,
        choiceQuestion: "最可能的原因是什么？",
        choices: [
          "用户太挑剔了，评测集是对的",
          "评测集不具代表性：它只覆盖了上线初期的简单常见问题，没有吸收真实使用中出现的负反馈、边界、新类型问题，导致「在评测集上很好、在真实世界很差」——评测集必须持续从真实使用（尤其 BadCase）中更新",
          "应该把评测集扩到 3000 条",
          "应该把所有样本都换成英文",
        ],
        answerIndex: 1,
        explain: "把同 20 个问题的复制扩写当评测集，是典型的「内部循环自嗨」：样本分布严重偏离真实使用。规模从 300 扩到 3000 也没用，因为扩张的是同一类错误样本。正解是从真实日志和负反馈中持续补充新样本、边界与难例。",
      },
    },

    {
      id: "m4-l4",
      title: "LLM-as-Judge 与 Cohen's kappa 校准",
      type: "learn",
      learnHtml: `
        <h3>为什么要用 LLM 当裁判</h3>
        <p>人工打分准，但慢、贵，没法每次上线都全量评。所以有了 <strong>LLM-as-Judge</strong>：用一个强模型按你的 rubric 给另一个模型的输出打分。快、便宜、可规模化。</p>
        <h3>三类已知偏差（必须防）</h3>
        <ul>
          <li><strong>长度偏差</strong>：偏爱更长的答案（哪怕长的只是啰嗦）。</li>
          <li><strong>位置偏差</strong>：做 A/B 成对比较时，偏爱排在前面的那个。→ 对策：随机打乱顺序，或两种顺序各评一次取平均。</li>
          <li><strong>同族偏差</strong>：偏爱和自己同家族的模型输出。→ 对策：选不同家族的模型当裁判。</li>
        </ul>
        <h3>可信的前提：和人工对齐</h3>
        <p>judge 的打分必须和人工专家打分的<strong>一致性足够高</strong>（经验上常见目标是 85~90% 一致），才能拿去大规模用。而「一致性」怎么量化？用 <strong>Cohen's kappa</strong>。</p>
        <h3>Cohen's kappa 为什么比裸一致率靠谱</h3>
        <div class="code-block">κ = (po − pe) / (1 − pe)

po = 观察一致率（两个人实际打一样的比例）
pe = 随机一致率（纯靠运气也能打一样的比例）
κ  = 扣掉「碰巧一致」之后，真正的一致程度</div>
        <p>举个要命的例子：假设 95% 的样本都该是「合格」。那一个<strong>永远打「合格」</strong>的烂 judge，跟人也有一致率 95%！但它毫无判断力。<strong>裸一致率会骗人，kappa 不会</strong>——因为 pe 也是一个极高的值，一减就把水分挤掉了。</p>
        <h3>判读带（常用）</h3>
        <div class="code-block">κ ≥ 0.81  almost perfect（很强，可以放心用）
0.61 ~ 0.80  substantial（可接受）
0.41 ~ 0.60  moderate（偏低，慎用）
< 0.41       inadequate（不可用）</div>
        <h3>完整校准流程（面试高频）</h3>
        <ol>
          <li>先算<strong>两个人工之间</strong>的 κ。如果 &lt; 0.6，说明 rubric 本身含糊，回去改 rubric，别急着上 judge。</li>
          <li>算 <strong>judge vs 人工</strong> 的 κ。</li>
          <li>如果 judge 的 κ 明显低于人工之间的 κ，说明 judge 有问题（prompt 太粗？有偏差？），迭代改进。</li>
          <li>上线后<strong>定期重校准</strong>：模型、rubric、产品一变，就重跑一遍，分数掉了要报警。</li>
        </ol>
        <p>下面的量化练习，你会真的拿一份人工/裁判标签，算出 κ，并做判断。</p>
      `,
      practice: {
        prompt: "量化练习：环境里有 <code>human</code> 和 <code>judge</code> 两个标签列表（1=合格，0=不合格），共 20 条样本。请计算：<code>po</code>（观察一致率）、<code>pe</code>（随机一致率）、<code>kappa</code>，并打印。然后根据判读带回答问题。",
        setupCode: `human = [1,1,0,1,0,1,1,0,1,1,0,1,0,1,1,0,1,0,1,1]
judge = [1,1,0,1,1,1,0,0,1,1,0,1,0,1,1,0,1,1,1,1]`,
        starterCode: `n = len(human)

# TODO: 计算观察一致率 po
po = None

# TODO: 计算两个标注者各自的「判 1 的比例」，再算随机一致率 pe
# 提示：pe = p_human_1 * p_judge_1 + p_human_0 * p_judge_0
pe = None

kappa = None  # TODO: (po - pe) / (1 - pe)

print(f"po = {po:.4f}")
print(f"pe = {pe:.4f}")
print(f"kappa = {kappa:.4f}")`,
        referenceCode: `n = len(human)
po = sum(1 for h, j in zip(human, judge) if h == j) / n

p_h1 = sum(human) / n
p_j1 = sum(judge) / n
pe = p_h1 * p_j1 + (1 - p_h1) * (1 - p_j1)

kappa = (po - pe) / (1 - pe)
print(f"po = {po:.4f}")
print(f"pe = {pe:.4f}")
print(f"kappa = {kappa:.4f}")`,
        checkCode: `
try:
    n = 20
    expected_po = sum(1 for h, j in zip(human, judge) if h == j) / n
    ph1 = sum(human)/n; pj1 = sum(judge)/n
    expected_pe = ph1*pj1 + (1-ph1)*(1-pj1)
    expected_k = (expected_po - expected_pe) / (1 - expected_pe)
    assert po is not None, "po 还是 None"
    assert abs(po - expected_po) < 1e-9, f"po 不对，期望 {expected_po:.4f}"
    assert pe is not None, "pe 还是 None"
    assert abs(pe - expected_pe) < 1e-9, f"pe 不对，期望 {expected_pe:.4f}"
    assert kappa is not None, "kappa 还是 None"
    assert abs(kappa - expected_k) < 1e-9, f"kappa 不对，期望 {expected_k:.4f}"
    verdict = "可接受（substantial 区间）" if expected_k >= 0.6 else "不可用（低于 0.6）"
    __CHECK_RESULT__ = {"passed": True, "message": f"正确！po={expected_po:.3f}、pe={expected_pe:.3f}、κ={expected_k:.3f}。对照判读带：{verdict}。注意 po 有 {expected_po:.0%} 看着挺高，但 kappa 才说明真实一致度——这就是为什么不能只看裸一致率。"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m4-l5",
      title: "离线评测很好、线上却变差，怎么查",
      type: "learn",
      learnHtml: `
        <h3>AI 产品最常见的困惑</h3>
        <p>"评测集上我们 88 分，为什么一上线用户还是不满意？" 这不是玄学，通常能归到下面五种原因之一。会排查这五种，是 AI PM 的核心竞争力。</p>
        <h3>五种常见原因</h3>
        <ol>
          <li><strong>分布漂移（Distribution Shift）</strong>：线上用户的问法和评测集不一样。评测集里都是"东京三日游"，线上全是"帮我改签"和"我的行李丢了"。→ 对策：拉线上真实输入做分布对比，按真实分布补样本。</li>
          <li><strong>评测集污染 / 过拟合评测集</strong>：团队反复针对这批样本调 prompt，把评测集"背下来"了。→ 对策：留一批不参与调优的 holdout 集；定期换新样本。</li>
          <li><strong>指标与业务脱节</strong>：评测分数高 ≠ 用户满意。比如评了"通顺"却没评"有用"；答案更长（judge 的长度偏差）看起来分数高，但用户嫌啰嗦。→ 对策：指标要包含用户真正在意的维度（可操作性、信任度）。</li>
          <li><strong>体验成本被忽略</strong>：答案对了，但要等 8 秒、或每次都得复制粘贴才能用。评测只评了质量，没评延迟和可用性。→ 对策：评测里加入延迟、格式贴合度等体验维度。</li>
          <li><strong>用户行为改变（选择性适应）</strong>：上线后用户发现它能干更多事，开始问更难的问题，导致整体"成功率"下降。→ 对策：按问题难度分层看指标，而不是只看大盘。</li>
        </ol>
        <div class="callout callout-tip">
          <span class="callout-title">💡 排查顺序</span>
          先看<strong>分布</strong>（线上输入和评测集差在哪）→ 再看<strong>指标本身</strong>（评没评到点上）→ 再看<strong>体验维度</strong>（延迟、可用性）→ 最后看<strong>用户行为</strong>（是不是被引入了更难的任务）。这个顺序能覆盖 90% 的情况。
        </div>
        <div class="callout callout-exam">
          <span class="callout-title">📝 面试题</span>
          「你的 AI 功能离线评测 90 分，线上只有 60 分，你怎么查？」——用上面五条作为回答骨架，每条给一个验证方法，就能体现真正的实战经验。
        </div>
      `,
      practice: {
        prompt: "案例判断：某旅行 AI 助手离线评测 88 分，上线后用户满意度低。数据：① 线上高频问法是「改签」「行李」「签证」，而评测集 80% 是「行程规划」；② 满意度调研显示用户主要抱怨「说得很长但没法直接用」；③ 评测的四个维度里没有任何一项评「格式是否可直接复制/使用」。请判断最该先查哪两项。",
        noExec: true,
        codeToRead: `离线评测：88 分
线上：用户满意度低

线索：
① 评测集 80% 是「行程规划」，线上高频是「改签/行李/签证」
② 用户抱怨「说得很长但没法直接用」
③ 评测维度没有「格式可直接使用」这一项`,
        choiceQuestion: "最该优先查的两项是？",
        choices: [
          "换一个更大的模型；增加更多评测样本",
          "① 分布漂移：评测集和线上真实问法严重错配，应补真实高频样本；② 指标与业务脱节：评了通顺/长短，没评「可操作性/可直接使用」，应补充该维度并控制长度偏差",
          "把 temperature 调到 0；把答案缩短一半",
          "把用户满意度改成 NPS；把评测集全部换掉",
        ],
        answerIndex: 1,
        explain: "线索①对应分布漂移（评测集覆盖不到线上高频场景），线索②③对应指标与业务脱节（评了长度，没评可用性，且 judge 的长度偏差可能让长答案反而高分）。这两条是「离线好线上差」最常见的组合。",
      },
    },

    {
      id: "m4-l6",
      title: "BadCase 闭环：从负反馈到回归集",
      type: "learn",
      learnHtml: `
        <h3>BadCase 是最值钱的资产</h3>
        <p>用户投诉的每一条失败案例，都是免费告诉你的"这个产品在这个场景下会坏"。可惜大多数团队处理完当次投诉就丢了，下次换个用户再踩一遍。</p>
        <h3>闭环的四步</h3>
        <div class="code-block">① 收集：把真实负反馈、点踩、人工复核发现的问题收集起来
   ↓
② 归因：按失败类型分类（事实错误 / 检索没召回到 / 意图理解错 / 格式不符 / 政策边界）
   ↓
③ 进集：脱敏后加进回归评测集，并写清期望输出/评分依据
   ↓
④ 复跑：每次改 prompt / 换模型 / 改检索，都跑一遍回归集，确认没把老问题弄回来</div>
        <h3>维护说明也不能少</h3>
        <ul>
          <li><strong>谁负责</strong>：谁维护回归集，多久 review 一次。</li>
          <li><strong>怎么防止无限膨胀</strong>：同类 BadCase 合并成一个代表样本；过期场景要下线；设定集子总量上限。</li>
          <li><strong>怎么防止"只加不退"</strong>：定期清理已修复且不再代表真实场景的样本。</li>
        </ul>
        <div class="callout callout-exam">
          <span class="callout-title">📝 这就是你 mini-eval 作品的骨架</span>
          你 12 周计划的第三阶段要交"回归评测集 v1 + 维护说明"。这一课学会的结构，加上你自己的 TripGenie 真实负反馈，就能做出来——而且这是面试里最能打的证据之一：「我发现问题 → 归因 → 建回归集 → 量化验证修复」。
        </div>
        <h3>下面是写作练习</h3>
        <p>你会写一份回归评测集 v1 的建设方案 + 维护说明。</p>
      `,
      practice: {
        type: "writing",
        prompt: "写作练习：为你了解的一个 AI 产品场景（建议用 TripGenie 或你每周会用的某个 AI 助手），写一份<strong>回归评测集 v1 建设方案 + 维护说明</strong>。内容包括：目标、样本来源与规模、失败类型分类（归因维度）、样本字段结构、如何防止膨胀与只加不退、负责人与更新频率。",
        hint: "好的方案应体现「从真实负反馈出发」和「可持续维护」。不要只写「收集 200 条好样本」这种空话——要写清楚从哪收集、按什么分类、什么情况删掉。",
        checklist: [
          {item: "写清了回归集要解决什么问题 / 目标", hint: "防静默回归？支撑版本对比？"},
          {item: "写清了样本来源", hint: "真实负反馈、点踩、人工复核、边界、对抗样本"},
          {item: "给出了规模与分布原则", hint: "常见/难例/边界各占多少，起步规模"},
          {item: "定义了失败类型分类（归因维度）", hint: "事实错误/检索失败/意图错误/格式/政策"},
          {item: "描述了单条样本的字段结构", hint: "input / context / expected / scores / source / tags"},
          {item: "写了如何防止评测集无限膨胀", hint: "同类合并、过期下线、总量上限"},
          {item: "写了如何防止只加不退", hint: "定期清理已修复且不再代表真实的样本"},
          {item: "明确了负责人与更新频率", hint: "谁维护、多久 review 一次"},
        ],
        modelAnswer: `【回归评测集 v1 建设方案 + 维护说明】（示例，不要照抄）

一、目标
为「XX 对话助手」建立一套可复跑的回归评测集，确保每次改 prompt / 换模型 / 改检索后，不会把已修复的问题弄回来，并支撑版本间的量化对比。

二、样本来源与规模
- 来源优先级：① 线上点踩与投诉（真实负反馈）② 人工复核标记的问题 ③ 边界输入（超长、空、多语言）④ 对抗样本（诱导性提问/prompt injection）
- v1 规模：120 条（起步），目标分布：常见场景 60%、难例 25%、边界与对抗 15%
- 每条注明 source（脱敏后的来源与日期）与 tags（场景分类），便于按类看分数

三、失败类型分类（归因维度）
事实错误 / 检索未召回 / 检索召回错 / 意图理解错 / 格式不符 / 政策边界越界 / 语气不当

四、单条样本字段
{ id, input, context, expected, rubric_scores, source, tags }

五、防膨胀
- 同类 BadCase 合并为一个代表样本
- 总量上限 300 条；超限时按"是否仍代表真实场景"评审淘汰
- 过期政策/下线功能的样本移入 archived 列表而非直接删除（保留可追溯）

六、防只加不退
- 每季度 review 一次：已稳定修复且不再高频的样本标记 reviewed，仍保留但权重说明
- 新老样本并存时，按类别统计而非只看总分

七、负责人与频率
- 负责人：AI PM（定义与评审）+ 算法同事（执行与复跑）
- 每次版本变更必跑全量回归；每月新增一批线上真实样本（10~20 条）

【好答案的特征】
- 从真实负反馈出发，不是凭空造样本
- 有明确的归因维度（能分类型看问题）
- 有维护机制（防膨胀、防只加不退）
- 有负责人和时间节奏（可持续）`,
      },
    },

    {
      id: "m4-quiz",
      title: "模块小测",
      type: "quiz",
      quiz: {
        questions: [
          {
            q: "为什么 AI 产品的验收标准不能是传统的 pass/fail 用例？",
            options: [
              "因为 AI 产品更贵",
              "因为同一输入可能产生不同输出，必须用「数据集 + 评分标准 + 阈值」来定义合格，而不是单条用例",
              "因为 AI 产品没法测试",
              "因为 pass/fail 太简单",
            ],
            answerIndex: 1,
            explain: "概率性输出决定了验收必须是统计意义上的：代表性样本集 + rubric + 阈值。",
          },
          {
            q: "Cohen's kappa 相比裸一致率的优势是什么？",
            options: [
              "计算更简单",
              "它扣除了随机一致的部分，能识破「永远判同一个标签」这种高一致率但无判断力的情况",
              "它总是更高",
              "它不需要样本",
            ],
            answerIndex: 1,
            explain: "类别极度不平衡时，固执判同一类也能有很高裸一致率；kappa 用 pe 扣掉这部分水分。",
          },
          {
            q: "校准 LLM judge 的正确第一步是什么？",
            options: [
              "直接用 judge 跑全量，省时省力",
              "先算两个人工专家之间的 kappa，确认 rubric 本身不含糊；再算 judge 与人工的一致性",
              "先换一个更贵的 judge",
              "先扩大评测集到一万条",
            ],
            answerIndex: 1,
            explain: "人工之间都对不齐，说明 rubric 有问题，任何 judge 校准都无意义。必须按「人工之间 → judge vs 人工」的顺序。",
          },
          {
            q: "「离线 88 分、线上用户不满」最常见的原因组合是什么？",
            options: [
              "模型版本太旧、服务器太慢",
              "分布漂移（评测集和真实输入错配）+ 指标与业务脱节（评了易测的维度没评用户真正在意的维度）",
              "用户不会用、应该做培训",
              "评测集太大、应该缩小",
            ],
            answerIndex: 1,
            explain: "线上输入分布与评测集不一致、以及评测维度没覆盖用户真正在意的（可用性/准确性）是最常见的组合。",
          },
          {
            q: "BadCase 闭环里，「防只加不退」指的是什么？",
            options: [
              "只加新样本，不删旧样本",
              "定期清理已修复且不再代表真实场景的样本，防止回归集越滚越大、噪声越来越多",
              "每次都重新建一套评测集",
              "只保留失败的样本",
            ],
            answerIndex: 1,
            explain: "回归集只增不减会膨胀、失真。需要定期评审淘汰已不代表真实场景的样本。",
          },
        ],
      },
    },
  ],
});
