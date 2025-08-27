import { request } from '@/utils/request'
import type { ProjectListResult } from '@/api/model/detailModel'

const Api = {
  ProjectUrl: '/team/project',
  ProjectFileUrl: '/team/project/resource',
  ProjectFileAddUrl: '/team/project/resource/file',
  TrashedUrl: '/team/project/resource/trashed',
}

// 获取项目列表（基于项目信息）（一级）
export function getProjectFolderList() {
  return request.get<ProjectListResult>({ url: Api.ProjectUrl })
}

// 创建项目（文件夹形式）（一级）
export function addProjectFolder(data: any) {
  return request.post<ProjectListResult>({ url: Api.ProjectUrl, data })
}

// 获取移动到事件项目列表（基于项目根资源）（一级）
export function getMoveFolderList() {
  return request.get<ProjectListResult>({ url: `${Api.ProjectFileUrl}?all=true&folders=true` })
}

// 获取项目列表（基于项目根资源）（一级）
export function getProjectFile(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.ProjectFileUrl}?page=${data.page || 1}&pageSize=${data.pageSize || 10}&search=${
      data.search || ''
    }&folders=${data.folders || false}`,
  })
}

// 获取项目信息（根据项目id）（一级）
export function getProjectFoldeInfo(projectId: any) {
  return request.get<ProjectListResult>({ url: `${Api.ProjectUrl}/${projectId}` })
}

// 修改项目信息（根据项目id）（一级）
export function editProjectFoldeInfo(data: any) {
  return request.post<ProjectListResult>({ url: `${Api.ProjectUrl}/${data.projectId}`, data })
}

// 删除项目（根据项目id）（一级）
export function deleteProjectFolder(projectId: any) {
  return request.delete<ProjectListResult>({ url: `${Api.ProjectUrl}/${projectId}` })
}

// 创建项目（文件上传形式）（一级）
export function addProjectFile(data: any) {
  return request.post<ProjectListResult>({
    url: Api.ProjectFileAddUrl,
    data,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// 获取项目资源（根据项目id）（二级）
export function getProjectResource(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/resource?page=${data.page || 1}&pageSize=${data.pageSize || 10}&search=${
      data.search || ''
    }`,
  })
}

// 创建项目资源文件夹（二级）
export function addProjectResource(data: any) {
  return request.post<ProjectListResult>({ url: `${Api.ProjectUrl}/${data.projectId}/resource/folder/name/${data.name}` })
}

// 重命名项目资源文件夹（二级）: 接口未实现
export function editProjectResource(data: any) {
  return request.put<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/resource/folder/${data.folderId}/name/${data.name}`,
  })
}

// 删除项目资源文件夹（二级）
export function deleteProjectResource(data: any) {
  return request.delete<ProjectListResult>({ url: `${Api.ProjectUrl}/${data.projectId}/resource/folder/${data.folderId}` })
}

// 上传项目资源文件（根据项目id和文件夹id）（二级）
export function addProjectResourceFile(data: any) {
  return request.post<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/resource/folder/${data.folderId}/file`,
    data,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// 创建项目资源文件夹（n级）
export function addThirdResource(data: any) {
  return request.post<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/resource/folder/${data.folderId}/name/${data.name}`,
  })
}

// 获取项目资源（根据项目id和文件夹id）（n级）
export function getProjectResourceFile(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/resource/${data.folderId}?page=${data.page || 1}&pageSize=${
      data.pageSize || 10
    }&search=${data.search || ''}`,
  })
}

// 获取项目资源文件信息（n级）
export function getProjectResourceFileInfo(data: any) {
  return request.get<ProjectListResult>({ url: `${Api.ProjectUrl}/${data.projectId}/resource/file/${data.fileId}` })
}

// 下载项目资源文件（n级）
export function downProjectResourceFile(data: any) {
  return request.get({ url: `${Api.ProjectUrl}/${data.projectId}/resource/file/${data.fileId}/content`, responseType: 'blob' })
}

// 重命名项目资源文件
export function editProjectResourceFile(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/resource/file/${data.fileId}/name/${data.name}`,
  })
}

// 删除项目资源文件（n级）
export function deleteProjectResourceFile(data: any) {
  return request.delete<ProjectListResult>({ url: `${Api.ProjectUrl}/${data.projectId}/resource/file/${data.fileId}` })
}

// 把项目资源放入回收站
export function transhFile(data: any) {
  return request.post<ProjectListResult>({ url: `${Api.ProjectUrl}/${data.projectId}/resource/${data.id}/trash` })
}

// 把项目资源从回收站恢复
export function recoverFile(data: any) {
  return request.post<ProjectListResult>({ url: `${Api.ProjectUrl}/${data.projectId}/resource/trashed/${data.id}/recover` })
}

// 获取回收站项目资源
export function getTrashedList(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.TrashedUrl}?page=${data.page || 1}&pageSize=${data.pageSize || 10}&search=${
      data.search || ''
    }&all=true${data.createdFrom ? `&createdFrom=${data.createdFrom}` : ''}${
      data.createdTo ? `&createdTo=${data.createdTo}` : ''
    }`,
  })
}

