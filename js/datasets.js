/*
 * datasets.js — AI PM 课程用合成数据集。
 *
 * 这些数据全部是**人造的示例数据**，不是任何真实公司的数据。
 * 用途：量化练习（成本估算、A/B 样本量、Cohen's kappa、precision/recall）。
 */

const PY_DATASETS = {
  // 模型价格表（示例值，非真实公司报价）
  // 单位：美元 / 每百万 token
  model_prices: `model,input_per_m,output_per_m,avg_latency_ms,note
small-fast,0.15,0.60,600,便宜快，适合分类抽取
mid-balanced,1.00,4.00,1200,通用场景默认
large-reasoning,5.00,20.00,3200,复杂推理，成本高
long-context,2.00,8.00,2500,超长上下文，注意长度溢价`,

  // 评测样本：人工打分 vs LLM-judge 打分（1=合格, 0=不合格）
  // 用于 Cohen's kappa 计算练习
  judge_labels: `item_id,human_label,judge_label
1,1,1
2,1,1
3,0,0
4,1,1
5,0,1
6,1,1
7,1,0
8,0,0
9,1,1
10,1,1
11,0,0
12,1,1
13,0,0
14,1,1
15,1,1
16,0,0
17,1,1
18,0,1
19,1,1
20,1,1`,

  // A/B 实验场景数据（示例）
  ab_scenario: `metric,baseline_rate,daily_traffic,planned_days,mde_absolute
search_to_booking,0.042,26000,14,0.004
ai_answer_acceptance,0.610,18000,14,0.03`,

  // 分类模型结果（用于 precision/recall 练习）
  confusion_matrix: `name,value
true_positive,142
false_positive,63
false_negative,38
true_negative,757`,
};
