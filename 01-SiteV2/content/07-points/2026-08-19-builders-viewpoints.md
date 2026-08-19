---
date: 2026-08-19
stage: builders-viewpoints
status: first-line-viewpoint-collected
builder_items_count: 35
generated_at: 2026-08-19T08:11:40.947Z
follow_builders_script: ../../../../../../.skill-store/follow-builders/scripts/prepare-digest.js
---

# 2026-08-19 First-Line Viewpoints Skill Intake

说明：本文件直接调用本地 follow-builders skill，收录 Builder 观点/实践线索（discovery 级），作为一线观点 intake 资产沉淀。
注意：社媒/X 观点为观点线索，不作为事实主证据；进入商业信号、变化候选、趋势候选或当前前台链路的事实结论仍需补足 S/A/B 原始来源。

## BP-20260819-01｜Swyx｜we've been doing a lot of a/b testing of @aiDotEngineer youtube thumbnails. i always hated

- stable_id: `BP-20260819-01`
- source_path: `follow-builders`
- source_url: `https://x.com/swyx/status/2089798658225266806`
- source_name: follow-builders / X / Swyx
- original_date: 2026-08-18
- captured_at: 2026-08-19T08:11:40.939Z
- kind: x

原始观点/摘要：we've been doing a lot of a/b testing of @aiDotEngineer youtube thumbnails. i always hated that it is such an opaque process. open sourcing/crowdsourcing our learnings today! https://t.co/J9SYClIF7z doing this in hopes that people can share their experience or learn from ours. at the end of the day we just want to get good educational content to rise above the noise online. please lmk what you think

achieve ambition with intentionality, intensity, integrity & insanity. affiliations: - @smol_ai - @dxtipshq - @cognition - @aidotengineer - @latentspacepod

likes=143; retweets=4; replies=34

## BP-20260819-02｜Boris Cherny｜The small quality of life improvements keep coming. When you’re using Desktop every day, s

- stable_id: `BP-20260819-02`
- source_path: `follow-builders`
- source_url: `https://x.com/bcherny/status/2089924199804711410`
- source_name: follow-builders / X / Boris Cherny
- original_date: 2026-08-19
- captured_at: 2026-08-19T08:11:40.941Z
- kind: x

原始观点/摘要：The small quality of life improvements keep coming. When you’re using Desktop every day, slow startup makes the app feel sluggish. Working on improving this even more! https://t.co/EXiF9IYDfP

Claude Code @anthropicai

likes=486; retweets=6; replies=84

## BP-20260819-03｜Thibault Sottiaux｜I was gifted a very fancy new reset button today

- stable_id: `BP-20260819-03`
- source_path: `follow-builders`
- source_url: `https://x.com/thsottiaux/status/2089941380336644295`
- source_name: follow-builders / X / Thibault Sottiaux
- original_date: 2026-08-19
- captured_at: 2026-08-19T08:11:40.941Z
- kind: x

原始观点/摘要：I was gifted a very fancy new reset button today

Codex & ChatGPT @OpenAI

likes=6843; retweets=246; replies=1780

## BP-20260819-04｜Thibault Sottiaux｜Hi! Recapping some changes we have rolled out over the last couple of weeks that have furt

- stable_id: `BP-20260819-04`
- source_path: `follow-builders`
- source_url: `https://x.com/thsottiaux/status/2089891927659585918`
- source_name: follow-builders / X / Thibault Sottiaux
- original_date: 2026-08-19
- captured_at: 2026-08-19T08:11:40.941Z
- kind: x

