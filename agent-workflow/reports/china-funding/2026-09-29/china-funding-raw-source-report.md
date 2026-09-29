# 2026-09-29 Data Center Source Intake - 国内融资独立监测

- generated_at: 2026-09-29T08:51:37.131Z
- mode: data_center_source_intake
- source_id: china-funding
- status: collected
- discovered_count: 130
- source_item_count: 130
- raw_candidate_count: 63
- failures: 3

## Channel Distribution

china-funding=63

## Theme Distribution

- china-funding-independent (china-funding-independent): 63

## Failures

- 36kr: list https://pitchhub.36kr.com/: no readable funding article links
- cls: list https://www.cls.cn/: no readable funding article links
- jiqizhixin: list https://www.jiqizhixin.com/: no readable funding article links

## Diagnostics

```json
{
  "source_id": "pedaily",
  "registry_id": "cn-pedaily",
  "name": "投资界",
  "attempted_at": "2026-09-29T08:49:31.788Z",
  "query_count": 8,
  "successful_queries": 8,
  "list_pages_ok": 2,
  "candidates": 35,
  "failures": [],
  "entry_urls": [
    "https://m.pedaily.cn/",
    "https://www.pedaily.cn/vcpeevent/"
  ],
  "consumer_hardware": [
    {
      "category": "ai-glasses",
      "query": "site:pedaily.cn (AI眼镜 OR AI 眼镜 OR 智能眼镜 OR AR眼镜) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 2,
      "retained": 2,
      "capped": 0
    },
    {
      "category": "ai-pendants",
      "query": "site:pedaily.cn (AI钥匙扣 OR AI 钥匙扣 OR AI挂件 OR 智能挂件 OR AI吊坠 OR AI胸针) (融资 OR 获投 OR 领投) 2026-09",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-toys",
      "query": "site:pedaily.cn (AI玩具 OR AI 玩具 OR AI潮玩 OR AI宠物 OR 陪伴机器人) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 3,
      "retained": 3,
      "capped": 0
    },
    {
      "category": "ai-phones",
      "query": "site:pedaily.cn (AI手机 OR AI 手机 OR AI原生手机 OR AI原生终端) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 1,
      "retained": 1,
      "capped": 0
    },
    {
      "category": "ai-audio-wearables",
      "query": "site:pedaily.cn (AI耳机 OR AI录音 OR 智能戒指 OR AI手表) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 7,
      "retained": 4,
      "capped": 3
    },
    {
      "category": "ai-home-devices",
      "query": "site:pedaily.cn (AI家庭机器人 OR AI家用机器人 OR AI学习机 OR AI相机) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 2,
      "retained": 2,
      "capped": 0
    }
  ],
  "discovered": 49,
  "general_candidates": 24,
  "capped": 14,
  "status": "collected",
  "response_ms": 15275,
  "completed_at": "2026-09-29T08:49:47.062Z"
}
```

