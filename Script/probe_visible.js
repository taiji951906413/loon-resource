/*
 * 可见性探针
 *
 * 触发后直接把百度首页的响应体替换成一段大字提示。
 * 这样不需要通知权限，脚本跑没跑一眼就能看出来：
 *   打开 baidu.com 看到「脚本执行正常」→ 脚本能跑，问题在别处
 *   百度正常显示                    → 脚本没被执行
 */

var now = '';
try {
  now = new Date().toLocaleString();
} catch (e) {
  now = '-';
}

try {
  $notification.post('探针生效', '百度首页已被替换', '脚本执行正常');
} catch (e) {}

var html =
  '<!DOCTYPE html><html><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>探针生效</title></head>' +
  '<body style="margin:0;padding:36px 24px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;' +
  'background:#0b1220;color:#e8eefc;line-height:1.8">' +
  '<div style="font-size:15px;color:#7dd3fc;letter-spacing:1px">LOON PROBE</div>' +
  '<h1 style="font-size:30px;margin:10px 0 22px">✅ 脚本执行正常</h1>' +
  '<p style="font-size:17px;margin:0 0 14px">Loon 能拦截这个域名，也能执行远程脚本。</p>' +
  '<div style="background:#16233b;border-radius:10px;padding:16px 18px;font-size:15px">' +
  '<div>脚本已运行</div>' +
  '<div style="color:#94a3b8;margin-top:6px">' + now + '</div>' +
  '</div>' +
  '<p style="font-size:15px;color:#94a3b8;margin-top:24px">' +
  '看到这一页，说明「拦截 + 脚本下载 + 脚本执行」三段全通。<br>' +
  '那取不到 CK 的原因就在别处，把这一页截图发我。</p>' +
  '</body></html>';

$done({
  body: html,
  headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store'
  }
});