原始观点/摘要：Hi! Recapping some changes we have rolled out over the last couple of weeks that have further reduced the risk associated to potentially destructive actions being performed by Codex during its work. A few weeks ago, we started investigating a small number of reports where GPT-5.6 in Codex took destructive actions outside what the user asked for. The most serious pattern we found was a command meant to clean up temporary work that could instead delete the user files. This should obviously not happen. Here’s what we found: - Codex sometimes creates temporary folders while working and cleans them up afterward. In rare cases, GPT-5.6 got that cleanup wrong. One pattern involved reusing a system environment variable like $HOME for temporary work. A malformed cleanup command could then point at the actual home directory instead of the temporary folder. - There were cases where the model tried to delete or overwrite a temporary path without checking what was already there. We’ve added protections at several layers: - Codex is now explicitly instructed to check deletion targets before acting, create fresh temporary directories, avoid repurposing system environment variables, prefer recoverable actions, and stop when the scope is unclear. - We strengthened the execution checks that identify high-risk deletion commands and escalate them for review. If a command is rejected, the model is directed to take a safer approach. - We made Full access harder to enable accidentally, added clearer warnings, and further restricted especially risky permission combinations. - We updated Auto-review to better identify destructive actions. - We built targeted evaluations that replay the failures we observed. We’re also adding reinforcement-learning tasks and graders focused on these risks, and filtering destructive actions from training data. In those replay evaluations, the changes substantially reduced the behavior while preserving Codex’s ability to complete normal coding work. Two things to do on your end: - Keep the Codex app up to date. We are always improving safety, performance and many other things. - Use one of the sandbox modes: "Ask for approval" or "Approve for me". Only use

## BP-20260819-05｜Peter Yang｜I should build an app (or an agent?) where you get and maintain a streak for how many days

- stable_id: `BP-20260819-05`
- source_path: `follow-builders`
- source_url: `https://x.com/petergyang/status/2089931839016468575`
- source_name: follow-builders / X / Peter Yang
- original_date: 2026-08-19
- captured_at: 2026-08-19T08:11:40.941Z
- kind: x

原始观点/摘要：I should build an app (or an agent?) where you get and maintain a streak for how many days you avoid bringing the phone to the bedroom. Have been leaving it downstairs for 3 days now and it has noticeably improved my sleep. It's the hardest thing to stay disciplined about. Always an excuse just waiting ("let me see what my agents are up to in bed!)"

Practical AI tutorials and interviews for busy people | Get my best AI skills and guides at https://t.co/6VAA6p81x6

likes=20; retweets=0; replies=13

## BP-20260819-06｜Peter Yang｜3. AI has landed on top of existing work rather than replacing it ?? Teams now spent more 

- stable_id: `BP-20260819-06`
- source_path: `follow-builders`
- source_url: `https://x.com/petergyang/status/2089877083510235328`
- source_name: follow-builders / X / Peter Yang
- original_date: 2026-08-19
- captured_at: 2026-08-19T08:11:40.941Z
- kind: x

原始观点/摘要：3. AI has landed on top of existing work rather than replacing it ?? Teams now spent more time chatting with AI and delegating to agents but didn't spend any less time on existing work. I think this is because expectations for what any function can accomplish are simply much higher now.

Practical AI tutorials and interviews for busy people | Get my best AI skills and guides at https://t.co/6VAA6p81x6

likes=3; retweets=0; replies=0

## BP-20260819-07｜Peter Yang｜2. Non-engineers are shipping more code PMs attaching pull requests rose from 3% to 10% in

- stable_id: `BP-20260819-07`
- source_path: `follow-builders`
- source_url: `https://x.com/petergyang/status/2089877068188471545`
- source_name: follow-builders / X / Peter Yang
- original_date: 2026-08-19
- captured_at: 2026-08-19T08:11:40.941Z
- kind: x

原始观点/摘要：2. Non-engineers are shipping more code PMs attaching pull requests rose from 3% to 10% in two years. Designers went from 1% to 8%, and founders are second only to engineers at 23%. I'm actually surprised that designers are slightly behind PMs on this, given the rise of design engineer roles.

Practical AI tutorials and interviews for busy people | Get my best AI skills and guides at https://t.co/6VAA6p81x6

likes=2; retweets=0; replies=1

## BP-20260819-08｜Nan Yu｜More examples https://t.co/yR9TiL2DsJ

- stable_id: `BP-20260819-08`
- source_path: `follow-builders`
- source_url: `https://x.com/thenanyu/status/2089800195907502481`
- source_name: follow-builders / X / Nan Yu
- original_date: 2026-08-18
- captured_at: 2026-08-19T08:11:40.941Z
- kind: x