```json
{
  "source_id": "chinaventure",
  "registry_id": "cn-chinaventure",
  "name": "投中网",
  "attempted_at": "2026-09-29T08:49:47.062Z",
  "query_count": 8,
  "successful_queries": 8,
  "list_pages_ok": 1,
  "candidates": 20,
  "failures": [],
  "entry_urls": [
    "https://www.chinaventure.com.cn/"
  ],
  "consumer_hardware": [
    {
      "category": "ai-glasses",
      "query": "site:chinaventure.com.cn (AI眼镜 OR AI 眼镜 OR 智能眼镜 OR AR眼镜) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 1,
      "retained": 1,
      "capped": 0
    },
    {
      "category": "ai-pendants",
      "query": "site:chinaventure.com.cn (AI钥匙扣 OR AI 钥匙扣 OR AI挂件 OR 智能挂件 OR AI吊坠 OR AI胸针) (融资 OR 获投 OR 领投) 2026-09",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-toys",
      "query": "site:chinaventure.com.cn (AI玩具 OR AI 玩具 OR AI潮玩 OR AI宠物 OR 陪伴机器人) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 1,
      "retained": 1,
      "capped": 0
    },
    {
      "category": "ai-phones",
      "query": "site:chinaventure.com.cn (AI手机 OR AI 手机 OR AI原生手机 OR AI原生终端) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 6,
      "retained": 4,
      "capped": 2
    },
    {
      "category": "ai-audio-wearables",
      "query": "site:chinaventure.com.cn (AI耳机 OR AI录音 OR 智能戒指 OR AI手表) (融资 OR 获投 OR 领投) 2026-09",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-home-devices",
      "query": "site:chinaventure.com.cn (AI家庭机器人 OR AI家用机器人 OR AI学习机 OR AI相机) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 2,
      "retained": 2,
      "capped": 0
    }
  ],
  "discovered": 22,
  "general_candidates": 12,
  "capped": 2,
  "status": "collected",
  "response_ms": 20513,
  "completed_at": "2026-09-29T08:50:07.575Z"
}
```

```json
{
  "source_id": "36kr",
  "registry_id": "cn-36kr-rss",
  "name": "36氪",
  "attempted_at": "2026-09-29T08:50:07.575Z",
  "query_count": 8,
  "successful_queries": 8,
  "list_pages_ok": 0,
  "candidates": 17,
  "failures": [
    "list https://pitchhub.36kr.com/: no readable funding article links"
  ],
  "entry_urls": [
    "https://pitchhub.36kr.com/"
  ],
  "consumer_hardware": [
    {
      "category": "ai-glasses",
      "query": "site:36kr.com (AI眼镜 OR AI 眼镜 OR 智能眼镜 OR AR眼镜) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 2,
      "retained": 2,
      "capped": 0
    },
    {
      "category": "ai-pendants",
      "query": "site:36kr.com (AI钥匙扣 OR AI 钥匙扣 OR AI挂件 OR 智能挂件 OR AI吊坠 OR AI胸针) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 1,
      "retained": 1,
      "capped": 0
    },
    {
      "category": "ai-toys",
      "query": "site:36kr.com (AI玩具 OR AI 玩具 OR AI潮玩 OR AI宠物 OR 陪伴机器人) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 6,
      "retained": 4,
      "capped": 2
    },
    {
      "category": "ai-phones",
      "query": "site:36kr.com (AI手机 OR AI 手机 OR AI原生手机 OR AI原生终端) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 2,
      "retained": 2,
      "capped": 0
    },
    {
      "category": "ai-audio-wearables",
      "query": "site:36kr.com (AI耳机 OR AI录音 OR 智能戒指 OR AI手表) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 4,
      "retained": 4,
      "capped": 0
    },
    {
      "category": "ai-home-devices",
      "query": "site:36kr.com (AI家庭机器人 OR AI家用机器人 OR AI学习机 OR AI相机) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 5,
      "retained": 4,
      "capped": 1
    }
  ],
  "discovered": 19,
  "general_candidates": 2,
  "capped": 3,
  "status": "partial",
  "response_ms": 17410,
  "completed_at": "2026-09-29T08:50:24.985Z"
}
```

