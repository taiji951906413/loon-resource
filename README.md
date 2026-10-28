# Loon 分流规则集

放 Loon 用的 `.lsr` 远程规则集，一个文件一组规则。

目前包含：

| 文件 | 作用 |
|---|---|
| `Muse.lsr` | 把 Meta Muse 及其依赖域名分流到指定节点 |

---

## Muse.lsr

Meta 的 **Muse** 是 2026-09-08 上线的个人 AI 智能体 App，**仅美国区开放**。
国内直连 `meta.ai` 会被 Facebook 边缘节点返回 `403 Client challenge`，必须走美国节点。

规则集里只放裸规则（不带策略名），策略由引用行统一指定：

```
DOMAIN-SUFFIX, meta.ai          # Muse 本体（网页版 www.meta.ai/muse）
DOMAIN-SUFFIX, meta.com
DOMAIN-SUFFIX, fbcdn.net        # 静态资源
DOMAIN-SUFFIX, facebook.com     # 账号体系
DOMAIN-SUFFIX, fb.com
DOMAIN-SUFFIX, cdninstagram.com # 可选：跨应用记忆
DOMAIN-SUFFIX, instagram.com
DOMAIN-SUFFIX, whatsapp.net     # 可选：WhatsApp 入口
DOMAIN-SUFFIX, whatsapp.com
```

### 用法

Loon 配置里找到 `[Remote Rule]` 段，加一行：

```
https://cdn.jsdelivr.net/gh/taiji951906413/loon-rules@main/Muse.lsr,policy=你的节点名,enabled=true
```

`policy=` 后面直接填**你打算用的节点名**，不需要新建策略组。也可以填已有的策略组名，
之后自己在组里手动切节点。名字要和 Loon 里显示的完全一致（含空格、emoji、大小写），
填错会被静默忽略，表现为规则不生效。

cdn.jsdelivr.net 拉不动就换镜像，内容一样：

```
https://gcore.jsdelivr.net/gh/taiji951906413/loon-rules@main/Muse.lsr,policy=你的节点名,enabled=true
https://fastly.jsdelivr.net/gh/taiji951906413/loon-rules@main/Muse.lsr,policy=你的节点名,enabled=true
```

### 不想用远程规则集

直接把这几行贴进本地 `[Rule]` 段，每条自带策略，效果一样：

```
DOMAIN-SUFFIX,meta.ai,你的节点名
DOMAIN-SUFFIX,meta.com,你的节点名
DOMAIN-SUFFIX,fbcdn.net,你的节点名
DOMAIN-SUFFIX,facebook.com,你的节点名
DOMAIN-SUFFIX,fb.com,你的节点名
```

### 最小可用集合

只要让 Muse 能打开，`meta.ai` + `fbcdn.net` 两条就够。
`facebook.com` / `fb.com` 建议谨慎加——很多 App 的第三方登录、分享、头像都依赖它们，
如果原本在「广告拦截 → REJECT」或「国内直连」分组里，全量改到美国节点会影响别的 App。

---

## 验证

1. Loon → 首页 → 打开「请求日志」
2. 手机浏览器访问 `https://www.meta.ai/muse`
3. 日志里找 `meta.ai`，看右侧策略是不是你填的节点
4. 打开 Muse App，进主界面不报「暂不可用 / 地区不支持」即为成功

若 `meta.ai` 走了 DIRECT → 检查 `[Remote Rule]` 那行的 URL 是否真能拉到（规则条数应为 9），
以及 `policy=` 的节点名有没有拼错。

---

## 两个前提

**1. 分流到美国 ≠ 能用。**
Muse 是美区独占产品，除网络外还需要：App Store 账号是美区（否则搜不到、下不了）、
账号本身是美区 Meta 账号；把 iPhone「地区」设成美国成功率更高。

**2. `raw.githubusercontent.com` 在国内不可达。**
所以引用地址用 jsdelivr，不要用 raw 链接。实测 `raw.githubusercontent.com`、`cdn.jsdelivr.net`
（部分网络）、`raw.githack.com`、`cdn.statically.io` 均可能失败；
`gcore.jsdelivr.net` / `fastly.jsdelivr.net` / `testingcf.jsdelivr.net` 更稳。

---

## 关于规则优先级

Loon 3.0.3 之后的匹配算法：

- **域名类规则永远优先于 IP 类规则**，命中域名规则后不再做 IP 匹配
  → 所以不用操心规则写在 `GEOIP,CN,DIRECT` 前面还是后面
- 其余同类型规则按书写顺序；优先级：**本地规则 > 插件中的规则 > 订阅规则**

也就是说订阅规则优先级最低。如果本地规则里已有覆盖 `meta.ai` 的条目，本地那条会赢。