原始观点/摘要：More examples https://t.co/yR9TiL2DsJ

product enthusiast

likes=0; retweets=0; replies=0

## BP-20260819-09｜Nan Yu｜I wish it was a better watch https://t.co/5hMKjTJo8Q

- stable_id: `BP-20260819-09`
- source_path: `follow-builders`
- source_url: `https://x.com/thenanyu/status/2089692801537560610`
- source_name: follow-builders / X / Nan Yu
- original_date: 2026-08-18
- captured_at: 2026-08-19T08:11:40.941Z
- kind: x

原始观点/摘要：I wish it was a better watch https://t.co/5hMKjTJo8Q

product enthusiast

likes=8; retweets=0; replies=5

## BP-20260819-10｜Madhu Guru｜Here’s how to think about the cost of your evals : treat evals like frontier models’establ

- stable_id: `BP-20260819-10`
- source_path: `follow-builders`
- source_url: `https://x.com/realmadhuguru/status/2089918106814603728`
- source_name: follow-builders / X / Madhu Guru
- original_date: 2026-08-19
- captured_at: 2026-08-19T08:11:40.941Z
- kind: x

原始观点/摘要：Here’s how to think about the cost of your evals : treat evals like frontier models’establish the quality frontier first, then work your way down the cost curve. Start with the highest quality way you can know if your AI product is working as intended. First get clear on what good looks like - Write the rubric. Then figure out the best way to measure it - humans / LLM judge / automated verification. At this stage, spend the money - use the expensive judge model, pay humans (or give your time). Run the best eval process possible so you get a signal you trust. Once the eval can reliably distinguish good from bad and reflects what you care about in the product, focus on costs - more automation, smaller judge models, sampling, deterministic checks where relevant. Quality first. Cost next. this is a series. drop any questions you have and I will answer them in my daily posts.

Sr Director, AI at Meta; Prev: Google - Led Gemini, Veo, Nano Banana.

likes=39; retweets=2; replies=9

## BP-20260819-11｜Thariq｜weird that there's a "make a lot of money" button and nobody's pressing it (take your SaaS

- stable_id: `BP-20260819-11`
- source_path: `follow-builders`
- source_url: `https://x.com/trq212/status/2089844723691479333`
- source_name: follow-builders / X / Thariq
- original_date: 2026-08-18
- captured_at: 2026-08-19T08:11:40.941Z
- kind: x

原始观点/摘要：weird that there's a "make a lot of money" button and nobody's pressing it (take your SaaS, make it headless, let agents use it, charge per interaction esp for enterprises)

Claude Code @anthropicai. prev YC W20, @spc, @medialab

likes=4002; retweets=128; replies=204

## BP-20260819-12｜Google Labs｜Do you C what I C? ? CC, our experimental AI productivity agent in Gmail, has now opened u

- stable_id: `BP-20260819-12`
- source_path: `follow-builders`
- source_url: `https://x.com/GoogleLabs/status/2089812430885208361`
- source_name: follow-builders / X / Google Labs
- original_date: 2026-08-18
- captured_at: 2026-08-19T08:11:40.941Z
- kind: x

原始观点/摘要：Do you C what I C? ? CC, our experimental AI productivity agent in Gmail, has now opened up a waitlist in Australia and New Zealand! ?? ? We're also expanding availability in the US and Canada. If you've been on the waitlist, we're rolling out invitations to get access starting today. ? We've upgraded CC to help manage your calendar. CC connects to Gmail so events are automatically created in a dedicated Google Calendar and stay up to date as things change. Learn more here: https://t.co/O43tNhIqPT

Google’s home for our latest AI tools and experiments.

likes=244; retweets=14; replies=14

## BP-20260819-13｜Guillermo Rauch｜I’ve been using https://t.co/OL0LzGtvAw as my daily driver and it’s a one-way street. It’s

