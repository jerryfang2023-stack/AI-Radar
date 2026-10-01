# 2026-10-01 Data Center Source Intake - 国内融资独立监测

- generated_at: 2026-10-01T09:15:31.337Z
- mode: data_center_source_intake
- source_id: china-funding
- status: collected
- discovered_count: 98
- source_item_count: 98
- raw_candidate_count: 49
- failures: 3

## Channel Distribution

china-funding=49

## Theme Distribution

- china-funding-independent (china-funding-independent): 49

## Failures

- 36kr: list https://pitchhub.36kr.com/: no readable funding article links
- cls: list https://www.cls.cn/: fetch failed
- jiqizhixin: list https://www.jiqizhixin.com/: no readable funding article links

## Diagnostics

```json
{
  "source_id": "pedaily",
  "registry_id": "cn-pedaily",
  "name": "投资界",
  "attempted_at": "2026-10-01T09:12:21.548Z",
  "query_count": 8,
  "successful_queries": 8,
  "list_pages_ok": 2,
  "candidates": 29,
  "failures": [],
  "entry_urls": [
    "https://m.pedaily.cn/",
    "https://www.pedaily.cn/vcpeevent/"
  ],
  "consumer_hardware": [
    {
      "category": "ai-glasses",
      "query": "site:pedaily.cn (AI眼镜 OR AI 眼镜 OR 智能眼镜 OR AR眼镜) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-pendants",
      "query": "site:pedaily.cn (AI钥匙扣 OR AI 钥匙扣 OR AI挂件 OR 智能挂件 OR AI吊坠 OR AI胸针) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 3,
      "retained": 3,
      "capped": 0
    },
    {
      "category": "ai-toys",
      "query": "site:pedaily.cn (AI玩具 OR AI 玩具 OR AI潮玩 OR AI宠物 OR 陪伴机器人) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-phones",
      "query": "site:pedaily.cn (AI手机 OR AI 手机 OR AI原生手机 OR AI原生终端) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 2,
      "retained": 2,
      "capped": 0
    },
    {
      "category": "ai-audio-wearables",
      "query": "site:pedaily.cn (AI耳机 OR AI录音 OR 智能戒指 OR AI手表) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-home-devices",
      "query": "site:pedaily.cn (AI家庭机器人 OR AI家用机器人 OR AI学习机 OR AI相机) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 1,
      "retained": 1,
      "capped": 0
    }
  ],
  "discovered": 34,
  "general_candidates": 24,
  "capped": 7,
  "status": "collected",
  "response_ms": 32161,
  "completed_at": "2026-10-01T09:12:53.709Z"
}
```

```json
{
  "source_id": "chinaventure",
  "registry_id": "cn-chinaventure",
  "name": "投中网",
  "attempted_at": "2026-10-01T09:12:53.709Z",
  "query_count": 8,
  "successful_queries": 8,
  "list_pages_ok": 1,
  "candidates": 13,
  "failures": [],
  "entry_urls": [
    "https://www.chinaventure.com.cn/"
  ],
  "consumer_hardware": [
    {
      "category": "ai-glasses",
      "query": "site:chinaventure.com.cn (AI眼镜 OR AI 眼镜 OR 智能眼镜 OR AR眼镜) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-pendants",
      "query": "site:chinaventure.com.cn (AI钥匙扣 OR AI 钥匙扣 OR AI挂件 OR 智能挂件 OR AI吊坠 OR AI胸针) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-toys",
      "query": "site:chinaventure.com.cn (AI玩具 OR AI 玩具 OR AI潮玩 OR AI宠物 OR 陪伴机器人) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-phones",
      "query": "site:chinaventure.com.cn (AI手机 OR AI 手机 OR AI原生手机 OR AI原生终端) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-audio-wearables",
      "query": "site:chinaventure.com.cn (AI耳机 OR AI录音 OR 智能戒指 OR AI手表) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 1,
      "retained": 1,
      "capped": 0
    },
    {
      "category": "ai-home-devices",
      "query": "site:chinaventure.com.cn (AI家庭机器人 OR AI家用机器人 OR AI学习机 OR AI相机) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 1,
      "retained": 1,
      "capped": 0
    }
  ],
  "discovered": 13,
  "general_candidates": 12,
  "capped": 0,
  "status": "collected",
  "response_ms": 26481,
  "completed_at": "2026-10-01T09:13:20.190Z"
}
```