```json
{
  "source_id": "cyzone",
  "registry_id": "cn-cyzone",
  "name": "创业邦",
  "attempted_at": "2026-09-29T08:50:24.986Z",
  "query_count": 8,
  "successful_queries": 8,
  "list_pages_ok": 1,
  "candidates": 18,
  "failures": [],
  "entry_urls": [
    "https://www.cyzone.cn/"
  ],
  "consumer_hardware": [
    {
      "category": "ai-glasses",
      "query": "site:cyzone.cn (AI眼镜 OR AI 眼镜 OR 智能眼镜 OR AR眼镜) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 2,
      "retained": 2,
      "capped": 0
    },
    {
      "category": "ai-pendants",
      "query": "site:cyzone.cn (AI钥匙扣 OR AI 钥匙扣 OR AI挂件 OR 智能挂件 OR AI吊坠 OR AI胸针) (融资 OR 获投 OR 领投) 2026-09",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-toys",
      "query": "site:cyzone.cn (AI玩具 OR AI 玩具 OR AI潮玩 OR AI宠物 OR 陪伴机器人) (融资 OR 获投 OR 领投) 2026-09",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-phones",
      "query": "site:cyzone.cn (AI手机 OR AI 手机 OR AI原生手机 OR AI原生终端) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 8,
      "retained": 4,
      "capped": 4
    },
    {
      "category": "ai-audio-wearables",
      "query": "site:cyzone.cn (AI耳机 OR AI录音 OR 智能戒指 OR AI手表) (融资 OR 获投 OR 领投) 2026-09",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-home-devices",
      "query": "site:cyzone.cn (AI家庭机器人 OR AI家用机器人 OR AI学习机 OR AI相机) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 1,
      "retained": 1,
      "capped": 0
    }
  ],
  "discovered": 21,
  "general_candidates": 13,
  "capped": 4,
  "status": "collected",
  "response_ms": 18599,
  "completed_at": "2026-09-29T08:50:43.585Z"
}
```

```json
{
  "source_id": "cls",
  "registry_id": "cn-cls",
  "name": "财联社／科创板日报",
  "attempted_at": "2026-09-29T08:50:43.585Z",
  "query_count": 8,
  "successful_queries": 8,
  "list_pages_ok": 0,
  "candidates": 27,
  "failures": [
    "list https://www.cls.cn/: no readable funding article links"
  ],
  "entry_urls": [
    "https://www.cls.cn/"
  ],
  "consumer_hardware": [
    {
      "category": "ai-glasses",
      "query": "site:cls.cn (AI眼镜 OR AI 眼镜 OR 智能眼镜 OR AR眼镜) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 2,
      "retained": 2,
      "capped": 0
    },
    {
      "category": "ai-pendants",
      "query": "site:cls.cn (AI钥匙扣 OR AI 钥匙扣 OR AI挂件 OR 智能挂件 OR AI吊坠 OR AI胸针) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 5,
      "retained": 4,
      "capped": 1
    },
    {
      "category": "ai-toys",
      "query": "site:cls.cn (AI玩具 OR AI 玩具 OR AI潮玩 OR AI宠物 OR 陪伴机器人) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 4,
      "retained": 4,
      "capped": 0
    },
    {
      "category": "ai-phones",
      "query": "site:cls.cn (AI手机 OR AI 手机 OR AI原生手机 OR AI原生终端) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 5,
      "retained": 4,
      "capped": 1
    },
    {
      "category": "ai-audio-wearables",
      "query": "site:cls.cn (AI耳机 OR AI录音 OR 智能戒指 OR AI手表) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 4,
      "retained": 4,
      "capped": 0
    },
    {
      "category": "ai-home-devices",
      "query": "site:cls.cn (AI家庭机器人 OR AI家用机器人 OR AI学习机 OR AI相机) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 4,
      "retained": 4,
      "capped": 0
    }
  ],
  "discovered": 29,
  "general_candidates": 13,
  "capped": 2,
  "status": "partial",
  "response_ms": 19932,
  "completed_at": "2026-09-29T08:51:03.517Z"
}
```