- stable_id: `BP-20260819-13`
- source_path: `follow-builders`
- source_url: `https://x.com/rauchg/status/2089831055373316274`
- source_name: follow-builders / X / Guillermo Rauch
- original_date: 2026-08-18
- captured_at: 2026-08-19T08:11:40.941Z
- kind: x

原始观点/摘要：I’ve been using https://t.co/OL0LzGtvAw as my daily driver and it’s a one-way street. It’s 10-20x smaller than the major coding CLIs. It starts up instantaneously. It feels more like using ?????? than an IDE in your terminal. It’s embeddable anywhere, even your browser via WebAssembly. And of course it’s open source and model-agnostic. It’s experimental, but give it a shot and let us know how it goes!

@vercel CEO

likes=884; retweets=25; replies=55

## BP-20260819-14｜Guillermo Rauch｜Your software factory should be a monorepo. All your company context (design, marketing, s

- stable_id: `BP-20260819-14`
- source_path: `follow-builders`
- source_url: `https://x.com/rauchg/status/2089804717337817514`
- source_name: follow-builders / X / Guillermo Rauch
- original_date: 2026-08-18
- captured_at: 2026-08-19T08:11:40.941Z
- kind: x

原始观点/摘要：Your software factory should be a monorepo. All your company context (design, marketing, sales, engineering, support) in one place for agents to build upon https://t.co/MRPrmkSAPd

@vercel CEO

likes=2289; retweets=104; replies=104

## BP-20260819-15｜Guillermo Rauch｜We are putting $1M towards verifying the security of Vercel Sandbox, in the open. You're f

- stable_id: `BP-20260819-15`
- source_path: `follow-builders`
- source_url: `https://x.com/rauchg/status/2089747453004468339`
- source_name: follow-builders / X / Guillermo Rauch
- original_date: 2026-08-18
- captured_at: 2026-08-19T08:11:40.942Z
- kind: x

原始观点/摘要：We are putting $1M towards verifying the security of Vercel Sandbox, in the open. You're free to test any model in the world to try and find an escape. I'm looking forward to bringing transparency to what frontier models can and cannot do in terms of real-world guardrail exploitability. If escapes are discovered, we'll be ready to patch, iterate, and share our findings with the broader community to strengthen global cybersecurity.

@vercel CEO

likes=1386; retweets=67; replies=61

## BP-20260819-16｜Aaron Levie｜As we’re seeing in case study after case study, it turns out that the amount of value that

- stable_id: `BP-20260819-16`
- source_path: `follow-builders`
- source_url: `https://x.com/levie/status/2089921630650925170`
- source_name: follow-builders / X / Aaron Levie
- original_date: 2026-08-19
- captured_at: 2026-08-19T08:11:40.942Z
- kind: x

原始观点/摘要：As we’re seeing in case study after case study, it turns out that the amount of value that can be created between the AI model and the ultimate end-user workflow is far larger than many people assumed or realized. Model capability is obviously doing a lot of heavy lifting in agentic products, but there’s still a lot more work to diffuse AI into the enterprise. 1. Getting agents to work well (and alongside people) in mission critical workflows tends to need to be represented differently depending on the business process. Sometimes it’s a chat experience. Other times it’s a background agent running in a deterministic workflow. And dozens of other variants. This is a mix of needing a harness that’s tuned to specific domains of work, but also making it show up in the right product experience. 2. Different workflows connect into entirely different enterprise systems and need access to very different data. Working with that data -whether it’s life sciences, financial, legal, etc.- requires contextual approaches, understanding of the data, having the right user experience for data interaction, and more. 3. The need for domain-specific change management remains critical in most verticals. The way you talk and implement technology at a bank is very different from a law firm. Having the right talent with a singular mission ends up being extremely useful for something as complex as process reengineering. 4. The ability to work with a variety of models means you can tune the workflows to different cost and performance levels. And you can eventually post train models for specific tasks to tailor the outcomes and eke out gains that aren’t coming otherwise in frontier models. 5. Evals! AI is basically not useful if it can’t be evaluated. Domain-specific evals that let you dramatically improve the performance of your harness for specific workflows just has a crazy long tail given how many tasks there are in the economy. Nearly impossible for one system to be tuned for all of them. 6. Lots of verticals and domains require pricing models that reflect relevant abstractions on top of tokens alone. The ability to price in ways that work for your industry’s consumption model ends up 

