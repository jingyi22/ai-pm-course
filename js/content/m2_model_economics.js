COURSE_MODULES.push({
  id: "m2",
  title: "模型选型与推理经济学",
  icon: "💰",
  lessons: [
    {
      id: "m2-l1",
      title: "成本 / 延迟 / 准确率三角",
      type: "learn",
      learnHtml: `
        <h3>没有「最好的模型」，只有「这个场景最合适的模型」</h3>
        <p>面试里如果被问「你会选哪个模型」，直接报一个名字是错的答法。正确的答法是<strong>先问约束</strong>：这个场景对准确率、延迟、成本分别有多敏感？</p>
        <h3>三个维度互相拉扯</h3>
        <div class="code-block">准确率 ↑  →  通常更贵、更慢（要更大更复杂的模型）
速度/便宜 ↑ →  复杂推理上往往吃亏
三者很难同时最优 —— 这就是「三角」</div>
        <ul>
          <li><strong>准确率敏感</strong>：医疗辅助、金融风控、法律条文引用——错一次的代价极高，宁愿慢一点贵一点。</li>
          <li><strong>延迟敏感</strong>：实时对话、游戏、输入补全——用户等超过一两秒就走神，宁愿用小而快的模型。</li>
          <li><strong>成本敏感</strong>：高频、大批量、单个价值低的任务（批量分类、内容打标签）——单价必须压到极低。</li>
        </ul>
        <h3>实战解法：模型路由（Routing）</h3>
        <p>大多数产品不是"所有请求都用同一个模型"，而是<strong>按难度分流</strong>：</p>
        <div class="code-block">简单请求（意图识别、格式转换、简单问答）→ 便宜快的小模型
复杂请求（多步推理、长文档分析、关键决策）→ 强但贵的大模型
不确定 / 高风险 → 大模型 + 人工兜底</div>
        <p>路由本身也是产品决策：用什么规则判断"这个请求算简单还是复杂"？分错的代价是什么？这些都要 AI PM 拍板，不能全甩给工程。</p>
        <div class="callout callout-exam">
          <span class="callout-title">📝 面试答题模板</span>
          「我会先明确这个场景对准确率/延迟/成本的优先级 → 据此圈定 2~3 个候选模型 → 在真实样本上做小规模评测对比（不是看榜单）→ 用路由把不同难度的请求分给不同模型 → 上线后持续监控每条路径的成本与质量。」
        </div>
      `,
      practice: {
        prompt: "案例判断：你负责一个面向 C 端用户的旅行 AI 助手，用户量很大。有人建议『所有请求都用最强的模型，这样质量最高』。请判断这个建议的问题。",
        noExec: true,
        codeToRead: `场景：
- C 端产品，请求量巨大
- 用户大多是简单问答（"营业时间""怎么退票""附近有什么"）
- 少数是复杂请求（多城市多日规划、复杂改签）`,
        choiceQuestion: "这个建议最主要的问题是什么？",
        choices: [
          "没有问题，质量第一，成本不重要的 C 端产品就该这样",
          "问题在于成本会失控且延迟变高：绝大多数简单请求被用大模型处理是浪费，应该做路由——简单请求用小而快的模型，复杂请求才上大模型，关键/高风险请求配人工兜底",
          "问题只在于大模型不支持中文",
          "应该把所有请求都改成复杂请求",
        ],
        answerIndex: 1,
        explain: "C 端大规模场景对成本和延迟都极其敏感。全部用最强模型会让单价和等待时间都显著上升，而收益只集中在少数复杂请求上。正确做法是路由：按请求难度分流，把预算花在真正需要的地方。这也是面试里「你怎么控制 AI 产品成本」的标准答案骨架。",
      },
    },

    {
      id: "m2-l2",
      title: "算清「每答案成本」：真实换模型前的算术",
      type: "learn",
      learnHtml: `
        <h3>为什么不能只比「每 token 价格」</h3>
        <p>模型都是按 token 计价的，分<strong>输入价</strong>和<strong>输出价</strong>，单位通常是「每百万 token 多少钱」。但有三个坑：</p>
        <ul>
          <li><strong>输出比输入贵得多</strong>：通常输出价是输入价的 2~10 倍，因为输出是逐字生成的。所以"答得长"比"问得长"贵。</li>
          <li><strong>要算上重试和工具调用</strong>：一次用户请求背后可能调了好几次模型。</li>
          <li><strong>要算上上下文膨胀</strong>：RAG 塞进去的片段、agent 攒下来的历史，都会变成输入 token 一直计费。</li>
        </ul>
        <p>所以正确的指标是 <strong>cost per answer（每答案成本）</strong>：</p>
        <div class="code-block">每答案成本 ≈ (平均输入 token × 输入单价 + 平均输出 token × 输出单价)
              × (1 + 重试率)
              × 每次请求的平均模型调用次数</div>
        <h3>把它用到决策上</h3>
        <p>拿到两组参数，算出月成本，再问：<strong>换成更贵的模型，多花的钱换来了什么质量的提升？值不值？</strong>——这就是 AI PM 要做的商业判断。</p>
        <div class="callout callout-tip">
          <span class="callout-title">💡 降本四板斧（记住这个顺序）</span>
          ① prompt 缓存（重复的前缀不用重新计费，能省很多）② 批处理（对延迟不敏感的任务打包处理）③ 模型路由（简单请求走小模型）④ 微调小模型（高频固定任务）——成本压力大时才考虑最后这条（见模块 1）。
        </div>
        <p>下面这个练习，你会真的用 Python 把账算一遍。这就是「AI PM 也要会算数」的意思——不是写工程代码，是算清楚钱花在哪。</p>
      `,
      practice: {
        prompt: "量化练习：用下面的价格表和请求参数，算两个模型方案的<strong>月成本</strong>并判断。环境里已有变量 <code>prices</code>（dict 形式的每百万 token 价格）和场景参数。请计算：<code>cost_mid</code>（mid-balanced 方案的每答案成本，美元）、<code>cost_large</code>（large-reasoning 方案）、<code>monthly_mid</code>、<code>monthly_large</code>（月成本），存入对应变量后打印。",
        setupCode: `# 每百万 token 价格（美元）—— 示例数据，非真实报价
prices = {
    "mid-balanced":  {"in": 1.00, "out": 4.00},
    "large-reasoning": {"in": 5.00, "out": 20.00},
}

# 一次请求的平均 token 量
input_tokens = 1200      # 含 RAG 检索片段
output_tokens = 400
retry_rate = 0.08        # 8% 需要重试
calls_per_request = 1.3  # 平均 1.3 次模型调用
monthly_requests = 1_800_000   # 月请求量
MILLION = 1_000_000`,
        starterCode: `def cost_per_answer(model):
    p = prices[model]
    base = (input_tokens / MILLION) * p["in"] + (output_tokens / MILLION) * p["out"]
    return base * (1 + retry_rate) * calls_per_request

cost_mid = None    # TODO: cost_per_answer("mid-balanced")
cost_large = None  # TODO: cost_per_answer("large-reasoning")
monthly_mid = None    # TODO: cost_mid * monthly_requests
monthly_large = None  # TODO: cost_large * monthly_requests

print(f"mid 每答案: \${cost_mid:.6f}, 月成本: \${monthly_mid:,.0f}")
print(f"large 每答案: \${cost_large:.6f}, 月成本: \${monthly_large:,.0f}")
print(f"差距: \${monthly_large - monthly_mid:,.0f} 美元/月")`,
        referenceCode: `def cost_per_answer(model):
    p = prices[model]
    base = (input_tokens / MILLION) * p["in"] + (output_tokens / MILLION) * p["out"]
    return base * (1 + retry_rate) * calls_per_request

cost_mid = cost_per_answer("mid-balanced")
cost_large = cost_per_answer("large-reasoning")
monthly_mid = cost_mid * monthly_requests
monthly_large = cost_large * monthly_requests

print(f"mid 每答案: \${cost_mid:.6f}, 月成本: \${monthly_mid:,.0f}")
print(f"large 每答案: \${cost_large:.6f}, 月成本: \${monthly_large:,.0f}")
print(f"差距: \${monthly_large - monthly_mid:,.0f} 美元/月")`,
        checkCode: `
try:
    assert cost_mid is not None, "cost_mid 还是 None"
    expected_mid = ((1200/1_000_000)*1.00 + (400/1_000_000)*4.00) * 1.08 * 1.3
    assert abs(cost_mid - expected_mid) < 1e-9, f"cost_mid 不对，期望 {expected_mid:.8f}"
    expected_large = ((1200/1_000_000)*5.00 + (400/1_000_000)*20.00) * 1.08 * 1.3
    assert abs(cost_large - expected_large) < 1e-9, f"cost_large 不对，期望 {expected_large:.8f}"
    assert monthly_mid is not None and abs(monthly_mid - expected_mid*1_800_000) < 0.01, "monthly_mid 不对"
    assert monthly_large is not None and abs(monthly_large - expected_large*1_800_000) < 0.01, "monthly_large 不对"
    multiple = expected_large / expected_mid
    __CHECK_RESULT__ = {"passed": True, "message": f"正确！mid 每答案约 \${expected_mid:.5f}，large 约 \${expected_large:.5f}（约 {multiple:.1f} 倍）。月成本差约 \${(expected_large-expected_mid)*1_800_000:,.0f} 美元。问题来了：这多花的钱，换来的质量提升值吗？"}
except AssertionError as e:
    __CHECK_RESULT__ = {"passed": False, "message": str(e)}
except Exception as e:
    __CHECK_RESULT__ = {"passed": False, "message": "出错：" + str(e)}
`,
      },
    },

    {
      id: "m2-l3",
      title: "延迟：p50/p95/p99 与体感",
      type: "learn",
      learnHtml: `
        <h3>平均延迟会骗人</h3>
        <p>如果你只看「平均响应时间 = 1.2 秒」，可能会觉得体验不错。但如果 5% 的请求要等 8 秒，那 5% 的用户体验极差——而用户记住的往往就是那几次特别糟的。</p>
        <p>所以要看的不是平均值，是<strong>分位数</strong>：</p>
        <ul>
          <li><strong>p50</strong>（中位数）：一半的请求比这个快。代表「典型体验」。</li>
          <li><strong>p95</strong>：95% 的请求比这个快。代表「大多数用户会碰到的慢速」。产品通常盯 p95。</li>
          <li><strong>p99</strong>：99% 的请求比这个快。代表「最糟的那批」——往往是重度用户体验崩溃的地方。</li>
        </ul>
        <div class="callout callout-exam">
          <span class="callout-title">📝 一句话</span>
          平均延迟回答「一般情况多快」，p95/p99 回答「最差情况有多差」。AI 产品的体验是被尾部决定的。
        </div>
        <h3>延迟拆成两段看</h3>
        <div class="code-block">用户点击
  ↓ [首 token 时间 TTFT]  ← 用户「感觉等了多久」主要看这个
  ↓ 模型开始一个字一个字往外吐
  ↓ [总生成时间]           ← 全部答案出来要多久</div>
        <p><strong>TTFT（Time To First Token）</strong>决定了用户觉得"快不快"，总生成时间决定"整体要等多久"。两者要分开看、分开优化。</p>
        <h3>流式输出：最便宜的体感优化</h3>
        <p><strong>Streaming（流式输出）</strong>让模型边生成边显示，用户不用等全部生成完就能开始读。它<strong>不减少总时长</strong>，但大幅改善"体感延迟"——用户看到字在冒出来，就不会觉得卡住了。</p>
        <p>这就是为什么很多聊天产品都做了打字机效果：不是炫技，是救命。</p>
        <h3>产品视角</h3>
        <ul>
          <li>把"我觉得慢"变成"p95 是多少、卡在哪一段（检索？首 token？生成？）"</li>
          <li>延迟和成本、质量一样是<strong>产品约束</strong>，要在选模型时就纳入，不能上线后才发现</li>
        </ul>
      `,
      practice: {
        prompt: "案例判断：某 AI 助手平均响应 1.1 秒，团队认为体验良好。但用户反馈『经常要转很久圈』。你应该先关注什么指标、怎么定位问题？",
        noExec: true,
        codeToRead: `已知：
- 平均响应时间：1.1 秒
- 用户反馈：经常「转圈等很久」
- 技术栈：RAG 检索 → 模型生成 → 前端展示`,
        choiceQuestion: "最合理的第一步是什么？",
        choices: [
          "平均值 1.1 秒已经很好，用户是在无理取闹",
          "看 p95/p99 分位数（确认尾部到底有多慢），并把延迟拆成检索、首 token、生成三段分别监控，找到具体是哪一段在拖尾；同时评估是否开启流式输出改善体感",
          "直接把模型换成最快的小模型，不管质量",
          "把用户反馈当成营销问题处理",
        ],
        answerIndex: 1,
        explain: "平均值 1.1 秒和「经常等很久」并不矛盾——尾部请求（p95/p99）可能非常慢。第一步是用分位数确认问题规模，再用分段埋点定位瓶颈（检索慢？TTFT 慢？生成长？），最后才谈方案（换模型、流式、缓存等）。不要跳过定位直接换模型。",
      },
    },

    {
      id: "m2-l4",
      title: "降本手段，以及「什么任务不该上大模型」",
      type: "learn",
      learnHtml: `
        <h3>降本四板斧</h3>
        <ol>
          <li><strong>Prompt 缓存（Prompt Caching）</strong>：很长的系统提示、固定的知识前缀，重复部分不用每次都重新计费。对"同一套长 prompt + 不同短问题"的场景效果显著。</li>
          <li><strong>批处理（Batch）</strong>：对延迟不敏感的任务（夜间跑批、内容打标）打包处理，单价通常更低。</li>
          <li><strong>模型路由（Routing）</strong>：便宜模型处理简单请求，贵模型只处理复杂请求（见 m2-l1）。</li>
          <li><strong>换小模型 / 微调小模型</strong>：高频、模式固定的任务，微调一个小模型能大幅降本（见 m1-l3，注意这是成本驱动、不是能力驱动）。</li>
        </ol>
        <h3>但最省钱的做法是：先问「要不要用 AI」</h3>
        <p>比任何降本手段都有效的是——<strong>根本不该用大模型的地方就别用</strong>。AI PM 面试里有个高频陷阱题：「你会怎么用 AI 解决 X？」，而<strong>正确答案的第一步往往是"先看这个问题需不需要 AI"</strong>。</p>
        <h3>五类红灯：这些不该用大模型</h3>
        <ul>
          <li><strong>确定性规则能解</strong>：比如"订单号必须 12 位数字""金额不能为负"——写规则又快又准又便宜，用 AI 反而不可靠。</li>
          <li><strong>零容错且无人工兜底</strong>：算工资、扣款、法律责任判定——一旦错就无法挽回，且没人复核，不能用概率系统自动拍板。</li>
          <li><strong>没有数据基础</strong>：要预测的东西根本没有可用的历史数据或信号。</li>
          <li><strong>没有反馈闭环</strong>：错了没人知道、没人纠正，模型就无法改进，会一直错下去。</li>
          <li><strong>合规或法律禁止</strong>：某些场景（如涉及特定个人敏感决策）法规要求不得由自动化系统决定。</li>
        </ul>
        <div class="callout callout-tip">
          <span class="callout-title">💡 更强的答法</span>
          好的 AI PM 会说：「这个问题我<strong>会用确定性的规则/检索/模板解决 80%，</strong>只在真正需要灵活理解的 20% 上引入模型，并且设计兜底。」——这比"全部上 AI"更能体现判断力。
        </div>
      `,
      practice: {
        prompt: "案例判断：某电商团队要做「订单金额校验」。有人提议用大模型判断『这个订单金额看起来合不合理』。请判断这个方案的问题，并给出更好的做法。",
        noExec: true,
        codeToRead: `需求：校验订单金额是否合理
AI 方案提议：把订单信息丢给大模型，问它「这个金额合理吗」`,
        choiceQuestion: "最合理的判断是什么？",
        choices: [
          "好方案，大模型理解能力强，应该能判断得比规则好",
          "不合理：金额校验是确定性规则能解决的事（库存价×数量+运费-优惠 vs 实收金额），规则又快又准又可解释；大模型是概率系统，用来做精确财务校验反而引入错误和成本。应优先用规则，AI 最多辅助解释异常原因",
          "应该调高 temperature 让模型判断更灵活",
          "应该把金额校验拆成 20 步 agent 来完成",
        ],
        answerIndex: 1,
        explain: "这是「确定性规则能解」的典型红灯。财务金额校验要求精确、可解释、零容忍误判——正是规则的强项、大模型的弱项。好 PM 的判断是：能用规则精确解决的，绝不交给概率系统；AI 只在规则解释不了的地方（比如「这个异常订单可能是什么原因」）做辅助。",
      },
    },

    {
      id: "m2-quiz",
      title: "模块小测",
      type: "quiz",
      quiz: {
        questions: [
          {
            q: "为什么 AI PM 应该算「每答案成本」而不是「每 token 成本」？",
            options: [
              "因为 token 价格天天变",
              "因为一次答案背后可能有多次模型调用、重试、以及大量上下文 token，只看单价会严重低估真实成本",
              "因为 token 不是计价单位",
              "因为每答案成本一定更低",
            ],
            answerIndex: 1,
            explain: "真实成本 = 输入+输出 token 成本 × (1+重试率) × 平均调用次数，还要算上上下文膨胀。只看单价做决策会得出错误结论。",
          },
          {
            q: "「平均响应时间 1.2 秒」这个指标最大的问题是什么？",
            options: [
              "它太高了",
              "它掩盖了尾部慢请求——应同时看 p95/p99，因为用户体验往往被最慢的那批请求决定",
              "它没有单位",
              "平均值对 AI 产品不适用",
            ],
            answerIndex: 1,
            explain: "平均数会被快请求拉低。p95/p99 才能反映大多数用户和重度用户实际会遇到的慢速体验。",
          },
          {
            q: "下面哪种降本手段应该最先考虑？",
            options: [
              "换个更便宜的小模型",
              "先问「这个任务是否必须用大模型」——能用确定性规则的就不用 AI",
              "把输出长度砍一半",
              "少招几个工程师",
            ],
            answerIndex: 1,
            explain: "最省钱的是根本不调用模型。确定性的、零容错的、无数据无反馈的任务，本来就不该用大模型。",
          },
          {
            q: "「扣款金额计算」这个任务，最适合的方案是什么？",
            options: [
              "用最强的大模型算，最准",
              "用确定性程序/规则计算，因为要求精确、可审计、零容错",
              "用 agent 多步推理计算",
              "用高 temperature 让模型更有创造力",
            ],
            answerIndex: 1,
            explain: "财务计算要求精确和可解释，是规则的强项。概率模型不能用于零容错的自动扣款决策。",
          },
          {
            q: "流式输出（streaming）主要改善什么？",
            options: [
              "降低模型成本",
              "提高模型准确率",
              "改善体感延迟——用户能边生成边看，不必等全部完成，但不减少总生成时长",
              "减少 token 用量",
            ],
            answerIndex: 2,
            explain: "流式不改变总时长，但让用户立刻看到内容在出现，大幅降低「卡住」的体感。这是最便宜的体验优化之一。",
          },
        ],
      },
    },
  ],
});