```json
{
  "source_id": "qbitai",
  "registry_id": "cn-qbitai-rss",
  "name": "量子位",
  "attempted_at": "2026-09-29T08:51:03.517Z",
  "query_count": 8,
  "successful_queries": 8,
  "list_pages_ok": 1,
  "candidates": 13,
  "failures": [],
  "entry_urls": [
    "https://www.qbitai.com/"
  ],
  "consumer_hardware": [
    {
      "category": "ai-glasses",
      "query": "site:qbitai.com (AI眼镜 OR AI 眼镜 OR 智能眼镜 OR AR眼镜) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 2,
      "retained": 2,
      "capped": 0
    },
    {
      "category": "ai-pendants",
      "query": "site:qbitai.com (AI钥匙扣 OR AI 钥匙扣 OR AI挂件 OR 智能挂件 OR AI吊坠 OR AI胸针) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 1,
      "retained": 1,
      "capped": 0
    },
    {
      "category": "ai-toys",
      "query": "site:qbitai.com (AI玩具 OR AI 玩具 OR AI潮玩 OR AI宠物 OR 陪伴机器人) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 8,
      "retained": 4,
      "capped": 4
    },
    {
      "category": "ai-phones",
      "query": "site:qbitai.com (AI手机 OR AI 手机 OR AI原生手机 OR AI原生终端) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 1,
      "retained": 1,
      "capped": 0
    },
    {
      "category": "ai-audio-wearables",
      "query": "site:qbitai.com (AI耳机 OR AI录音 OR 智能戒指 OR AI手表) (融资 OR 获投 OR 领投) 2026-09",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-home-devices",
      "query": "site:qbitai.com (AI家庭机器人 OR AI家用机器人 OR AI学习机 OR AI相机) (融资 OR 获投 OR 领投) 2026-09",
      "status": "collected",
      "discovered": 2,
      "retained": 2,
      "capped": 0
    }
  ],
  "discovered": 17,
  "general_candidates": 4,
  "capped": 4,
  "status": "collected",
  "response_ms": 14715,
  "completed_at": "2026-09-29T08:51:18.232Z"
}
```

```json
{
  "source_id": "jiqizhixin",
  "registry_id": "cn-jiqizhixin",
  "name": "机器之心",
  "attempted_at": "2026-09-29T08:51:18.232Z",
  "query_count": 8,
  "successful_queries": 8,
  "list_pages_ok": 0,
  "candidates": 0,
  "failures": [
    "list https://www.jiqizhixin.com/: no readable funding article links"
  ],
  "entry_urls": [
    "https://www.jiqizhixin.com/"
  ],
  "consumer_hardware": [
    {
      "category": "ai-glasses",
      "query": "site:jiqizhixin.com (AI眼镜 OR AI 眼镜 OR 智能眼镜 OR AR眼镜) (融资 OR 获投 OR 领投) 2026-09",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-pendants",
      "query": "site:jiqizhixin.com (AI钥匙扣 OR AI 钥匙扣 OR AI挂件 OR 智能挂件 OR AI吊坠 OR AI胸针) (融资 OR 获投 OR 领投) 2026-09",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-toys",
      "query": "site:jiqizhixin.com (AI玩具 OR AI 玩具 OR AI潮玩 OR AI宠物 OR 陪伴机器人) (融资 OR 获投 OR 领投) 2026-09",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-phones",
      "query": "site:jiqizhixin.com (AI手机 OR AI 手机 OR AI原生手机 OR AI原生终端) (融资 OR 获投 OR 领投) 2026-09",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-audio-wearables",
      "query": "site:jiqizhixin.com (AI耳机 OR AI录音 OR 智能戒指 OR AI手表) (融资 OR 获投 OR 领投) 2026-09",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-home-devices",
      "query": "site:jiqizhixin.com (AI家庭机器人 OR AI家用机器人 OR AI学习机 OR AI相机) (融资 OR 获投 OR 领投) 2026-09",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    }
  ],
  "discovered": 0,
  "general_candidates": 0,
  "capped": 0,
  "status": "partial",
  "response_ms": 18829,
  "completed_at": "2026-09-29T08:51:37.061Z"
}
```

## Top Candidates