## BP-20260819-17｜Ryo Lu｜first step moving to asia: help me empty my apartment! if you can pick up in SF, place an 

- stable_id: `BP-20260819-17`
- source_path: `follow-builders`
- source_url: `https://x.com/ryolu_/status/2089894938934911053`
- source_name: follow-builders / X / Ryo Lu
- original_date: 2026-08-19
- captured_at: 2026-08-19T08:11:40.942Z
- kind: x

原始观点/摘要：first step moving to asia: help me empty my apartment! if you can pick up in SF, place an order and we meet next week :) made with @bot and @NotionHQ https://t.co/Y3gqmH13DX

Designed @Cursor_ai, @NotionHQ, @Stripe, built startups. I make a world where anyone can make software. Aspiring k-pop idol.

likes=809; retweets=15; replies=60

## BP-20260819-18｜Garry Tan｜If you want SF rent to be $10K/mo for a 1BR (you're a NIMBY landlord and you hate newcomer

- stable_id: `BP-20260819-18`
- source_path: `follow-builders`
- source_url: `https://x.com/garrytan/status/2089869693201092848`
- source_name: follow-builders / X / Garry Tan
- original_date: 2026-08-19
- captured_at: 2026-08-19T08:11:40.942Z
- kind: x

原始观点/摘要：If you want SF rent to be $10K/mo for a 1BR (you're a NIMBY landlord and you hate newcomers and young people) only then would you vote for Connie Chan The Dem machine smokescreen to try to force Chan into Congress is shameless and must be repudiated https://t.co/or2fLiytUw

President & CEO @ycombinator · Founder @garryslist’Creator of GStack & GBrain’designer/engineer who helps founders’SF Dem accelerating the boom loop

likes=306; retweets=6; replies=23

## BP-20260819-19｜Garry Tan｜Many such cases https://t.co/l6Oe80d10f

- stable_id: `BP-20260819-19`
- source_path: `follow-builders`
- source_url: `https://x.com/garrytan/status/2089850288840794596`
- source_name: follow-builders / X / Garry Tan
- original_date: 2026-08-18
- captured_at: 2026-08-19T08:11:40.942Z
- kind: x

原始观点/摘要：Many such cases https://t.co/l6Oe80d10f

President & CEO @ycombinator · Founder @garryslist’Creator of GStack & GBrain’designer/engineer who helps founders’SF Dem accelerating the boom loop

likes=95; retweets=6; replies=10

## BP-20260819-20｜Zara Zhang｜I don’t know why anyone would learn Claude Code by reading a book, but apparently it’s a t

- stable_id: `BP-20260819-20`
- source_path: `follow-builders`
- source_url: `https://x.com/zarazhangrui/status/2089940315268645373`
- source_name: follow-builders / X / Zara Zhang
- original_date: 2026-08-19
- captured_at: 2026-08-19T08:11:40.942Z
- kind: x

原始观点/摘要：I don’t know why anyone would learn Claude Code by reading a book, but apparently it’s a thing in Japan https://t.co/NlOttUCdD4

Builder. Make something people want, then make people want it. Harvard17. GitHub: https://t.co/KCuEaje1wd YouTube: https://t.co/8xzbGWsHgY

likes=98; retweets=4; replies=34

## BP-20260819-21｜Nikunj Kothari｜Life honestly gets a lot simpler if you treat it as if nobody owes you a damn thing. Too m

- stable_id: `BP-20260819-21`
- source_path: `follow-builders`
- source_url: `https://x.com/nikunj/status/2089870745174446217`
- source_name: follow-builders / X / Nikunj Kothari
- original_date: 2026-08-19
- captured_at: 2026-08-19T08:11:40.942Z
- kind: x

原始观点/摘要：Life honestly gets a lot simpler if you treat it as if nobody owes you a damn thing. Too many people playing finite games when there’s many infinite games to play. Do good by people and life (and karma) takes care of itself.

partner @fpvventures - investing in seed/A. previous: early hire @meter, @opendoor, @atlassian & others. love @shimoleejhaveri + ????

likes=182; retweets=13; replies=6

## BP-20260819-22｜Peter Steinberger｜512GB RAM Studios. Apple was good to us. ?? https://t.co/NyvtNH6lRa

- stable_id: `BP-20260819-22`
- source_path: `follow-builders`
- source_url: `https://x.com/steipete/status/2089877190422974974`
- source_name: follow-builders / X / Peter Steinberger
- original_date: 2026-08-19
- captured_at: 2026-08-19T08:11:40.942Z
- kind: x

原始观点/摘要：512GB RAM Studios. Apple was good to us. ?? https://t.co/NyvtNH6lRa

Polyagentmorous ClawFather. Came back from retirement to mess with AI and help a lobster take over the world. @OpenClaw?? + @OpenAI

likes=3294; retweets=36; replies=196

## BP-20260819-23｜Peter Steinberger｜pssst, you wake the cli people that will give you $reasons why this can’t work. I was one 

- stable_id: `BP-20260819-23`
- source_path: `follow-builders`
- source_url: `https://x.com/steipete/status/2089804281331548280`
- source_name: follow-builders / X / Peter Steinberger
- original_date: 2026-08-18
- captured_at: 2026-08-19T08:11:40.942Z
- kind: x

原始观点/摘要：pssst, you wake the cli people that will give you $reasons why this can’t work. I was one of them before I saw the light. https://t.co/yBWXIT0Uvk

Polyagentmorous ClawFather. Came back from retirement to mess with AI and help a lobster take over the world. @OpenClaw?? + @OpenAI

likes=209; retweets=7; replies=23

## BP-20260819-24｜Peter Steinberger｜The irony. https://t.co/KH930Y7H9t https://t.co/VVSDo0ehUh

- stable_id: `BP-20260819-24`
- source_path: `follow-builders`
- source_url: `https://x.com/steipete/status/2089801681014043122`
- source_name: follow-builders / X / Peter Steinberger
- original_date: 2026-08-18
- captured_at: 2026-08-19T08:11:40.942Z
- kind: x

原始观点/摘要：The irony. https://t.co/KH930Y7H9t https://t.co/VVSDo0ehUh

Polyagentmorous ClawFather. Came back from retirement to mess with AI and help a lobster take over the world. @OpenClaw?? + @OpenAI

likes=252; retweets=12; replies=21

## BP-20260819-25｜Dan Shipper｜I can reliably tell im hitting a deeper point in a meditation because my nose clears compl

- stable_id: `BP-20260819-25`
- source_path: `follow-builders`
- source_url: `https://x.com/danshipper/status/2089877888396906801`
- source_name: follow-builders / X / Dan Shipper
- original_date: 2026-08-19
- captured_at: 2026-08-19T08:11:40.942Z
- kind: x

原始观点/摘要：I can reliably tell im hitting a deeper point in a meditation because my nose clears completely This checks out https://t.co/1hML8Wxa1b

ceo @every | the only subscription you need to stay at the edge of AI

likes=34; retweets=0; replies=2

## BP-20260819-26｜Dan Shipper｜we asked @ajambrosino to send us his thesis for the future of work after automation he rep

- stable_id: `BP-20260819-26`
- source_path: `follow-builders`
- source_url: `https://x.com/danshipper/status/2089788656445734922`
- source_name: follow-builders / X / Dan Shipper
- original_date: 2026-08-18
- captured_at: 2026-08-19T08:11:40.942Z
- kind: x

原始观点/摘要：we asked @ajambrosino to send us his thesis for the future of work after automation he replied with only one word: "tibo" https://t.co/dQWY99c8PL

ceo @every | the only subscription you need to stay at the edge of AI

likes=19; retweets=3; replies=3

## BP-20260819-27｜Aditya Agarwal｜I was talking to someone about @travisk today And I was reflecting that there was no one e

- stable_id: `BP-20260819-27`
- source_path: `follow-builders`
- source_url: `https://x.com/adityaag/status/2089845563097563604`
- source_name: follow-builders / X / Aditya Agarwal
- original_date: 2026-08-18
- captured_at: 2026-08-19T08:11:40.942Z
- kind: x

原始观点/摘要：I was talking to someone about @travisk today And I was reflecting that there was no one else on this earth who could have had the resilience to make sure that I can go from Point A to Point B in almost every global city No one else in Silicon Valley had the guts. He did. TY.

General Partner @SPC, Co-Founder @Bevel_Health | Ex: Early Eng @facebook, CTO @Dropbox, Board @Flipkart | Optimist, Builder, Dad

likes=357; retweets=7; replies=19

## BP-20260819-28｜Sam Altman｜(We still expect to ship great new models soon; this impacts further-out releases.)

- stable_id: `BP-20260819-28`
- source_path: `follow-builders`
- source_url: `https://x.com/sama/status/2089805495783813196`
- source_name: follow-builders / X / Sam Altman
- original_date: 2026-08-18
- captured_at: 2026-08-19T08:11:40.942Z
- kind: x

原始观点/摘要：(We still expect to ship great new models soon; this impacts further-out releases.)

AI is cool i guess

likes=2571; retweets=105; replies=196

## BP-20260819-29｜Sam Altman｜We have paused some frontier RL training to ensure that we can meet the appropriate alignm

- stable_id: `BP-20260819-29`
- source_path: `follow-builders`
- source_url: `https://x.com/sama/status/2089787807611195475`
- source_name: follow-builders / X / Sam Altman
- original_date: 2026-08-18
- captured_at: 2026-08-19T08:11:40.942Z
- kind: x

原始观点/摘要：We have paused some frontier RL training to ensure that we can meet the appropriate alignment, security and monitoring standards for the new level of capabilities in front of us. Model progress is now extremely rapid, and we always said we would take action if we felt that model capabilities were outstripping the pace of safety and alignment. We care very deeply about AI safety. We believe the entire field will have to coordinate on shared safety standards, but will act unilaterally in the meantime. We expect confidence in safety to increasingly set the pace of AI progress. We are optimistic about the alignment work we are doing, and we remain committed to making frontier capabilities widely available. https://t.co/51kvKfbfrO

AI is cool i guess

likes=8100; retweets=613; replies=1303

## BP-20260819-30｜Sam Altman｜excited to work together on this. thank you jensen! https://t.co/sxWXpQelYj

- stable_id: `BP-20260819-30`
- source_path: `follow-builders`
- source_url: `https://x.com/sama/status/2089758522678657212`
- source_name: follow-builders / X / Sam Altman
- original_date: 2026-08-18
- captured_at: 2026-08-19T08:11:40.942Z
- kind: x

原始观点/摘要：excited to work together on this. thank you jensen! https://t.co/sxWXpQelYj

AI is cool i guess

likes=3899; retweets=186; replies=277

## BP-20260819-31｜Claude｜Claude can now send emails in Gmail and manage files in Google Drive. Ask Claude to reply 

- stable_id: `BP-20260819-31`
- source_path: `follow-builders`
- source_url: `https://x.com/claudeai/status/2089806039088517356`
- source_name: follow-builders / X / Claude
- original_date: 2026-08-18
- captured_at: 2026-08-19T08:11:40.942Z
- kind: x

原始观点/摘要：Claude can now send emails in Gmail and manage files in Google Drive. Ask Claude to reply to a thread, and it drafts and sends the response. You control when it needs your approval. Connect Gmail or Google Drive from the connectors menu to try. Available on all paid plans. https://t.co/cFZEjh3MgB

Claude is an AI assistant built by @anthropicai to be safe, accurate, and secure. Talk to Claude on https://t.co/ZhTwG8dz3D or download the app.

likes=7255; retweets=467; replies=373

## BP-20260819-32｜Claude｜Claude Cowork is now available on mobile and web for all paid plans. https://t.co/sdWVjEeh

- stable_id: `BP-20260819-32`
- source_path: `follow-builders`
- source_url: `https://x.com/claudeai/status/2089756371570900999`
- source_name: follow-builders / X / Claude
- original_date: 2026-08-18
- captured_at: 2026-08-19T08:11:40.942Z
- kind: x

原始观点/摘要：Claude Cowork is now available on mobile and web for all paid plans. https://t.co/sdWVjEehcR

Claude is an AI assistant built by @anthropicai to be safe, accurate, and secure. Talk to Claude on https://t.co/ZhTwG8dz3D or download the app.

likes=5554; retweets=365; replies=410

## BP-20260819-33｜Anthropic Engineering｜How we contain Claude across products

- stable_id: `BP-20260819-33`
- source_path: `follow-builders`
- source_url: `https://www.anthropic.com/engineering/how-we-contain-claude`
- source_name: follow-builders / blog / Anthropic Engineering
- original_date: unknown
- captured_at: 2026-08-19T08:11:40.942Z
- kind: blog

原始观点/摘要：本轮未抓到可用文本摘要（可能受限于采集权限或接口）。

## BP-20260819-34｜Claude Blog｜Claude Code now supports artifacts

- stable_id: `BP-20260819-34`
- source_path: `follow-builders`
- source_url: `https://claude.com/blog/artifacts-in-claude-code`
- source_name: follow-builders / blog / Claude Blog
- original_date: unknown
- captured_at: 2026-08-19T08:11:40.942Z
- kind: blog

原始观点/摘要：本轮未抓到可用文本摘要（可能受限于采集权限或接口）。

## BP-20260819-35｜Training Data｜Rich Sutton and Khurram Javed: Why AI Models Stop Learning, and How to Start It Again

- stable_id: `BP-20260819-35`
- source_path: `follow-builders`
- source_url: `https://www.youtube.com/watch?v=xH7U7w9Qzlo`
- source_name: follow-builders / podcast / Training Data
- original_date: 2026-08-18
- captured_at: 2026-08-19T08:11:40.942Z
- kind: podcast

原始观点/摘要：Speaker 1 | 00:00 - 00:14 People think I have a radical point of view sometimes. They start questions saying how what I'm thinking is so different from everyone else. But I don't see it that way at all. I see it as like I'm thinking the ordinary way. Just everyone else is thinking a bit weird. Speaker 1 | 00:17 - 00:35 And I mean that like, you know, it's just the recent times people are thinking weird. Before there was all this AI craziness, you talk about you wouldn't have to say continual learning because it wouldn't make any sense to talk about learning that wasn't continual. All learning is continual. We always act and we learn. That's just the normal way of thinking. Speaker 1 | 00:35 - 00:41 I'm not weird. The field is weird. The field, they need to call it continual learning. It's just learning. Speaker 2 | 00:59 - 01:16 We are honored to have the great Rich Sutton with us here today. Rich, you invented reinforcement learning. You wrote the seminal textbook. You're the key students in the field, folks like Dave Silver. You wrote the essay, The Bitter Lesson, that I believe is the bible of the field. Speaker 2 | 01:16 - 01:33 You have just been one of the greats in propelling the field forward. So thank you for taking the time to join us today. Rich is joined by Kurram Javed, his cofounder, and former student from the University of Alberta. The two of you have set off to found Oak Lab. I'm very excited to talk to you about that today. Speaker 2 | 01:33 - 02:09 So for today's session, we're gonna start talking about the bitter lesson, the state of the world as we know it today, whether LLMs will get us there or not, and then we're gonna transition to start talking about your your research agenda and your plan for Oak. Rich, maybe take us back. I was going to start with a bitter lesson, but I actually want to start earlier than that. Decades ago, you decided to dedicate your career to reinforcement learning, to deep reinforcement learning in particular, and you established the University of Alberta as a bastion of that back when I think the field was very much in its infancy. What gave you the conviction to do that? Speaker 1 | 02:09 - 02:26 What else are y

