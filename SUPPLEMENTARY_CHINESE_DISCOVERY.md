# Supplementary Chinese-language discovery

Chinese-language research is a supplementary discovery channel for findings that may be absent from the global PubMed and ClinicalTrials.gov scan. It does not create a separate Chinese public evidence feed.

## Sources checked manually

Review these sources during each monthly editorial cycle using a date overlap of at least 45 days:

- [SinoMed — Chinese Biomedical Literature Service System](https://www.sinomed.ac.cn/main.jsp), maintained by the Institute of Medical Information/Library of the Chinese Academy of Medical Sciences;
- [Wanfang Data journals](https://c.wanfangdata.com.cn/) for additional Chinese journal coverage; and
- [Chinese Clinical Trial Registry (ChiCTR)](https://www.chictr.org.cn/), listed in the [WHO ICTRP primary-registry network](https://www.who.int/tools/clinical-trials-registry-platform/network/primary-registries/chinese-clinical-trial-registry-%28chictr%29). Use its records for trial discovery and status checking, not as evidence of efficacy.

Suggested concepts include `淋巴水肿`, `乳腺癌相关淋巴水肿`, `原发性淋巴水肿`, `继发性淋巴水肿`, `上肢淋巴水肿`, `手臂淋巴水肿`, `躯干淋巴水肿`, `胸壁淋巴水肿`, `腹部淋巴水肿`, `腹壁淋巴水肿`, `综合消肿治疗`, `压力治疗`, `淋巴管-静脉吻合术`, and `蜂窝织炎`. Adapt database syntax rather than assuming one query works everywhere.

For a request about the “stomach,” distinguish external abdominal-wall or truncal lymphoedema from ascites, internal-organ disease, and abdominal lymphatic malformations before considering a record in scope.

Do not automate scraping of these services without documented permission, a stable supported interface, rate limits, and tests. Record the database, query or concepts, date searched, result count when available, and include/exclude decisions in the monthly review issue.

## Outstanding-finding threshold

A Chinese-language publication is eligible for full editorial assessment only when all of the following apply:

1. It reports a guideline or consensus, comparative clinical evidence, a material safety signal, or another result likely to change how patients understand the evidence landscape.
2. The population, methods, results, limitations, authorship, publication venue, and stable source record can be checked. A news report, hospital announcement, search snippet, or generated summary is not enough.
3. It adds information not already represented by a duplicate, translation, or stronger source found in the global scan.
4. A human reviewer can assess the original Chinese record and, where needed, the full text. AI translation alone is not source review.
5. The wording can meet the same population, design, finding, possible-meaning, and limitation requirements as every other evidence item.

## Promotion path

When a publication passes the threshold:

1. add it to the global `en-AU` evidence record first, cite the original Chinese source directly, and label the publication language;
2. apply the ordinary global calendar or patch version rules;
3. translate that exact global evidence entry into `zh-CN` with one-to-one coverage; and
4. retain the Chinese translation status and independent translation revision.

A ChiCTR registration without posted results can enter the global trials section, with the same caution used for ClinicalTrials.gov records. It cannot enter the published-findings section until results are available and reviewed.
