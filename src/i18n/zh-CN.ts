export type EvidenceTranslation = {
  area: string
  title: string
  population: string
  studyDesign: string
  evidenceLevel: string
  takeaway: string
  meaning: string
  limitation: string
  sourceLabels: string[]
}

export type TrialTranslation = {
  title: string
  population: string
  design: string
  status: string
  caution: string
}

export type ZhCNEditionTranslation = {
  locale: "zh-CN"
  sourceLocale: "en-AU"
  translationStatus: "ai-assisted" | "human-reviewed"
  translationRevision: number
  translatedOn: string
  title: string
  summary: string
  changes: string[]
  childrenFocus?: { summary: string }
  deferredCandidates?: Record<string, { title: string; reason: string; revisitWhen: string }>
  evidence: Record<string, EvidenceTranslation>
  trials: Record<string, TrialTranslation>
}

export const zhCNEditionTranslations: Record<string, ZhCNEditionTranslation> = {
  "2026.08.0": {
    locale: "zh-CN",
    sourceLocale: "en-AU",
    translationStatus: "ai-assisted",
    translationRevision: 1,
    translatedOn: "2026-08-01",
    title: "淋巴水肿研究简报",
    summary: "为患者和照护者整理近期全球研究，说明研究发现该如何理解，以及目前仍有哪些重要问题没有答案。",
    changes: [
      "首次推出简体中文版本，与全球英文版逐条对应。",
      "将已发表的研究结果与尚未公布结果的注册试验分开呈现。",
      "保留澳大利亚照护资源和感染就医提醒。",
    ],
    evidence: {
      "resistance-training": {
        area: "预防与运动",
        title: "乳腺癌治疗后，渐进式力量训练可能有助于减少肿胀",
        population: "接受单侧乳腺癌手术、腋窝淋巴结清扫及放疗的女性",
        studyDesign: "一项随机对照试验的长期问卷随访；原有 158 名参与者中，84 人在 3.5 年时回复问卷",
        evidenceLevel: "随机证据",
        takeaway: "早期进行渐进式力量训练的一组，报告的长期肿胀少于常规照护组。",
        meaning: "研究人员正在评估，在专业指导下逐步增加力量训练，是否能作为安全的术后康复方式，并帮助部分人降低淋巴水肿风险。",
        limitation: "长期结果来自参与者自行填写的问卷；原有参与者中接近一半没有完成最后一次调查。因此，获益究竟有多大、结论有多可靠，仍不清楚。",
        sourceLabels: ["Ammitzbøll 等，《Journal of Cancer Survivorship》（2026，英文）"],
      },
      "compression-self-management": {
        area: "加压治疗与自我管理",
        title: "更灵活的加压和指导方式，可能让日常管理更容易",
        population: "正在接受强化综合消肿疗法的下肢淋巴水肿患者",
        studyDesign: "两项小型研究：一项是 24 人的随机非劣效性试验，比较可调式加压包扎与多层绷带；另一项是数字指导照护的前瞻性单组研究",
        evidenceLevel: "早期临床证据",
        takeaway: "在一项小型试验中，可调式加压包扎减小小腿体积的效果与多层绷带相近，而且穿戴更快；另一项无对照研究也观察到数字指导照护后的改善。",
        meaning: "这类更灵活的加压方式和指导式自我管理，可能让部分人更容易坚持治疗。衣具选择、使用培训和随访仍应由合格专业人员负责。",
        limitation: "两项研究的样本都很小，其中一项只在单个中心开展，数字照护研究也没有对照组。因此，不能据此认定某一种方法适合所有身体部位或疾病阶段。",
        sourceLabels: [
          "Reisshauer 等，随机压力包扎研究（2025，英文）",
          "Kostanoğlu 等，数字化支持治疗研究（2026，英文）",
        ],
      },
      microsurgery: {
        area: "显微手术",
        title: "显微手术可能减少蜂窝织炎，但不同结局并不一致",
        population: "继发性下肢淋巴水肿患者；同时参考了涵盖不同病因和疾病阶段的手术综述",
        studyDesign: "一项多中心随机试验，比较淋巴管静脉吻合术联合综合消肿疗法与单独使用综合消肿疗法；并结合一项 2026 年伞状综述解读结果",
        evidenceLevel: "随机证据",
        takeaway: "随机试验发现，接受淋巴管静脉吻合术的人发生蜂窝织炎的次数较少，但肢体周径和疼痛并无明显差异。更广泛的综述认为手术可能有帮助，不过各项证据的质量参差不齐。",
        meaning: "对经过谨慎筛选的人，尤其是反复发生蜂窝织炎的人，专科手术评估可能在保守治疗之外提供另一种选择。",
        limitation: "不同研究采用的手术技术、患者筛选标准、结局指标和随访时间差别很大。现有手术证据中，不少研究的质量较低或极低；即使接受手术，也仍需要持续的专科管理。",
        sourceLabels: [
          "Mihara 等，多中心随机临床试验（2023，英文）",
          "Gloviczki 等，伞状系统综述（2026，英文）",
        ],
      },
      "icg-imaging": {
        area: "影像检查",
        title: "吲哚菁绿（ICG）淋巴造影值得关注，但检查方法尚未统一",
        population: "因原发性下肢淋巴水肿而接受检查的人",
        studyDesign: "纳入 11 项吲哚菁绿淋巴造影研究的系统综述",
        evidenceLevel: "系统综述",
        takeaway: "ICG 淋巴造影可以显示浅层淋巴流动，而且不使用电离辐射。它可能帮助诊断、制定治疗方案和随访。",
        meaning: "当诊断较复杂或需要规划手术时，这类专科影像检查可能提供更多信息。",
        limitation: "各项研究在注射部位、检查技术、报告方式和患者特征方面并不一致。这篇综述无法确定统一的标准流程，也不能说明每个人都需要做这项检查。",
        sourceLabels: ["Brezgyte 等，《British Journal of Radiology》（2025，英文）"],
      },
      "primary-biology": {
        area: "原发性淋巴水肿的生物机制",
        title: "基因和组织研究正在帮助理解病因，但还没有带来新的治疗",
        population: "少量原发性淋巴水肿患者，包括表现类似 Milroy 病的人",
        studyDesign: "一项基因测序研究，以及一项纳入 15 名患者和 8 份健康对照样本的组织病例对照研究",
        evidenceLevel: "机制性证据",
        takeaway: "研究人员发现了另一个可能与疾病有关的 FLT4 基因变异，也观察到与血管通透性和淋巴信号有关的组织变化。",
        meaning: "这些发现可能帮助研究人员更准确地区分不同类型的原发性淋巴水肿，并针对不同生物机制设计后续研究。",
        limitation: "研究样本很小，结果还需要其他研究重复验证；2026 年研究报告的手术结果也不一致，无法得出明确结论。这些研究尚未带来新的常规治疗。",
        sourceLabels: [
          "Feiskhanov 等，FLT4 变异研究（2025，英文）",
          "Plau 等，组织与分子研究（2026，英文）",
        ],
      },
    },
    trials: {
      NCT05890677: {
        title: "LYMPH 试验：比较慢性乳腺癌相关淋巴水肿的显微手术与保守治疗",
        population: "患有慢性乳腺癌相关上肢淋巴水肿的成年人",
        design: "一项贴近常规医疗实践的随机国际多中心试验，比较显微手术与保守性综合消肿疗法",
        status: "正在招募",
        caution: "试验正在招募，不代表手术效果更好。主要研究尚未完成，目前没有结果可以报告。",
      },
      NCT07012642: {
        title: "研究 GLP-1 受体激动剂对上肢和下肢淋巴水肿的作用",
        population: "符合试验条件，并患有单侧上肢或下肢淋巴水肿的成年人",
        design: "一项早期 I 期、开放标签、单组干预试验",
        status: "正在招募",
        caution: "这项早期试验没有对照组，也尚未公布结果。它不能证明 GLP-1 类药物能够治疗淋巴水肿，也不是用药建议。",
      },
    },
  },
  "2026.08.1": {
    locale: "zh-CN",
    sourceLocale: "en-AU",
    translationStatus: "ai-assisted",
    translationRevision: 0,
    translatedOn: "2026-08-01",
    title: "淋巴水肿研究简报",
    summary: "为患者和照护者整理近期全球研究，说明研究发现该如何理解，以及目前仍有哪些重要问题没有答案。",
    changes: [
      "根据两项 2026 年荟萃分析，更新力量训练摘要，涵盖预防和已经出现的乳腺癌相关淋巴水肿。",
      "每月检索新增法语、德语、中文和日语 PubMed 论文观察列表，并加强上肢和躯干部位检索。",
    ],
    evidence: {
      "resistance-training": {
        area: "预防与运动",
        title: "乳腺癌手术后，渐进式力量训练可能有助于降低淋巴水肿风险",
        population: "接受乳腺癌手术且有淋巴水肿风险的女性；另一篇范围更广的综述还纳入已经出现乳腺癌相关淋巴水肿的人",
        studyDesign: "两篇 2026 年系统综述和荟萃分析：一篇聚焦预防，纳入 11 项随机试验、共 1,450 名女性；另一篇范围更广，纳入 38 项随机试验、共 4,843 人。解读时还参考了一项随机试验的长期随访",
        evidenceLevel: "系统综述",
        takeaway: "聚焦预防的综述发现，进行渐进式力量训练的人发生乳腺癌相关淋巴水肿的比例较低；证据确定性为中等。另一篇综述也报告了较低的发生率和更好的肢体结局。",
        meaning: "在专业人员适当指导下，力量训练可作为乳腺癌治疗后康复的一部分。但它不能保证预防淋巴水肿，也不能代替个人评估。",
        limitation: "力量训练试验无法让参与者不知道自己所在的组别；各研究的训练方案和淋巴水肿定义也不一致。范围更广的综述存在较高异质性，并把预防人群与已患淋巴水肿人群放在一起分析。长期随访研究中，接近一半原参与者没有完成最后一次问卷。",
        sourceLabels: [
          "Chen 等，聚焦预防的系统综述和荟萃分析（2026，英文）",
          "Wu 等，力量训练系统综述和荟萃分析（2026，英文）",
          "Ammitzbøll 等，随机试验长期随访（2026，英文）",
        ],
      },
      "compression-self-management": {
        area: "加压治疗与自我管理",
        title: "更灵活的加压和指导方式，可能让日常管理更容易",
        population: "正在接受强化综合消肿疗法的下肢淋巴水肿患者",
        studyDesign: "两项小型研究：一项是 24 人的随机非劣效性试验，比较可调式加压包扎与多层绷带；另一项是数字指导照护的前瞻性单组研究",
        evidenceLevel: "早期临床证据",
        takeaway: "在一项小型试验中，可调式加压包扎减小小腿体积的效果与多层绷带相近，而且穿戴更快；另一项无对照研究也观察到数字指导照护后的改善。",
        meaning: "这类更灵活的加压方式和指导式自我管理，可能让部分人更容易坚持治疗。衣具选择、使用培训和随访仍应由合格专业人员负责。",
        limitation: "两项研究的样本都很小，其中一项只在单个中心开展，数字照护研究也没有对照组。因此，不能据此认定某一种方法适合所有身体部位或疾病阶段。",
        sourceLabels: [
          "Reisshauer 等，随机压力包扎研究（2025，英文）",
          "Kostanoğlu 等，数字化支持治疗研究（2026，英文）",
        ],
      },
      microsurgery: {
        area: "显微手术",
        title: "显微手术可能减少蜂窝织炎，但不同结局并不一致",
        population: "继发性下肢淋巴水肿患者；同时参考了涵盖不同病因和疾病阶段的手术综述",
        studyDesign: "一项多中心随机试验，比较淋巴管静脉吻合术联合综合消肿疗法与单独使用综合消肿疗法；并结合一项 2026 年伞状综述解读结果",
        evidenceLevel: "随机证据",
        takeaway: "随机试验发现，接受淋巴管静脉吻合术的人发生蜂窝织炎的次数较少，但肢体周径和疼痛并无明显差异。更广泛的综述认为手术可能有帮助，不过各项证据的质量参差不齐。",
        meaning: "对经过谨慎筛选的人，尤其是反复发生蜂窝织炎的人，专科手术评估可能在保守治疗之外提供另一种选择。",
        limitation: "不同研究采用的手术技术、患者筛选标准、结局指标和随访时间差别很大。现有手术证据中，不少研究的质量较低或极低；即使接受手术，也仍需要持续的专科管理。",
        sourceLabels: [
          "Mihara 等，多中心随机临床试验（2023，英文）",
          "Gloviczki 等，伞状系统综述（2026，英文）",
        ],
      },
      "icg-imaging": {
        area: "影像检查",
        title: "吲哚菁绿（ICG）淋巴造影值得关注，但检查方法尚未统一",
        population: "因原发性下肢淋巴水肿而接受检查的人",
        studyDesign: "纳入 11 项吲哚菁绿淋巴造影研究的系统综述",
        evidenceLevel: "系统综述",
        takeaway: "ICG 淋巴造影可以显示浅层淋巴流动，而且不使用电离辐射。它可能帮助诊断、制定治疗方案和随访。",
        meaning: "当诊断较复杂或需要规划手术时，这类专科影像检查可能提供更多信息。",
        limitation: "各项研究在注射部位、检查技术、报告方式和患者特征方面并不一致。这篇综述无法确定统一的标准流程，也不能说明每个人都需要做这项检查。",
        sourceLabels: ["Brezgyte 等，《British Journal of Radiology》（2025，英文）"],
      },
      "primary-biology": {
        area: "原发性淋巴水肿的生物机制",
        title: "基因和组织研究正在帮助理解病因，但还没有带来新的治疗",
        population: "少量原发性淋巴水肿患者，包括表现类似 Milroy 病的人",
        studyDesign: "一项基因测序研究，以及一项纳入 15 名患者和 8 份健康对照样本的组织病例对照研究",
        evidenceLevel: "机制性证据",
        takeaway: "研究人员发现了另一个可能与疾病有关的 FLT4 基因变异，也观察到与血管通透性和淋巴信号有关的组织变化。",
        meaning: "这些发现可能帮助研究人员更准确地区分不同类型的原发性淋巴水肿，并针对不同生物机制设计后续研究。",
        limitation: "研究样本很小，结果还需要其他研究重复验证；2026 年研究报告的手术结果也不一致，无法得出明确结论。这些研究尚未带来新的常规治疗。",
        sourceLabels: [
          "Feiskhanov 等，FLT4 变异研究（2025，英文）",
          "Plau 等，组织与分子研究（2026，英文）",
        ],
      },
    },
    trials: {
      NCT05890677: {
        title: "LYMPH 试验：比较慢性乳腺癌相关淋巴水肿的显微手术与保守治疗",
        population: "患有慢性乳腺癌相关上肢淋巴水肿的成年人",
        design: "一项贴近常规医疗实践的随机国际多中心试验，比较显微手术与保守性综合消肿疗法",
        status: "正在招募",
        caution: "试验正在招募，不代表手术效果更好。主要研究尚未完成，目前没有结果可以报告。",
      },
      NCT07012642: {
        title: "研究 GLP-1 受体激动剂对上肢和下肢淋巴水肿的作用",
        population: "符合试验条件，并患有单侧上肢或下肢淋巴水肿的成年人",
        design: "一项早期 I 期、开放标签、单组干预试验",
        status: "正在招募",
        caution: "这项早期试验没有对照组，也尚未公布结果。它不能证明 GLP-1 类药物能够治疗淋巴水肿，也不是用药建议。",
      },
    },
  },
}

