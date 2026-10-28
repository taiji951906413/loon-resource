/*
 * 慢慢买请求探针
 *
 * 作用：只要 Loon 拦截到 manmanbuy.com 的请求，就弹一条通知，告诉你
 *   - HTTP 方法
 *   - 完整 URL
 *   - body 长度（POST 才有）
 *
 * 两个用途：
 *   1) 连通性自检：Safari 打开 https://www.manmanbuy.com
 *      弹「✅ 链路正常」→ MITM 证书、脚本下载、域名拦截 全部 OK
 *      什么都不弹     → 证书没信任 / MitM 没开 / 脚本下载失败
 *   2) 抓真实请求：进慢慢买 App，看它到底请求了哪些 URL
 *
 * 每次访问 www.manmanbuy.com 首页都会重置记录，可反复测。
 * 同一个「方法+路径」只弹一次，最多 15 条，不会刷屏。
 */

const url = $request.url || '';
const method = $request.method || 'GET';
const body = $request.body || '';

const SEEN_KEY = 'mmb_probe_seen';
const isRoot = /^https?:\/\/(www\.)?manmanbuy\.com\/?(\?.*)?$/i.test(url);

if (isRoot) {
  // 访问首页 = 重置并确认链路
  $persistentStore.write('', SEEN_KEY);
  $notification.post('✅ 链路正常', 'MITM + 脚本下载 + 域名拦截 都通了', '现在进慢慢买 App，点【我的】，看探针抓到什么');
  $done({});
} else {
  const pathOnly = url.replace(/\?.*$/, '');
  const sig = method + ' ' + pathOnly;
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
}
