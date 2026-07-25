# Arcade.dev Raises $60M Series A

- 中文标题：Arcade.dev 完成 6000 万美元 A 轮融资
- 来源：Arcade.dev
- 原始链接：https://www.arcade.dev/blog/arcade-series-a/
- 抓取时间：2026-07-25T10:00:00.000Z
- 回填任务：BFQ-adbc7c1845065695

## 原始正文

Arcade.dev Raises $60M Series A
Product Pricing Start Building Browse the Catalog Build
Tool Patterns MCP Framework LangChain Fleet
Resources Docs Blog White Papers Webinars Onsite Workshop
Careers Sign in Book a demo
Product Pricing Start Building Browse the Catalog Build
Tool Patterns MCP Framework LangChain Fleet
Resources Docs Blog White Papers Webinars Onsite Workshop
Careers Sign in Book a demo
We saw the action layer coming. Now we're going to own it.
Alex Salazar
JUNE 12, 2026
6 MIN READ
COMPANY NEWS
$60M Series A, led by SYN Ventures, with strategic investment from Morgan Stanley and Wipro. Jay Leek joins our board.
Arcade.dev just raised $60 million in Series A funding. Combined with our seed, that brings our total financing to $72 million. The round was led by SYN Ventures, with strategic investment from Morgan Stanley and Wipro. Jay Leek is joining our board.
We raised it because we’re solving the number one problem in AI right now.
The demos work. Production doesn’t.
Nobody wants to be this generation’s Blockbuster. Every advantage, and still too slow to make the jump before a faster competitor took the market. So companies build, the demos impress, and then they try to ship and everything breaks.
Agents don’t fail because the models aren’t powerful. The models are incredible, and getting better at an exponential rate. For most of what an enterprise wants, they’re already good enough. Agents fail because nobody can prove that this agent, on behalf of this user, can perform this action on this resource.
That’s the problem Arcade solves.
The bottleneck moved to the action layer
For the last few years, everyone focused on the reasoning layer, the model, the brains of the agent. The models caught up, and that problem was solved. The harder one now is the action layer: how an agent reaches into your business systems and actually does something, securely and controlled. Send the email. Move the money. Update the record. Pull the customer file.
That’s our problem statement. That’s what we own.
It’s also where the ROI lives. A model that reasons brilliantly but can’t safely act earns nothing. The payoff starts the moment an agent takes a real action in production, against the systems that run the business.
We do three things on every agent action: enforce, execute, govern. We collapse all three into one layer.
Enforce. At the moment of action, every call is checked against your policy and the user’s real permissions. The agent gets exactly the access its user has, and only for the action it’s taking right now. No standing permissions. No overprivileged service accounts. No blast radius when a model gets something wrong.
Execute. Reliability comes from tools built for the way agents actually work, not thin wrappers around an API. We ship more than 8,000 agent-optimized tools. The agent says “make the intro friendlier.” Our tools handle the segment, the index, the exact text. Fewer failed actions. Lower token bills.
Govern. Every action leaves a record: which agent, on behalf of which user, against which resource. One control plane, exportable to whatever your security team already runs.
We’ve built this before
Our team is a rare combination. People who’ve been at the forefront of what agents can do, paired with a deep bench who’ve been solving infrastructure, governance, and security problems at some of the world’s largest companies. We have alumni from Okta, Redis, MongoDB, Snowflake, Airbyte, and Microsoft. Arcade is the next iteration of that work, built for the agentic era.
That mix produced a product nothing else matches. We authored the MCP authorization specification that made tool-based authorization possible, now adopted by Anthropic and the major MCP clients and servers. We’re the only secure action layer running in production at some of the world’s largest banks, industrials, and pharmaceutical companies. Tool call volume on Arcade is up 25x in the last six months. We’ve shipped more tools built for delegated user authorization and governance than the rest of the ecosystem combined.
And it compounds. Once a customer gets their first agent live on Arcade, the second ships with a fraction of the work. The third and fourth follow with less effort each time, until shipping a new agent is routine.
Everyone else is AI-washing old infrastructure
Now that the opportunity is obvious, everyone is running at it. Good. That’s how you know the category is real. But look at who’s running, and most of them are AI-washing a product they built for a different era.
Start with the API gateway vendors. They’re solving a networking problem. They route traffic. Routing traffic isn’t authorizing an action, executing it reliably, or proving who did what. A gateway doesn’t know whether this user is allowed to do this thing.
Then the identity vendors. They’re solving an authentication problem. They prove who you are. But an agent action isn’t about who you are. It’s about what you’re permitted to do, on which system, at this exact moment. Permissions have to be tied to the action itself. Identity systems weren’t built that way, so they’re coming at this from the wrong end.
These are established companies with real businesses. Neither was built for this, and big incumbents are slow. By the time they turn the ship, the standard is already set.
Control can’t live inside the agent
Look at how control works everywhere else in the enterprise. The thing taking an action never gets to authorize itself or write its own audit log. Applications don’t grant their own permissions. Traders don’t approve their own trades. An independent control sits to the side and decides what’s allowed. Agents are no different. What an agent is allowed to do has to be decided outside the agent itself. A smarter model doesn’t change that. Reasoning and control are different jobs.
It also has to be neutral. Every enterprise runs more than one client and more than one model. Copilot in one workflow. Codex in another. Claude somewhere else. Custom agents your own teams build. Governance owned by any single model vendor only covers that vendor’s agents. Add a second, and your control layer has a hole in it. The only thing that holds is a layer that’s agnostic to all of them and governs each one the same way. Same authorization. Same audit trail. One place to enforce them.
This is why we partner with the model companies and the hyperscalers instead of competing with them. They build the best reasoning in the world. We make their agents safe to run inside a real business. We authored the MCP authorization spec that Anthropic adopted. We work with the clients and frameworks your teams already use, from Codex to Claude Code to whatever your engineers build next. We deploy into your own cloud, on AWS, Azure, or GCP, or on-prem, and we sit on top of the identity and entitlement systems you already run, like Okta, Entra, and SailPoint.
That’s the deal. They reason, we govern. The outcome is an agent your security team will actually approve for production.
We’re not slowing down
Every CIO, head of AI, and CISO is now grappling with the same question: how do you let agents act inside the company without losing control of what they do? Whether they run over MCP, A2A, skills, or whatever protocol comes next, the problem underneath is identical.
The answer is obvious now, and we have a two-year head start on everyone just starting to realize how big it is. We’re not slowing down. The $60 million is to accelerate: more tools, deeper governance, broader reach, and faster, more powerful releases, so no one can catch up.
Every serious enterprise agent deployment is going to run through a layer like this. We intend for it to be ours.
If your organization is trying to get agents into production, agents that do real work without handing over the keys to your business, we’d love to talk. My DMs are open.
Alex Salazar, Co-founder and CEO, Arcade
SHARE THIS POST
Last updated on June 12, 2026
Copy link
RECENT ARTICLES
JULY 23, 2026
THOUGHT LEADERSHIP
Session IDs Are Going Away. Here's What Breaks & What You Can Finally Build
The new MCP release moves the core protocol from stateful to stateless, and session IDs are going away. Here's what breaks when you run MCP servers or gateways in production, what finally gets simpler, and how Arcade.dev lets you migrate on your own schedule.
JULY 23, 2026
PRODUCT RELEASE
New Toolkit Round-Up: Power BI, Postman, Fireflies & More
In July alone, Arcade.dev shipped four new agent-optimized toolkits — Power BI, Postman, Fireflies, and Insightly — plus upgrades to Gmail, Excel, Outlook, and Linear. Here's what your agents can do now that they couldn't a month ago.
JULY 22, 2026
THOUGHT LEADERSHIP
MCP Extensions Are Now Official. So Is Fragmentation.
The new MCP release gives extensions an official track, with their own release cadence and versioning. Good for a thin, stable core, but it formalizes fragmentation into a growing support matrix. Here's what changes and how a gateway helps.
Get early access to Arcade, and start building now.
Sign up now
Docs
© 2025 Arcade AI, Inc.
All rights reserved.
Pricing
Blog
Arcade vs Composio
Docs
Privacy policy
Terms of service
Cookie settings
Careers
Contact Sales
Status
Github
LinkedIn
Discord
X (formerly Twitter)