zhCNEditionTranslations["2026.08.2"] = {
  ...structuredClone(zhCNEditionTranslations["2026.08.1"]),
  translationStatus: "ai-assisted",
  translationRevision: 0,
  translatedOn: "2026-08-01",
  changes: [
    "将儿童和青少年设为研究检索报告的主要栏目，分别列出新发表论文和试验注册记录。",
    "新增可长期保留的“暂缓处理”栏目，记录每项候选资料暂缓的原因和重新评估条件。",
    "本次没有把尚未完成人工审查的儿童研究候选资料加入面向患者的证据摘要。",
  ],
}

zhCNEditionTranslations["2026.08.3"] = {
  ...structuredClone(zhCNEditionTranslations["2026.08.2"]),
  translationStatus: "ai-assisted",
  translationRevision: 1,
  translatedOn: "2026-08-01",
  changes: [
    "更正第 2026.08.2 版：现在公开页面会把儿童和青少年明确放在首要位置，而不只是在检索报告中说明。",
    "将内容未变的已审查摘要归入“其他现有证据”，并把原发性淋巴水肿机制研究排在乳腺癌相关运动研究之前。",
    "新增公开可见的“暂缓处理的证据”栏目，同时继续把尚未审查的候选资料与已发表研究结论分开。",
  ],
  evidence: {
    ...structuredClone(zhCNEditionTranslations["2026.08.2"].evidence),
    "primary-biology": {
      ...structuredClone(zhCNEditionTranslations["2026.08.2"].evidence["primary-biology"]),
      population: "少量原发性淋巴水肿患者，包括一些症状类似 Milroy 病的人。Milroy 病是一种遗传性淋巴水肿，通常从出生时或婴儿期开始，主要影响小腿和足部。",
    },
  },
  childrenFocus: {
    summary: "最近一次覆盖 45 天的检索发现 5 篇涉及儿童或青少年的论文候选资料，以及 3 条近期更新的试验注册记录。这些资料尚未完成纳入患者证据摘要所需的原始来源审查。",
  },
  deferredCandidates: {
    "PMID 40081785": {
      title: "前瞻性监测和运动能否预防高风险患者的乳腺癌相关淋巴水肿：随机试验",
      reason: "这项试验与现有的力量训练预防证据有较多重叠，因此暂不单独纳入。",
      revisitWhen: "下次更新运动证据时重新评估；如果它会实质改变当前解读，也应提前复核。",
    },
    "PMID 41886031": {
      title: "采用 LYMPHA 技术预防乳腺癌治疗后上肢淋巴水肿：单中心 15 年随访研究",
      reason: "长期随访可能有价值，但这是一项非随机、单中心研究，且跨越较长治疗时期，需要详细评估患者选择等问题。",
      revisitWhen: "完整核对患者选择、对照、随访、伤害、经费和利益冲突后重新评估。",
    },
    "PMID 42294341": {
      title: "乳腺癌相关淋巴水肿的非药物治疗：基于随机对照试验的系统综述与网状荟萃分析",
      reason: "在面向患者解释治疗排序前，需要先评估偏倚风险、证据网络连通性、异质性和证据确定性。",
      revisitWhen: "由人工审查者完成网状荟萃分析评估后重新考虑。",
    },
  },
}

export function hasZhCNTranslation(version: string): boolean {
  return version in zhCNEditionTranslations
}

export function getZhCNTranslation(version: string): ZhCNEditionTranslation {
  const translation = zhCNEditionTranslations[version]
  if (!translation) throw new Error(`No Simplified Chinese translation for edition ${version}`)
  return translation
}
