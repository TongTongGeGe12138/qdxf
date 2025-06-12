import type { ProjectListResult, PurchaseListResult } from '@/api/model/detailModel';
import { request } from '@/utils/request';

// 通用响应接口
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 定义请求参数类型
interface LoginParams {
  username?: string;
  password?: string;
  phone?: string;
  code?: string;
}

interface UserProfileParams {
  nickname?: string;
  avatar?: string;
  email?: string;
  [key: string]: any;
}

interface PasswordParams {
  oldPassword?: string;
  newPassword: string;
  code?: string;
  phone?: string;
}

// 用户消息相关参数
interface UserMessageParams {
  page?: number;
  pageSize?: number;
  type?: string;
}

// 用户资源相关参数
interface ResourceSummaryParams {
  userId?: string;
  resourceType?: string;
  startDate?: string;
  endDate?: string;
}

const Api = {
  UserCenterRegister: '/signup',
  UserCenterSendCodeUrl: '/auth/signin/phone',
  UserCenterPostSendCodeUrl: '/signup/phone',
  UserCenterLoginUrl: '/auth/signin',
  UserCenterCodeLoginUrl: '/auth/signin/phone',
  UserLoginOutUrl: '/auth/signout',
  UserRefreshUrl: '/auth/token/refresh',
  UserCenterUploadHeaderUrl: '/user-center/login',
  UserCenterGetUserInfoUrl: '/my/profile',
  UserCenterUpdatePwdUrl: '/account/password',
  UserUpdateAvatarUrl: '/my/profile/avatar',
  UserDeleteAvatarUrl: '/my/profile/avatar',
  PurchaseList: '/get-purchase-list',
  ProjectList: '/get-project-list',
  passwordEditSandCodeUrl: '/account/password/phone',
  ProIdentityList: '/user-center/pro-identity-list',
  UserCenterGetUserRelatedInfoUrl: '/auth/user',
  UserCenterGetUserMessageListUrl: '/user-center/messages',
  UserCenterUpdateUserInfoUrl: '/user-center/profile',
  UserCenterGetUserMessageDetailUrl: '/user-center/message-detail',
  UserCenterDeleteUserMessagesUrl: '/user-center/messages/delete',
  UserCenterBuyScoreUrl: '/user-center/buy-score',
  UserCenterGetUserResourceSummarysUrl: '/user-center/resource-summarys',
  StashTokenUrl: '/auth/token/stash',
  SessionidStashTokenUrl: '/auth/signin/session',
};

/**
 * 发送验证码
 * @param phone 手机号码
 * @returns Promise<ApiResponse<boolean>>
 */
export function UserCenterSendCode(phone: string) {
  return request.post<ApiResponse<boolean>>({
    url: `${Api.UserCenterSendCodeUrl}/${phone}/code`,
  });
}

/**
 * 会话心跳检测
 * @param sessionid 会话ID
 * @returns Promise<ApiResponse<boolean>>
 */
export function addSessionid(sessionid: string) {
  return request.post<ApiResponse<boolean>>({
    url: `/session/${sessionid}/heartbeat`,
  });
}

/**
 * 用户注册
 * @param data 注册参数
 * @returns Promise<ApiResponse<any>>
 */
export function GetUserCenterRegister(data: LoginParams) {
  return request.post<ApiResponse<any>>({
    url: Api.UserCenterRegister,
    data,
  });
}

// 发送注册验证码
export function UserCenterPostSendCode(phone: string) {
  return request.post<ProjectListResult>({
    url: `${Api.UserCenterPostSendCodeUrl}${phone}/code`,
  });
}

// 登录(手机号/用户名+密码)
export function UserCenterLogin(data: LoginParams) {
  return request.post<ProjectListResult>({
    url: Api.UserCenterLoginUrl,
    data,
  });
}

// 登录(手机号+验证码)
export function UserCenterCodeLogin(data: LoginParams) {
  return request.post<ProjectListResult>({
    url: Api.UserCenterCodeLoginUrl,
    data,
  });
}

// 登出
export function UserLoginOut() {
  return request.post<ProjectListResult>({
    url: Api.UserLoginOutUrl,
  });
}

// 刷新授权token
export function UserRefresh(data: { refreshToken: string }) {
  return request.post<ProjectListResult>({
    url: Api.UserRefreshUrl,
    data,
  });
}

// 获取个人信息
export function UserCenterGetUserInfo() {
  return request.get<ProjectListResult>({
    url: Api.UserCenterGetUserInfoUrl,
  });
}

// 更新个人信息
export function UserCenterUpdateUserInfo(data: UserProfileParams) {
  return request.post<ProjectListResult>({
    url: Api.UserCenterGetUserInfoUrl,
    data,
  });
}

