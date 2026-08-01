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
  evidence: Record<string, EvidenceTranslation>
  trials: Record<string, TrialTranslation>
}

export const zhCNEditionTranslations: Record<string, ZhCNEditionTranslation> = {
  "2026.08.0": {
    locale: "zh-CN",
    sourceLocale: "en-AU",
    translationStatus: "ai-assisted",
    translationRevision: 0,
    translatedOn: "2026-08-01",
    title: "淋巴水肿研究简报",
    summary: "面向患者与照护者的全球近期研究摘要，说明研究结果可能意味着什么，以及仍存在哪些重要不确定性。",
    changes: [
      "发布首个简体中文翻译版本，并与全球英文证据版本逐项对应。",
      "明确区分已发表研究结果与尚无结果的注册试验。",
      "保留澳大利亚照护资源与感染紧急提示。",
    ],
    evidence: {
      "resistance-training": {
        area: "预防与运动",
        title: "乳腺癌治疗后，渐进式抗阻训练可能有帮助",
        population: "接受单侧乳腺癌手术、腋窝淋巴结清扫和放射治疗的女性",
        studyDesign: "一项随机对照试验的长期问卷随访；原始 158 名参与者中有 84 人在 3.5 年时作答",
        evidenceLevel: "随机证据",
        takeaway: "与常规照护组相比，被分配进行早期渐进式抗阻训练的参与者报告长期肿胀较少。",
        meaning: "在适当监督下进行抗阻运动，正被研究作为安全康复的一部分，并可能帮助部分乳腺癌治疗后人群降低淋巴水肿风险。",
        limitation: "长期结局由参与者自行报告，且接近一半的原始参与者没有完成最终问卷，因此获益大小和确定性仍不清楚。",
        sourceLabels: ["Ammitzbøll 等，《Journal of Cancer Survivorship》（2026，英文）"],
      },
      "compression-self-management": {
        area: "压力治疗与自我管理",
        title: "新的实施方式可能让保守治疗更易管理",
        population: "正在接受强化综合消肿治疗的下肢淋巴水肿患者",
        studyDesign: "一项纳入 24 人、比较可调节压力包扎装置与多层绷带的随机非劣效性研究，并结合另一项数字化指导照护的前瞻性单组研究",
        evidenceLevel: "早期临床证据",
        takeaway: "在一项小型试验中，可调节压力包扎装置降低小腿体积的效果与多层绷带相近，且使用更快捷；另一项无对照研究中的数字化支持治疗也显示改善。",
        meaning: "更灵活的压力治疗和指导式自我管理可能帮助部分患者坚持照护，但适配、培训和随访应由具备相应资质的专业人员提供。",
        limitation: "两项研究样本都很小，其中一项为单中心研究，数字化研究没有对照组。结果不能证明某一种方法适合所有身体部位或疾病阶段。",
        sourceLabels: [
          "Reisshauer 等，随机压力包扎研究（2025，英文）",
          "Kostanoğlu 等，数字化支持治疗研究（2026，英文）",
        ],
      },
      microsurgery: {
        area: "显微外科手术",
        title: "显微手术可能减少蜂窝织炎，但不同结局并不一致",
        population: "继发性下肢淋巴水肿患者；更广泛的手术综述纳入了不同病因和疾病阶段的人群",
        studyDesign: "一项多中心随机试验，比较淋巴管-静脉吻合术联合综合消肿治疗与单独综合消肿治疗，并结合一项 2026 年伞状综述进行解读",
        evidenceLevel: "随机证据",
        takeaway: "随机试验发现，接受淋巴管-静脉吻合术后蜂窝织炎发作次数减少，但肢体周径或疼痛没有显著差异。更广泛的综述提示可能存在获益，但证据质量不均。",
        meaning: "对于经过谨慎筛选的患者，尤其是反复发生蜂窝织炎者，专科手术评估可能在保守治疗之外提供另一种管理选择。",
        limitation: "手术技术、患者筛选标准、结局指标和随访差异很大。更广泛证据中相当一部分质量仍为低或极低，手术也不能取代持续的专科管理。",
        sourceLabels: [
          "Mihara 等，多中心随机临床试验（2023，英文）",
          "Gloviczki 等，伞状系统综述（2026，英文）",
        ],
      },
      "icg-imaging": {
        area: "影像",
        title: "吲哚菁绿淋巴造影很有前景，但操作规范尚不一致",
        population: "因原发性下肢淋巴水肿接受检查的人群",
        studyDesign: "纳入 11 项吲哚菁绿淋巴造影研究的系统综述",
        evidenceLevel: "系统综述",
        takeaway: "吲哚菁绿淋巴造影可显示浅表淋巴流动，且不使用电离辐射，可能有助于诊断、治疗规划和监测。",
        meaning: "专科影像可提供越来越多的信息，尤其是在诊断复杂或需要手术规划时。",
        limitation: "各研究的注射部位、技术、报告方式和患者特征并不一致。综述无法确定统一的标准诊断流程，也不能证明每个人都需要接受这种检查。",
        sourceLabels: ["Brezgyte 等，《British Journal of Radiology》（2025，英文）"],
      },
      "primary-biology": {
        area: "原发性淋巴水肿生物学",
        title: "遗传与组织研究正在细化疾病机制，但尚未形成治疗方法",
        population: "小规模原发性淋巴水肿人群，包括表现类似 Milroy 病的患者",
        studyDesign: "一项基因测序研究，以及一项纳入 15 名患者和 8 份健康对照样本的组织病例对照研究",
        evidenceLevel: "机制性证据",
        takeaway: "研究人员发现了另一个可能与疾病相关的 FLT4 变异，并报告了涉及血管通透性和淋巴信号通路的组织变化。",
        meaning: "这些发现可能帮助研究人员更精确地分类原发性淋巴水肿，并围绕不同生物机制设计未来研究。",
        limitation: "样本量很小，结果需要重复验证；2026 年研究中的手术结局也存在差异且无法得出明确结论。这些研究并未提供新的常规治疗方法。",
        sourceLabels: [
          "Feiskhanov 等，FLT4 变异研究（2025，英文）",
          "Plau 等，组织与分子研究（2026，英文）",
        ],
      },
    },
    trials: {
      NCT05890677: {
        title: "LYMPH 试验——比较慢性乳腺癌相关淋巴水肿的显微手术与保守治疗",
        population: "患有慢性乳腺癌相关上肢淋巴水肿的成年人",
        design: "一项务实性、随机、国际多中心研究，比较显微手术与保守性综合消肿治疗",
        status: "正在招募",
        caution: "招募状态和试验注册不能证明手术更好。主要研究完成日期仍在未来，此处没有可报告的研究结果。",
      },
      NCT07012642: {
        title: "GLP-1 受体激动剂对上肢和下肢淋巴水肿的疗效研究",
        population: "符合研究条件、患有单侧上肢或下肢淋巴水肿的成年人",
        design: "早期 I 期、开放标签、单组干预研究",
        status: "正在招募",
        caution: "这是一项早期、无对照且尚未发布结果的研究。它不能证明 GLP-1 类药物可用于治疗淋巴水肿，也不构成用药建议。",
      },
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
