/*
 * 拦截链路探针（带对照组）
 *
 * 触发两个域名：
 *   www.baidu.com    → 对照组，任何手机都能打开
 *   *.manmanbuy.com  → 目标
 *
 * 判断：
 *   打开百度有通知、打开慢慢买没通知  → 插件机制正常，问题在 manmanbuy 的 MITM 或域名本身
 *   两个都没通知                      → 探针插件没生效（语法/未启用/脚本没下载）
 *   两个都有通知                      → 链路全通，回到比价插件查触发条件
 *
 * 最多弹 12 条，避免刷屏。
 */

var u = String($request.url || '');
var m = String($request.method || 'GET');
var blen = 0;
try {
  blen = $request.body ? String($request.body).length : 0;
} catch (e) {
  blen = -1;
}

var n = 0;
try {
  n = parseInt($persistentStore.read('mmb_probe_n') || '0', 10);
  if (isNaN(n)) n = 0;
} catch (e) {
  n = 0;
}

if (n < 12) {
  try {
    $persistentStore.write(String(n + 1), 'mmb_probe_n');
  } catch (e) {}
  $notification.post(
    '探针 #' + (n + 1),
    m + '  body=' + blen + 'B',
    u.length > 200 ? u.slice(0, 200) + '…' : u
  );
}

$done({});