```json
{
  "source_id": "36kr",
  "registry_id": "cn-36kr-rss",
  "name": "36氪",
  "attempted_at": "2026-10-01T09:13:20.190Z",
  "query_count": 8,
  "successful_queries": 8,
  "list_pages_ok": 0,
  "candidates": 24,
  "failures": [
    "list https://pitchhub.36kr.com/: no readable funding article links"
  ],
  "entry_urls": [
    "https://pitchhub.36kr.com/"
  ],
  "consumer_hardware": [
    {
      "category": "ai-glasses",
      "query": "site:36kr.com (AI眼镜 OR AI 眼镜 OR 智能眼镜 OR AR眼镜) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 3,
      "retained": 3,
      "capped": 0
    },
    {
      "category": "ai-pendants",
      "query": "site:36kr.com (AI钥匙扣 OR AI 钥匙扣 OR AI挂件 OR 智能挂件 OR AI吊坠 OR AI胸针) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 4,
      "retained": 4,
      "capped": 0
    },
    {
      "category": "ai-toys",
      "query": "site:36kr.com (AI玩具 OR AI 玩具 OR AI潮玩 OR AI宠物 OR 陪伴机器人) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 6,
      "retained": 4,
      "capped": 2
    },
    {
      "category": "ai-phones",
      "query": "site:36kr.com (AI手机 OR AI 手机 OR AI原生手机 OR AI原生终端) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 2,
      "retained": 2,
      "capped": 0
    },
    {
      "category": "ai-audio-wearables",
      "query": "site:36kr.com (AI耳机 OR AI录音 OR 智能戒指 OR AI手表) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 6,
      "retained": 4,
      "capped": 2
    },
    {
      "category": "ai-home-devices",
      "query": "site:36kr.com (AI家庭机器人 OR AI家用机器人 OR AI学习机 OR AI相机) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 4,
      "retained": 4,
      "capped": 0
    }
  ],
  "discovered": 28,
  "general_candidates": 9,
  "capped": 4,
  "status": "partial",
  "response_ms": 22899,
  "completed_at": "2026-10-01T09:13:43.089Z"
}
```

```json
{
  "source_id": "cyzone",
  "registry_id": "cn-cyzone",
  "name": "创业邦",
  "attempted_at": "2026-10-01T09:13:43.089Z",
  "query_count": 8,
  "successful_queries": 8,
  "list_pages_ok": 1,
  "candidates": 9,
  "failures": [],
  "entry_urls": [
    "https://www.cyzone.cn/"
  ],
  "consumer_hardware": [
    {
      "category": "ai-glasses",
      "query": "site:cyzone.cn (AI眼镜 OR AI 眼镜 OR 智能眼镜 OR AR眼镜) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 2,
      "retained": 2,
      "capped": 0
    },
    {
      "category": "ai-pendants",
      "query": "site:cyzone.cn (AI钥匙扣 OR AI 钥匙扣 OR AI挂件 OR 智能挂件 OR AI吊坠 OR AI胸针) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 1,
      "retained": 1,
      "capped": 0
    },
    {
      "category": "ai-toys",
      "query": "site:cyzone.cn (AI玩具 OR AI 玩具 OR AI潮玩 OR AI宠物 OR 陪伴机器人) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-phones",
      "query": "site:cyzone.cn (AI手机 OR AI 手机 OR AI原生手机 OR AI原生终端) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-audio-wearables",
      "query": "site:cyzone.cn (AI耳机 OR AI录音 OR 智能戒指 OR AI手表) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-home-devices",
      "query": "site:cyzone.cn (AI家庭机器人 OR AI家用机器人 OR AI学习机 OR AI相机) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    }
  ],
  "discovered": 9,
  "general_candidates": 6,
  "capped": 0,
  "status": "collected",
  "response_ms": 28636,
  "completed_at": "2026-10-01T09:14:11.725Z"
}
```

