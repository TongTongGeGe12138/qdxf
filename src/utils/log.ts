// npm i tencentcloud-cls-sdk-js-web 安装依赖 --force
// 指定页面引用 import { logPost } from '@/tracklog';
// 指定页面发起请求，例：logPost({ event: 'PAGE_VIEW', path: route.path, params: route.query })
import { AsyncClient, Log, LogGroup, PutLogsRequest } from 'tencentcloud-cls-sdk-js-web';

import { useUserStore } from '@/stores/user';
// endpoint 接口地址 https://ap-nanjing.cls.tencentcs.com
const client = new AsyncClient({
  endpoint: import.meta.env.VITE_BASE_URL_LOG,
  retry_times: 10,
});
/* 
时间            事件-event       用户id-uid       平台-platform           其他参数
页面访问        PAGE_VIEW        当前用户id       gb/work/aigc/hive       path-路由配置，params-页面参数(如果有)
点击按钮        CLICK            同上             同上                    path-路由配置，id-按钮id，text-按钮名称(如果有)
登录            SIGN_IN          同上             同上
注册            SIGN_UP          无               同上                   utmSource-注册来源，phone-手机号
AIGC模块点击    AIGC_CLICK                                               category-模块分类(三级) xxx/xxx/xxx
*/
const platform = 'work'; // 平台
export const logPost = async (val: any) => {
  const logGroup = new LogGroup(window.origin);
  logGroup.setSource(window.origin);
  // import.meta.env.VITE_BASE_URL_LOG_TOPIC_ID  日志主题ID dccdd77a-dc5a-447c-a1ad-99c608395737
  const request = new PutLogsRequest(import.meta.env.VITE_BASE_URL_LOG_TOPIC_ID, logGroup);
  const log = new Log(Date.now());
  const userStore = useUserStore();
  const token = userStore.accessToken;
  const userId = decryptJWT(token).UserId;
  log.addContent('event', val.event);
  if (val.event !== 'SIGN_UP' && val.event !== 'AIGC_CLICK') {
    log.addContent('uid', userId.toString());
  }
  if (val.event !== 'AIGC_CLICK') {
    log.addContent('platform', platform.toString());
  }
  if (val.params) {
    log.addContent('params', JSON.stringify(val.params));
  }
  if (val.event === 'PAGE_VIEW' || val.event === 'CLICK') {
    log.addContent('path', val.path.toString());
  }
  if (val.id) {
    log.addContent('id', val.id.toString());
  }
  if (val.text) {
    log.addContent('text', val.text.toString());
  }
  if (val.utmSource) {
    log.addContent('utmSource', val.utmSource.toString());
  }
  if (val.phone) {
    log.addContent('phone', val.phone.toString());
  }
  if (val.category) {
    log.addContent('category', val.category.toString());
  }
  logGroup.addLog(log);
  await client.PutLogs(request);
};

/**
 * 解密 JWT token 的信息
 * @param token jwt token 字符串
 * @returns <any>object
 */
function decryptJWT(token: string): any {
  token = token.replace(/_/g, '/').replace(/-/g, '+');
  const json = decodeURIComponent(escape(window.atob(token.split('.')[1])));
  return JSON.parse(json);
}