// 验证文件名是否有重名
export function getNameInspect(data: any) {
  return request.get<ProjectListResult>({ url: `${Api.ProjectFileUrl}/folder/${data.folderId}/${data.name}/id` })
}

// ================= 成员相关 =================

// 获取项目成员列表（根据项目id）
export function getMemberList(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/member/list?page=${data.page || '1'}&pageSize=${data.pageSize || '10'}${
      data.search ? `&search=${data.search}` : ''
    }`,
  })
}

// 获取项目成员信息（根据项目id和成员id）
export function getMemberInfo(data: any) {
  return request.get<ProjectListResult>({ url: `${Api.ProjectUrl}/${data.projectId}/member/${data.memberId}` })
}

// 删除项目成员（根据项目id和成员id）
export function deleteMember(data: any) {
  return request.delete<ProjectListResult>({ url: `${Api.ProjectUrl}/${data.projectId}/member/${data.memberId}` })
}

// 邀请项目成员（根据项目id和成员id）
export function addMember(data: any) {
  return request.post<ProjectListResult>({ url: `${Api.ProjectUrl}/${data.projectId}/member/${data.memberId}/invite`, data })
}

// 查询邀请列表（根据项目id，可搜索）
export function inviteMember(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/member/invite${data.search ? `?search=${data.search}` : ''}`,
  })
}

// 更新项目成员权限（根据项目id和成员id）
export function upPermissionMember(data: any) {
  return request.post<ProjectListResult>({ url: `${Api.ProjectUrl}/${data.projectId}/member/${data.memberId}/permission`, data })
}

// 获取正在被邀请的项目
export function getInvitingList() {
  return request.get<ProjectListResult>({ url: `${Api.ProjectUrl}/inviting/list` })
}

// 接受项目邀请(根据项目id)
export function acceptInvite(projectId: any) {
  return request.post<ProjectListResult>({ url: `${Api.ProjectUrl}/${projectId}/member/invite/accept` })
}

// 拒绝项目邀请(根据项目id)
export function rejectInvite(projectId: any) {
  return request.post<ProjectListResult>({ url: `${Api.ProjectUrl}/${projectId}/member/invite/reject` })
}

// ================= 任务相关 =================

// 获取项目任务列表(根据项目id)
export function getTaskList(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/task/list?page=${data.page || '1'}&pageSize=${data.pageSize || '1000'}${
      data.name ? `&name=${data.name}` : ''
    }${data.status !== null && data.status !== undefined ? `&status=${data.status}` : ''}${
      data.assigneeId ? `&assigneeId=${data.assigneeId}` : ''
    }`,
  })
}

// 获取项目任务(根据项目id和任务id)
export function getTaskInfo(data: any) {
  return request.get<ProjectListResult>({ url: `${Api.ProjectUrl}/${data.projectId}/task/${data.taskId}` })
}

// 更新项目任务(根据项目id和任务id)
export function editTaskInfo(data: any) {
  return request.post<ProjectListResult>({ url: `${Api.ProjectUrl}/${data.projectId}/task/${data.taskId}`, data })
}

// 更新项目任务进度(根据项目id和任务id)
export function upDataTask(data: any) {
  return request.post<ProjectListResult>({ url: `${Api.ProjectUrl}/${data.projectId}/task/${data.taskId}/progress`, data })
}

// 删除项目任务(根据项目id和任务id)
export function deleteTask(data: any) {
  return request.delete<ProjectListResult>({ url: `${Api.ProjectUrl}/${data.projectId}/task/${data.taskId}` })
}

// 获取项目成员任务数统计
export function getTaskCount(projectId: any) {
  return request.get<ProjectListResult>({ url: `${Api.ProjectUrl}/${projectId}/task/summary/count-by-assignee` })
}

// 获取项目进度统计
export function getTaskProgress() {
  return request.get<ProjectListResult>({ url: `${Api.ProjectUrl}/task/summary/progress-by-project` })
}

// 创建项目任务
export function createdTask(data: any) {
  return request.post<ProjectListResult>({ url: `${Api.ProjectUrl}/${data.projectId}/task`, data })
}