```json
{
  "source_id": "cls",
  "registry_id": "cn-cls",
  "name": "财联社／科创板日报",
  "attempted_at": "2026-10-01T09:14:11.725Z",
  "query_count": 8,
  "successful_queries": 8,
  "list_pages_ok": 0,
  "candidates": 17,
  "failures": [
    "list https://www.cls.cn/: fetch failed"
  ],
  "entry_urls": [
    "https://www.cls.cn/"
  ],
  "consumer_hardware": [
    {
      "category": "ai-glasses",
      "query": "site:cls.cn (AI眼镜 OR AI 眼镜 OR 智能眼镜 OR AR眼镜) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 3,
      "retained": 3,
      "capped": 0
    },
    {
      "category": "ai-pendants",
      "query": "site:cls.cn (AI钥匙扣 OR AI 钥匙扣 OR AI挂件 OR 智能挂件 OR AI吊坠 OR AI胸针) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 3,
      "retained": 3,
      "capped": 0
    },
    {
      "category": "ai-toys",
      "query": "site:cls.cn (AI玩具 OR AI 玩具 OR AI潮玩 OR AI宠物 OR 陪伴机器人) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 2,
      "retained": 2,
      "capped": 0
    },
    {
      "category": "ai-phones",
      "query": "site:cls.cn (AI手机 OR AI 手机 OR AI原生手机 OR AI原生终端) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 5,
      "retained": 4,
      "capped": 1
    },
    {
      "category": "ai-audio-wearables",
      "query": "site:cls.cn (AI耳机 OR AI录音 OR 智能戒指 OR AI手表) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 3,
      "retained": 3,
      "capped": 0
    },
    {
      "category": "ai-home-devices",
      "query": "site:cls.cn (AI家庭机器人 OR AI家用机器人 OR AI学习机 OR AI相机) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 3,
      "retained": 3,
      "capped": 0
    }
  ],
  "discovered": 18,
  "general_candidates": 6,
  "capped": 1,
  "status": "partial",
  "response_ms": 31731,
  "completed_at": "2026-10-01T09:14:43.456Z"
}
```

```json
{
  "source_id": "qbitai",
  "registry_id": "cn-qbitai-rss",
  "name": "量子位",
  "attempted_at": "2026-10-01T09:14:43.456Z",
  "query_count": 8,
  "successful_queries": 8,
  "list_pages_ok": 1,
  "candidates": 6,
  "failures": [],
  "entry_urls": [
    "https://www.qbitai.com/"
  ],
  "consumer_hardware": [
    {
      "category": "ai-glasses",
      "query": "site:qbitai.com (AI眼镜 OR AI 眼镜 OR 智能眼镜 OR AR眼镜) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-pendants",
      "query": "site:qbitai.com (AI钥匙扣 OR AI 钥匙扣 OR AI挂件 OR 智能挂件 OR AI吊坠 OR AI胸针) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 2,
      "retained": 2,
      "capped": 0
    },
    {
      "category": "ai-toys",
      "query": "site:qbitai.com (AI玩具 OR AI 玩具 OR AI潮玩 OR AI宠物 OR 陪伴机器人) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-phones",
      "query": "site:qbitai.com (AI手机 OR AI 手机 OR AI原生手机 OR AI原生终端) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-audio-wearables",
      "query": "site:qbitai.com (AI耳机 OR AI录音 OR 智能戒指 OR AI手表) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-home-devices",
      "query": "site:qbitai.com (AI家庭机器人 OR AI家用机器人 OR AI学习机 OR AI相机) (融资 OR 获投 OR 领投) 2026-10",
      "status": "collected",
      "discovered": 1,
      "retained": 1,
      "capped": 0
    }
  ],
  "discovered": 6,
  "general_candidates": 3,
  "capped": 0,
  "status": "collected",
  "response_ms": 28618,
  "completed_at": "2026-10-01T09:15:12.074Z"
}
```

```json
{
  "source_id": "jiqizhixin",
  "registry_id": "cn-jiqizhixin",
  "name": "机器之心",
  "attempted_at": "2026-10-01T09:15:12.074Z",
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
      "query": "site:jiqizhixin.com (AI眼镜 OR AI 眼镜 OR 智能眼镜 OR AR眼镜) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-pendants",
      "query": "site:jiqizhixin.com (AI钥匙扣 OR AI 钥匙扣 OR AI挂件 OR 智能挂件 OR AI吊坠 OR AI胸针) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-toys",
      "query": "site:jiqizhixin.com (AI玩具 OR AI 玩具 OR AI潮玩 OR AI宠物 OR 陪伴机器人) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-phones",
      "query": "site:jiqizhixin.com (AI手机 OR AI 手机 OR AI原生手机 OR AI原生终端) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-audio-wearables",
      "query": "site:jiqizhixin.com (AI耳机 OR AI录音 OR 智能戒指 OR AI手表) (融资 OR 获投 OR 领投) 2026-10",
      "status": "empty",
      "discovered": 0,
      "retained": 0,
      "capped": 0
    },
    {
      "category": "ai-home-devices",
      "query": "site:jiqizhixin.com (AI家庭机器人 OR AI家用机器人 OR AI学习机 OR AI相机) (融资 OR 获投 OR 领投) 2026-10",
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
  "response_ms": 19205,
  "completed_at": "2026-10-01T09:15:31.279Z"
}
```

