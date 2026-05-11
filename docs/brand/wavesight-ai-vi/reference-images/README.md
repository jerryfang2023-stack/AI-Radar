# 观澜AI｜VI 规范源图

本目录保存用户提供的四张 VI 规范源图，供后续拆解 SVG、页面验收和设计复核时对照使用。

| 文件 | 对应规范 |
|---|---|
| `visual-identity-system.png` | 品牌视觉识别系统 |
| `site-design-system-page-templates.png` | 网站设计系统、组件、页面模板 |
| `business-brief-symbols-elements.png` | 商业内参符号与信息元素规范 |
| `motion-interaction-guidelines.png` | 动效与交互规范 |

执行要求：

- 不从源图直接裁切当作正式组件。
- 需要落地到页面或组件库时，必须拆成 `../executable-svg/` 中的单项 SVG。
- 新增拆解项时，应同步更新 `../executable-svg/manifest.json` 和 `../executable-svg/README.md`。
