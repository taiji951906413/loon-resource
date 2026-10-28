# Loon 资源库

自用的 Loon 插件、脚本和规则集。所有脚本自托管在本仓库，不依赖原作者仓库或第三方 CDN 的存活。

## 目录

```
loon-resource/
├── Plugin/                      插件本体
│   ├── fanqie.plugin            番茄系去广告
│   └── jingdong.plugin          京东去广告 + 历史比价
├── Script/                      插件引用的脚本
│   ├── fanqie_ad_filter.js      番茄信息流广告过滤
│   ├── jingdong_ad.js           京东去广告
│   ├── replace-body.js          京东极速版广告文案替换
│   ├── jd_price_mw418.js        慢慢买取CK + 详情通知版比价
│   ├── jd_price_wf021325.js     标题嵌入版 + 表格图比价
│   └── JingDong.price.js        折线图版比价
└── Rule/                        规则集
    └── Muse.lsr                 Meta Muse 分流
```

---

## 插件

安装方式：Loon → 配置 → 插件 → 右上角 `+` → 粘贴地址 → 保存。

### 番茄系去广告

拦截穿山甲广告 SDK 与埋点域名；信息流广告由远程脚本改写响应、剔除带广告标记的条目。
覆盖番茄小说 / 番茄畅听 / 红果短剧。

```
https://raw.githubusercontent.com/taiji951906413/loon-resource/refs/heads/main/Plugin/fanqie.plugin
```

### 京东去广告 + 历史比价

看商品时显示慢慢买的历史最低价，同时过滤京东广告。**仅支持京东标准模式**。

```
https://raw.githubusercontent.com/taiji951906413/loon-resource/refs/heads/main/Plugin/jingdong.plugin
```

首次使用需要取慢慢买 CK：**上滑杀掉慢慢买 App 进程** → 重新打开 → 点【我的】→
等 1～3 秒弹出「获取ck成功🎉」。后台挂着不会重新发请求，这步最容易漏。

---

## 规则集

### Muse.lsr

Meta 的 Muse 是 2026-09-08 上线的个人 AI 智能体 App，**仅美国区开放**。
国内直连 `meta.ai` 会被 Facebook 边缘节点返回 `403 Client challenge`。

在配置 `[Remote Rule]` 段加一行，`policy=` 后面填你要用的节点名（不需要新建策略组）：

```
https://raw.githubusercontent.com/taiji951906413/loon-resource/refs/heads/main/Rule/Muse.lsr,policy=你的节点名,enabled=true
```

规则内容（裸规则，不带策略）：`meta.ai`、`meta.com`、`fbcdn.net`、`facebook.com`、`fb.com`，
可选 `instagram.com`、`cdninstagram.com`、`whatsapp.com`、`whatsapp.net`。

最小可用只需 `meta.ai` + `fbcdn.net`。`facebook.com` 会影响别的 App 的第三方登录，谨慎加。

---

## 地址说明

所有引用都用 **GitHub 源地址**，不套 CDN 镜像：

```
https://raw.githubusercontent.com/taiji951906413/loon-resource/refs/heads/main/...
```

镜像（jsdelivr）虽然多一层缓存、看着快，但会引入额外故障点：文件刚更新时可能还在返回旧的 404，
而且不同节点同步时间不一致，排查起来很麻烦。GitHub 源只有一份，改完立刻生效。

Loon 拉取脚本/规则是走它自己的网络栈的，只要你的规则里 `githubusercontent.com` 走了代理就没问题。
如果哪天源地址拉不动，再临时换镜像，路径不变：

```
把 https://raw.githubusercontent.com/<owner>/<repo>/refs/heads/main/
换成 https://gcore.jsdelivr.net/gh/<owner>/<repo>@main/
```

---

## 前置条件

- iPhone / iPad，已装 Loon
- **已安装并信任 Loon 的 MITM 证书** —— 两个插件的 `[Script]` 都依赖它
  安装：Loon → 配置 → 证书 → 生成并安装 → iOS「设置」装描述文件 →
  通用 → 关于本机 → 证书信任设置 → 打开 Loon 的开关
- 只装证书不打开信任开关，等于没装

---

## 致谢

插件和脚本的原始作者：

- **番茄系去广告**：本仓库整理
- **京东去广告 + 比价**：RuCu6、Maasea、MuTu（githubdulong）、苍井灰灰（wf021325）、
  mw418、可莉、mieqq

本仓库只做脚本自托管和地址修复，业务逻辑未改动。
