/*
 * 慢慢买请求探针
 * 作用：只要 Loon 拦截到 manmanbuy.com 的请求，就弹一条通知，告诉你
 *   - HTTP 方法
 *   - 完整 URL
 *   - body 长度（POST 才有）
 * 同一个「方法+路径」只弹一次，最多 15 条，不会刷屏。
 *
 * 用法：装上探针插件后，在 Safari 打开 https://www.manmanbuy.com
 *   - 弹通知 → MITM 和脚本下载都正常，问题在 App 的具体请求上
 *   - 不弹   → 证书/MITM/脚本下载有问题
 */

const url = $request.url || '';
const method = $request.method || 'GET';
const body = $request.body || '';

// 用「方法 + 去掉 query 的路径」做去重键
const pathOnly = url.replace(/\?.*$/, '');
const sig = method + ' ' + pathOnly;

const SEEN_KEY = 'mmb_probe_seen';
const seenRaw = $persistentStore.read(SEEN_KEY) || '';
const seen = seenRaw ? seenRaw.split('\n') : [];

if (seen.indexOf(sig) === -1 && seen.length < 15) {
  seen.push(sig);
  $persistentStore.write(seen.join('\n'), SEEN_KEY);

  const subtitle = method + (body ? '  body=' + body.length + 'B' : '  无body');
  const detail = url.length > 240 ? url.slice(0, 240) + '…' : url;
  $notification.post('慢慢买探针 #' + seen.length, subtitle, detail);
}

$done({});