## Top Candidates

1. 苏度科技完成超10亿元新一轮融资，持续加注具身智能赛道 苏度科技完成超10亿元新一轮融资，上海国投先导、国泰海通、孚腾资本联合领投，多家产业及长期资本参与，小米等老股东跟投。 13:20 投融资 (投资界)
2. 执宇航天完成亿元级天使+轮融资，「裂变号-A型」即将投产 执宇航天科技（湖南）有限公司9月30日宣布完成亿元级天使 轮融资，老股东北斗集团、民银国际、世纪华通继续加注，新引入西上海集团旗下玄虎资本等投资方。本轮资金将用于全球唯一可复用小型运载火箭「裂变号-A型」研制，该火箭预计2027年首飞，公司已签37颗卫星发射服务协议。 09:40 投融资 (投资界)
3. 引航生物完成4.5亿元Pre-IPO融资，提速新品产业化与市场开拓 苏州引航生物科技股份有限公司完成4.5亿元Pre-IPO融资，由新老投资方共同认购。老股东元禾控股、湖南财鑫、湖南财信持续加注，新股东引入苏创投、苏产投、园丰资本、创客智盛等机构。 09:34 投融资 (投资界)
4. OpenAI拟融资300亿美元 9月30日消息，据报道，OpenAI正计划筹集至少300亿美元资金，并寻求约1.4万亿美元估值。报道称，此轮融资可能作为IPO前的过渡性融资，为公司提供进一步扩张所需资本。OpenAI此前已于今年3月完成一轮融资，获得1220亿美元承诺资本，公司估值达到8520亿美元。OpenAI首席执行官山姆·奥特曼此前表示，公司不会在2026年上市，并称这一决定与人工智能安全方面的考虑有关。（财联社） 08:18 快讯 (投资界)
5. 苏度科技完成超10亿元新一轮融资，持续加注具身智能赛道 智能装备 2026-09-30 13:20 (投资界)
6. 执宇航天完成亿元级天使+轮融资，「裂变号-A型」即将投产 天使 2026-09-30 09:40 (投资界)
7. 苏度科技完成超10亿元新一轮融资，持续加注具身智能赛道 (投资界)
8. 执宇航天完成亿元级天使+轮融资，「裂变号-A型」即将投产 (投资界)
9. 引航生物完成4.5亿元Pre-IPO融资，提速新品产业化与市场开拓 (投资界)
10. 迅杰光远完成超亿元B轮融资，持续推进AI与光谱分析深度融合 (投资界)
11. 吾拾微电子完成亿元A轮融资，加码先进封装与光芯片键合装备国产化 (投资界)
12. 南京十精科技完成A轮数千万元融资 (投资界)
13. 宏芯气体完成数亿元Pre-B轮融资，加速电子大宗气体国产化进程 (投资界)
14. 蓝虫具身完成数千万元天使轮融资，西高投领投 (投资界)
15. 「途见科技」完成亿元级Pre‑A++轮融资，专注柔性电子皮肤材料 (投资界)
16. 中科离子完成首轮6亿元融资，推动聚变衍生技术应用产业发展 (投资界)
17. 诺因智能完成数亿元天使+++轮融资，累计融资超10亿元 (投资界)
18. 海思盖德完成新一轮融资，布局视网膜脑机接口视觉重建新赛道 (投资界)
19. 「九维光子」完成数千万元天使轮融资 (投资界)
20. 西鸽完成近亿元A+轮融资，持续推进「1+5」跨产区布局 (投资界)
21. 枢途科技完成近亿元Pre-A轮融资，加速建设具身落地新基建 (投资界)
22. 利德健康完成数千万元Pre-A++轮融资，加速高端科学仪器和AI for Science业务发展 (投资界)
23. 斯莱普泰完成超5000万美元A轮融资，加速核心管线临床开发 (投资界)
24. 天复康完成数千万元天使轮融资，加速全球首创的脑机接口与精准神经调控产品转化 (投资界)
25. AI吊坠，真创新还是伪需求？ (投资界)
26. 投资界AI周报| DeepSeek开启疯狂招人 (投资界)
27. “今年机器人都在拼融资”_投资界 (投资界)
28. 2026年上半年，460亿砸向具身智能 (投资界)
29. 投资界专业及时快讯 (投资界)
30. 影身智能远不止“中国版worldlabs” 成立2年多以来完成5轮融资。 投中网 · 1天前 (投中网)
