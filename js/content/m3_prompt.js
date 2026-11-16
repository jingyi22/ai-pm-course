COURSE_MODULES.push({
  id: "m3",
  title: "Prompt 系统化工程",
  icon: "✍️",
  lessons: [
    {
      id: "m3-l1",
      title: "Prompt 的结构：R-I-C-C-E",
      type: "learn",
      learnHtml: `
        <h3>Prompt 不是「随便说一句」</h3>
        <p>一个可靠的 prompt 通常包含五块。记成 <strong>R-I-C-C-E</strong>：</p>
        <ul>
          <li><strong>R — Role（角色）</strong>：让它以什么身份作答。「你是一名资深旅行顾问」和「你是客服」会给出不同的语气与侧重。</li>
          <li><strong>I — Instructions（指令）</strong>：具体要它做什么。动词要明确：extract（抽取）、classify（分类）、summarize（总结）、rewrite（改写）。</li>
          <li><strong>C — Context（上下文）</strong>：完成任务需要的信息。用户信息、检索到的文档片段、历史对话。</li>
          <li><strong>C — Constraints（约束）</strong>：边界。字数、格式、不能做什么、拿不准怎么办（「资料里没有就说不知道」）。</li>
          <li><strong>E — Examples（示例）</strong>：正确的输入→输出样例（few-shot，下一课细讲）。</li>
        </ul>
        <div class="code-block">你是某旅行平台的行程助手。（Role）
根据下面的航班与酒店信息，为用户的 3 天东京行程生成每日安排表。（Instructions）

用户偏好：喜欢美食、不想太赶、预算中等。（Context）

要求：
- 每天 3~4 个活动，按时间顺序
- 每个活动标注大致耗时
- 信息不足时明确写「待确认」，不要编造营业时间（Constraints）

示例：（略，见另一课）</div>
        <h3>好 prompt 的可检验标准</h3>
        <ul>
          <li><strong>输出格式可验证</strong>：能不能一眼看出「对不对」？如果输出是自由散文，就没法自动评测。</li>
          <li><strong>边界条件写清</strong>：空输入、超长输入、无关输入时怎么办。</li>
          <li><strong>不指望模型读心</strong>：你觉得「显然」的隐含要求，写出来。</li>
        </ul>
        <div class="callout callout-exam">
          <span class="callout-title">📝 AI PM 的视角</span>
          Prompt 是<strong>产品规格的一种形式</strong>。写 prompt 时你其实在定义产品的行为边界。所以它不该是工程师随手一改的字符串，而应该被评审、被版本化（第三课）。
        </div>
      `,
      practice: {
        prompt: "案例判断：下面是一个「把用户评论分成正面/负面/中性」的 prompt。请指出它最主要的问题。",
        noExec: true,
        codeToRead: `Prompt：
「看看这条评论是好的还是坏的：{comment}」`,
        choiceQuestion: "这个 prompt 最主要的问题是什么？",
        choices: [
          "太短了，任何 prompt 都应该写满 500 字",
          "缺少角色、缺少「中性」这个类别的定义、没有规定输出格式（如只输出 正面/负面/中性 三个词）、没有处理边界情况（评论为空、评论同时有好有坏）——无法稳定地自动评测",
          "没有问题，人一看就懂",
          "应该加一句「请认真思考」",
        ],
        answerIndex: 1,
        explain: "问题在于它既没定义类别（只提了好/坏，漏了中性），也没规定输出格式，模型可能回一段解释性文字，导致无法程序化判分。好 prompt 要让输出可验证、边界可处理。",
      },
    },

    {
      id: "m3-l2",
      title: "few-shot：用示例教模型做事",
      type: "learn",
      learnHtml: `
        <h3>zero-shot 与 few-shot</h3>
        <p><strong>Zero-shot</strong>：只给指令，不给例子。对简单任务够用。<br>
        <strong>Few-shot</strong>：在 prompt 里给几个「输入→输出」样例，让模型照着这个模式作答。</p>
        <div class="code-block">把下面的用户反馈打上标签：[咨询 / 投诉 / 建议 / 表扬]

反馈：「你们这个退票流程能不能快点，等了三天了」 → 投诉
反馈：「想问下儿童票有优惠吗」 → 咨询
反馈：「要是能加个行李提醒就好了」 → 建议
反馈：「昨天客服小哥特别耐心，谢谢」 → 表扬

反馈：「{new_feedback}」 →</div>
        <h3>什么时候值得用 few-shot</h3>
        <ul>
          <li>输出格式复杂或有隐含规则（模型光听描述理解不了）</li>
          <li>类别边界模糊，需要「照葫芦画瓢」</li>
          <li>zero-shot 效果不稳定、格式老是跑偏</li>
        </ul>
        <h3>三个坑</h3>
        <ul>
          <li><strong>不是越多越好</strong>：示例会占上下文、增加成本（模块 2），还可能让模型过拟合到示例的偶然特征。通常 3~8 个高质量示例就够，先试再扩。</li>
          <li><strong>示例顺序有影响</strong>：模型会受相邻示例影响，有时把同类的放一起效果更好；成对比较任务要打乱位置（这也和 LLM judge 的位置偏差有关）。</li>
          <li><strong>示例本身会带偏见</strong>：如果四个示例里三个是「投诉」，模型会更倾向于判「投诉」。<strong>示例的分布就是你在给模型下暗指令</strong>——要覆盖各类别、各类难度。</li>
        </ul>
        <div class="callout callout-tip">
          <span class="callout-title">💡 和评测的关系</span>
          few-shot 示例是 prompt 的一部分，所以<strong>换示例等于换了产品行为</strong>，也要走评测回归（下一课）。很多「改了个示例结果全线崩」的事故都是因为没做回归。
        </div>
      `,
      practice: {
        prompt: "案例判断：团队在做「情感分类」，给了 6 个 few-shot 示例，其中 5 个是负面评论、1 个是正面。上线后发现模型把大量中性评论也判成了负面。请判断最可能的原因。",
        noExec: true,
        codeToRead: `few-shot 示例分布：
- 负面：5 个
- 正面：1 个
- 中性：0 个
现象：上线后中性评论被大量误判为负面`,
        choiceQuestion: "最可能的原因是什么？",
        choices: [
          "模型能力不行，应该换最大的模型",
          "示例分布严重偏向负面，而且根本没有中性的例子，等于在暗示范式「多数情况都是负面」，模型自然倾向判负面；应补足中性及各类样例、均衡分布",
          "应该把 temperature 调到 0",
          "few-shot 一定不如 zero-shot，删掉所有示例",
        ],
        answerIndex: 1,
        explain: "few-shot 示例的分布本身就在给模型下指令。5:1:0 的分布会让模型学到「大概率是负面」，且没见过中性样例就不知道中性长什么样。正确做法是补足各类样本、控制分布均衡，然后跑评测回归验证。",
      },
    },

    {
      id: "m3-l3",
      title: "Prompt 版本化与三轮调优记录",
      type: "learn",
      learnHtml: `
        <h3>Prompt 是代码，不是草稿</h3>
        <p>很多团队的 prompt 散落在文档、聊天记录、个人电脑里，改了什么、为什么改、改完效果怎样——全没记录。结果就是：修好一个问题，悄悄弄坏另外三个（<strong>静默回归</strong>）。</p>
        <h3>版本化要做到的四件事</h3>
        <ol>
          <li><strong>唯一版本号</strong>：v1 / v2 / v3……每次改动一个新版本，不覆盖旧的。</li>
          <li><strong>改动原因</strong>：这句话为什么加？针对哪个 BadCase？</li>
          <li><strong>关联配置</strong>：配的是哪个模型、什么 temperature、什么 few-shot 集。</li>
          <li><strong>评测结果</strong>：这个版本在评测集上是什么分数（下一模块细讲）。</li>
        </ol>
        <h3>三轮调优记录表（可直接当作品集用）</h3>
        <div class="code-block">| 版本 | 改了什么 | 为什么改（对应哪个 BadCase） | 验证样本 | 指标变化 |
|------|----------|------------------------------|----------|----------|
| v1   | 初版     | —                            | 50 条    | 准确率 71% |
| v2   | 加「资料里没有就说不知道」的约束 | 处理 12 条「编造营业时间」的 BadCase | 50 条 | 准确率 79%，幻觉率 18%→4% |
| v3   | 补 3 个中性类 few-shot 示例 | 中性评论误判为负面 | 50 条 | 准确率 84%，中性类 F1 0.62→0.81 |</div>
        <div class="callout callout-exam">
          <span class="callout-title">📝 这张表为什么值钱</span>
          面试时你说「我优化过 prompt」，面试官会追问「怎么证明变好了」。这张表直接回答：<strong>有量化、有原因、有对应 BadCase、有版本对比</strong>。它就是你的 mini-eval 作品的骨架（模块 4、模块 8 会用到）。
        </div>
        <h3>下面是写作练习</h3>
        <p>你会为一类任务写一版带 few-shot 的 prompt，并按上面的格式做一版调优记录。别跳过——这是模块 8 作品集的原料。</p>
      `,
      practice: {
        type: "writing",
        prompt: "写作练习：为你熟悉的某个 AI 助手场景（可以是 TripGenie 的对话任务、也可以是任何你了解的客服/助手场景），写一版<strong>带 few-shot 的 prompt</strong>（用 R-I-C-C-E 结构），然后按下面模板写一版<strong>三轮调优记录</strong>（哪怕第三轮是你设想的效果，也要写清「假设改了什么、期望指标怎么变」）。",
        hint: "重点不是 prompt 写得多漂亮，而是：① 有没有明确的输出格式和边界处理；② few-shot 示例分布是否均衡、是否覆盖难例；③ 调优记录里「改动→对应 BadCase→指标变化」这条链是否完整。",
        checklist: [
          {item: "写清了角色（Role）", hint: "让模型以什么身份作答"},
          {item: "指令明确、可执行（Instructions）", hint: "用明确动词，任务边界清楚"},
          {item: "提供了必要的上下文（Context）", hint: "完成任务需要的信息"},
          {item: "写了约束和边界处理（Constraints）", hint: "格式、字数、拿不准时怎么办（如无资料就说不知道）"},
          {item: "给了 few-shot 示例，且分布基本均衡", hint: "各类别都有、包含难例"},
          {item: "规定了可验证的输出格式", hint: "比如只输出标签词、或固定字段的 JSON"},
          {item: "写了三轮调优记录，每轮都有改动原因", hint: "对应哪个 BadCase"},
          {item: "调优记录里有量化指标对比", hint: "哪怕是设想值，也要有前后对比"},
        ],
        modelAnswer: `【好的写法应该长这样】（示例，不要照抄）

—— Prompt v1（R-I-C-C-E）——
【Role】你是某旅行平台的客服对话助手。
【Instructions】阅读用户咨询，判断意图类别，并生成一条回复建议。
【Context】用户所在渠道：App 内客服；当前订单状态会附在下方。
【Constraints】
- 意图标签只能从以下选一个：查订单 / 退改签 / 发票 / 投诉 / 其他
- 回复建议不超过 80 字，不说「我可以帮您」这类空话
- 如果信息不足以判断意图，输出 其他，并注明「信息不足」
- 不承诺任何退款金额或时间（这类需人工确认）
【Examples】
用户：「我前天买的机票怎么还没出票」→ 查订单
用户：「能不能把明天的改到后天」→ 退改签
用户：「开个公司抬头的发票」→ 发票
用户：「你们这什么破服务，等一小时没人理」→ 投诉
用户：「今天天气怎么样」→ 其他（与业务无关）

—— 调优记录 ——
v1：初版。50 条样本，意图准确率 71%。主要错误：退改签与查订单混淆（9 条）。
v2：在 Constraints 里补充「涉及金额/时间承诺 → 不直接承诺」，并加了两条退改签 vs 查订单的对比示例。原因：处理 9 条混淆 BadCase。结果：准确率 71% → 84%，混淆降到 2 条。
v3：发现「其他」类被过度使用（把「发票」误判成「其他」），补 2 条其他-发票边界示例。假设准确率 84% → 88%，「其他」类误判从 7 条降到 2 条（需在 100 条回归集上验证）。

【为什么这是好答案】
- 输出格式可验证（固定标签集）
- 明确「信息不足怎么办」「不承诺什么」（边界 + 风险）
- few-shot 覆盖五类且包含一条「无关输入」的难例
- 调优记录有：改动 → 对应 BadCase → 指标前后对比（闭环）`,
      },
    },

    {
      id: "m3-quiz",
      title: "模块小测",
      type: "quiz",
      quiz: {
        questions: [
          {
            q: "R-I-C-C-E 里两个 C 分别指什么？",
            options: [
              "Context（上下文）和 Constraints（约束）",
              "Cost（成本）和 Capacity（容量）",
              "Comment（评论）和 Code（代码）",
              "Class（类别）和 Confidence（置信度）",
            ],
            answerIndex: 0,
            explain: "R-I-C-C-E = Role / Instructions / Context / Constraints / Examples。两个 C 是上下文和约束。",
          },
          {
            q: "few-shot 示例里 5 个负面、1 个正面、0 个中性，会造成什么问题？",
            options: [
              "没有问题，示例越多越好",
              "示例分布本身就在暗示范式的先验，模型会倾向于负面，且没见过中性样例就无法正确处理中性——示例分布必须覆盖各类别且基本均衡",
              "只会影响速度",
              "只会让成本变高",
            ],
            answerIndex: 1,
            explain: "示例的分布是「暗指令」。偏斜分布会让模型学到错误的先验，缺失某类则完全学不到该类。",
          },
          {
            q: "为什么 prompt 需要版本化和评测回归？",
            options: [
              "为了显得专业",
              "因为改 prompt 等于改产品行为，没有回归评测就会「修好一个、悄悄弄坏三个」（静默回归）",
              "因为 prompt 会过期",
              "因为模型会自动改 prompt",
            ],
            answerIndex: 1,
            explain: "prompt 直接决定产品行为。必须像代码一样版本化并跑回归评测，才能防止静默回归。",
          },
          {
            q: "下面哪个 prompt 要素最能体现「输出可被自动评测」？",
            options: [
              "「请认真、仔细地回答」",
              "「只输出以下五个标签中的一个：查订单/退改签/发票/投诉/其他」",
              "「你是一个热情的助手」",
              "「请多用一些例子来说明」",
            ],
            answerIndex: 1,
            explain: "限定输出为闭合的标签集，才能程序化地判分。自由文本无法自动评测。",
          },
        ],
      },
    },
  ],
});