// 修改密码
export function UserCenterUpdatePwd(data: PasswordParams) {
  return request.post<ProjectListResult>({
    url: Api.UserCenterUpdatePwdUrl,
    data,
  });
}

// 更新上传个人头像
export function UserUpdateAvatar(data: FormData) {
  return request.post<ProjectListResult>({
    url: Api.UserUpdateAvatarUrl,
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// 删除个人头像
export function UserDeleteAvatar() {
  return request.delete<ProjectListResult>({
    url: Api.UserDeleteAvatarUrl,
  });
}

// 获取暂存的token
export function getStashToken(id: string) {
  return request.get<ProjectListResult>({
    url: `${Api.StashTokenUrl}/${id}`,
  });
}

// Sessionid登录
export function getSessionidStashToken(id: string) {
  return request.post<ProjectListResult>({
    url: `${Api.SessionidStashTokenUrl}/${id}`,
  });
}

// 暂存的token
export function stashToken(data: any) {
  return request.post<ProjectListResult>({
    url: Api.StashTokenUrl,
    data,
  });
}

// 发送修改密码验证码
export function passwordEditSandCode(phone: string) {
  return request.post<ProjectListResult>({
    url: `${Api.passwordEditSandCodeUrl}/${phone}/code`,
  });
}

// 修改密码（通过手机号验证码）
export function passwordEdit(data: PasswordParams) {
  return request.post<ProjectListResult>({
    url: Api.passwordEditSandCodeUrl,
    data,
  });
}

// 绑定微信网站
export function wedBindWx(code: string) {
  return request.post<ProjectListResult>({
    url: `/account/wx-web/bind/${code}`,
  });
}

// 解绑微信网站
export function wedUnbindWx(code: string) {
  return request.post<ProjectListResult>({
    url: `/account/wx-web/unbind/${code}`,
  });
}

// 解绑微信(所有)账号
export function unbindWxAll() {
  return request.post<ProjectListResult>({
    url: `/account/wx/unbind`,
  });
}

// 发送绑定手机账号验证码
export function sendBindPhoneCode(phone: string) {
  return request.post<ProjectListResult>({
    url: `/account/phone/bind/phone/${phone}/code`,
  });
}

// 绑定/换绑手机号
export function bindPhone(data: { phone: string; code: string }) {
  return request.post<ProjectListResult>({
    url: `/account/phone/bind`,
    data,
  });
}

// 解绑手机号
export function unbindPhone() {
  return request.post<ProjectListResult>({
    url: `/account/phone/bind`,
  });
}

// 获取购买列表
export function getPurchaseList() {
  return request.get<PurchaseListResult>({
    url: Api.PurchaseList,
  });
}

// 获取项目列表
export function getProjectList() {
  return request.get<ProjectListResult>({
    url: Api.ProjectList,
  });
}

// 获取职业身份列表
export function GetProIdentityList() {
  return request.get<ProjectListResult>({
    url: Api.ProIdentityList,
  });
}

// 上传用户头像
export function UserCenterUploadHeader(formData: FormData) {
  return request.post<ProjectListResult>({
    url: Api.UserCenterUploadHeaderUrl,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// 获取用户相关信息
export function UserCenterGetUserRelatedInfo() {
  return request.get<PurchaseListResult>({
    url: Api.UserCenterGetUserRelatedInfoUrl,
  });
}

/**
 * 获取用户消息列表
 * @param data 查询参数
 * @returns Promise<ApiResponse<any>>
 */
export function UserCenterGetUserMessageList(data: UserMessageParams) {
  return request.post<ApiResponse<any>>({
    url: Api.UserCenterGetUserMessageListUrl,
    data,
  });
}

// 获取消息明细
export function UserCenterGetUserMessageDetail(data: any) {
  return request.post<ProjectListResult>({
    url: Api.UserCenterGetUserMessageDetailUrl,
    data,
  });
}

// 删除用户的消息
export function UserCenterDeleteUserMessages(data: any) {
  return request.post<ProjectListResult>({
    url: Api.UserCenterDeleteUserMessagesUrl,
    data,
  });
}

// 购买积分
export function UserCenterBuyScore(data: any) {
  return request.post<ProjectListResult>({
    url: Api.UserCenterBuyScoreUrl,
    data,
  });
}

/**
 * 获取用户资源列表信息
 * @param data 查询参数
 * @returns Promise<ApiResponse<any>>
 */
export function UserCenterGetUserResourceSummarys(data: ResourceSummaryParams) {
  return request.post<ApiResponse<any>>({
    url: Api.UserCenterGetUserResourceSummarysUrl,
    data,
  });
}