1. 宏芯气体完成数亿元Pre-B轮融资，加速电子大宗气体国产化进程 宏芯气体完成数亿元Pre-B轮融资，由建投投资联合建安壹号基金领投，多家机构跟投。 15:32 投融资 (投资界)
2. 上海顺新具身智能机器人私募投资基金完成备案，规模20亿 9月29日消息，北京歌华有线电视网络股份有限公司以自有资金1亿元，认购中兵顺景股权投资管理有限公司发起设立的上海顺新具身智能机器人私募投资基金，该基金于2026年9月24日在中国证券投资基金业协会完成备案，备案编码SBVB21，托管人为中国民生银行股份有限公司。 15:17 投融资 (投资界)
3. 蓝虫具身完成数千万元天使轮融资，西高投领投 蓝虫具身近日完成数千万元天使轮融资，由西安高投领投。本轮融资将用于产线建设、研发及团队扩建。 13:22 投融资 (投资界)
4. 「途见科技」完成亿元级Pre‑A++轮融资，专注柔性电子皮肤材料 途见科技完成亿元级Pre-A 轮融资，由北京市人工智能产业投资基金、北京市新材料产业投资基金联合领投。 10:59 投融资 (投资界)
5. 中科离子完成首轮6亿元融资，推动聚变衍生技术应用产业发展 中科离子完成首轮市场化股权融资，融资金额6亿元。招银国际、皖能资本等多家机构共同参与本轮融资。 10:50 投融资 (投资界)
6. 诺因智能完成数亿元天使+++轮融资，累计融资超10亿元 深圳诺因智能9月29日宣布完成数亿元天使 轮融资，京东相关基金领投，多家机构跟投。自2025年8月成立以来，诺因智能累计融资超10亿元，距上一笔5亿元融资仅49天。 09:43 投融资 (投资界)
7. 宏芯气体完成数亿元Pre-B轮融资，加速电子大宗气体国产化进程 芯片半导体 2026-09-29 15:32 (投资界)
8. 蓝虫具身完成数千万元天使轮融资，西高投领投 天使 2026-09-29 13:22 (投资界)
9. 南京十精科技完成A轮数千万元融资 (投资界)
10. 宏芯气体完成数亿元Pre-B轮融资，加速电子大宗气体国产化进程 (投资界)
11. 蓝虫具身完成数千万元天使轮融资，西高投领投 (投资界)
12. 「途见科技」完成亿元级Pre‑A++轮融资，专注柔性电子皮肤材料 (投资界)
13. 中科离子完成首轮6亿元融资，推动聚变衍生技术应用产业发展 (投资界)
14. 诺因智能完成数亿元天使+++轮融资，累计融资超10亿元 (投资界)
15. 海思盖德完成新一轮融资，布局视网膜脑机接口视觉重建新赛道 (投资界)
16. 「九维光子」完成数千万元天使轮融资 (投资界)
17. 西鸽完成近亿元A+轮融资，持续推进「1+5」跨产区布局 (投资界)
18. 枢途科技完成近亿元Pre-A轮融资，加速建设具身落地新基建 (投资界)
19. 利德健康完成数千万元Pre-A++轮融资，加速高端科学仪器和AI for Science业务发展 (投资界)
20. 斯莱普泰完成超5000万美元A轮融资，加速核心管线临床开发 (投资界)
21. 天复康完成数千万元天使轮融资，加速全球首创的脑机接口与精准神经调控产品转化 (投资界)
22. 济视同光完成数千万元Pre-A轮融资，加速iPSC眼科细胞药物临床转化 (投资界)
23. 佧森航空完成数千万Pre-A轮融资，加速低空飞行器热管理产品布局 (投资界)
24. 新烛时代完成天使+轮融资，聚焦AI驱动聚变产业 (投资界)
25. 影目科技完成近10亿C轮融资，专注于‌AI+AR智能眼镜‌研发 (投资界)
26. 退货率30%，AI眼镜成「大厂丑儿子」？ (投资界)
27. AI潮玩，谁不想成为LABUBU (投资界)
28. 投资界专业及时快讯 (投资界)
29. AI|投资界 (投资界)
30. 首发|未来智能融资亿元级，传音投了 - 投资界 (投资界)
