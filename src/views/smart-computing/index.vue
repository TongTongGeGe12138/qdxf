<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { isDark } from '../../utils/theme'
import { Refresh, UploadFilled, FolderAdd } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getMemberList, getProjectFoldeInfo, getProjectFile, addProjectFolder, getTaskList, createdTask } from '@/api/team'
import { getProvinceList, getCityList } from '@/api/location'
import ProjectDetailsAside from '@/components/ProjectDetailsAside.vue'

const title = ref('团队协同')
const navtitle = ref(['团队项目', '公共回收站'])
const activeIndex = ref(0)
const rightTabs = computed(() => {
  if (scMenuActive.value === 0) {
    return [ { name: '刷新', icon: Refresh }, { name: '上传', icon: UploadFilled }, { name: '新建', icon: FolderAdd } ]
  }
  if (scMenuActive.value === 1) {
    return [ { name: '邀请成员', icon: Refresh } ]
  }
  if (scMenuActive.value === 2) {
    return [ { name: '刷新', icon: Refresh }, { name: '分配任务', icon: FolderAdd } ]
  }
  return [ { name: '刷新', icon: Refresh } ]
})
const searchValue = ref('')
const operationLoading = ref(false)

// 主题变量（与 desktop 页一致）
const cardBgColor = computed(() => isDark.value ? '#000' : '#faf9f5')
const menuTextColor = computed(() => isDark.value ? '#EDEDED' : '#13343C')
const desktopBboder = computed(() => isDark.value ? 'rgba(231,231,224,.3)' : '#D7D7D7')
const subTextColor = computed(() => '#A1A1A1')
const vTextColor = computed(() => isDark.value ? '#EDEDED' : '#13343C')
const borderColor = computed(() => isDark.value ? 'transparent' : 'rgba(228, 231, 237, 0.6)')
const menuBgColor = computed(() => isDark.value ? '#000' : '#faf9f5')

const handleFileOperation = (tab: { name: string }) => {
  // 协同空间操作
  if (scMenuActive.value === 0) {
    switch (tab.name) {
      case '刷新':
        fetchCollabFolders()
        break
      case '上传':
        ElMessage.info('上传：功能待接入')
        break
      case '新建':
        openCreateDialog()
        break
    }
    return
  }

  // 人员管理区域右侧按钮
  if (tab.name === '邀请成员') {
    // 预留逻辑
  }
  // 任务管理区域
  if (scMenuActive.value === 2 && tab.name === '刷新') {
    fetchTasks()
    return
  }
  if (scMenuActive.value === 2 && tab.name === '分配任务') {
    openAssignDialog()
  }
}

// 左侧菜单
const scMenuItems = ref<string[]>(['协同空间', '人员管理', '任务管理', '进度看板', '返回所有项目'])
const scMenuActive = ref(1)

function onMenuClick(index: number) {
  // 若未选择项目，禁止进入非“协同空间”菜单
  if (index !== 0 && !projectId.value) {
    ElMessage.warning('请先在协同空间中选择一个项目')
    return
  }
  scMenuActive.value = index
}

// 表头与表格数据（静态）
const tableColumns = ref<string[]>(['用户账号', '姓名', '联系方式', '账号状态', '权限', '任务', '操作'])
type RowItem = {
  id: number
  account: string
  name: string
  contactText: string
  status: string
  role: string
  taskCount: number
  operations: string[]
}
const tableRows = ref<RowItem[]>([
  { id: 1, account: 'gbid_xfiofjsfjslaq', name: '李思思', contactText: '查看', status: '已启用', role: '创建者', taskCount: 0, operations: ['移除成员', '设置权限', '分配任务'] },
  { id: 2, account: 'gbid_xfiofjsfjslaq', name: '李思思', contactText: '查看', status: '已启用', role: '创建者', taskCount: 0, operations: ['移除成员', '设置权限', '分配任务'] },
  { id: 3, account: 'gbid_xfiofjsfjslaq', name: '李思思', contactText: '查看', status: '已启用', role: '创建者', taskCount: 0, operations: ['移除成员', '设置权限', '分配任务'] },
  { id: 4, account: 'gbid_xfiofjsfjslaq', name: '李思思', contactText: '查看', status: '已启用', role: '创建者', taskCount: 0, operations: ['移除成员', '设置权限', '分配任务'] },
])

const selectedRowId = ref<number | null>(null)
const onRowClick = (row: RowItem) => {
  selectedRowId.value = row.id
}
const noop = (_: unknown) => {}
function handleMemberOperation(op: string, row: RowItem) {
  if (op === '分配任务') {
    openAssignDialog()
    // 可在此处预填负责人等信息
  } else if (op === '移除成员') {
    ElMessage.info('移除成员：待接入')
  } else if (op === '设置权限') {
    ElMessage.info('设置权限：待接入')
  }
}

// 右侧详情（静态）
const projectDetail = ref({
  name: '上海招商太原三期三期四期五期六期八期',
  client: 'teststestest',
  createdAt: '2025-05-23'
})
const folderIcon = '/src/assets/file-icons/folder-large.svg'

// 新建项目弹框（与 desktop 保持一致）
const createDialogVisible = ref(false)
const country = ref('中国')
const provinceOptions = ref<{ value: string | number; label: string }[]>([])
const cityOptions = ref<{ value: string | number; label: string }[]>([])
const createProjectForm = ref({
  name: '',
  clientName: '',
  selectedProvince: '' as string | number | '',
  selectedCity: '' as string | number | '',
})

async function getProvinceData() {
  const res: any = await getProvinceList()
  if (res && (res.code === 200 || res.success)) {
    provinceOptions.value = (res.data || []).map((it: any) => ({ value: it.id, label: it.name }))
  }
}
async function getCityData(provinceId: string | number) {
  const res: any = await getCityList(provinceId)
  if (res && (res.code === 200 || res.success)) {
    cityOptions.value = (res.data || []).map((it: any) => ({ value: it.id, label: it.name }))
  } else {
    cityOptions.value = []
  }
}
async function onProvinceChange(pid: string | number) {
  createProjectForm.value.selectedCity = ''
  await getCityData(pid)
}
function openCreateDialog() {
  createDialogVisible.value = true
  createProjectForm.value = { name: '', clientName: '', selectedProvince: '', selectedCity: '' }
  cityOptions.value = []
  if (provinceOptions.value.length === 0) {
    getProvinceData()
  }
}
async function handleCreateConfirm() {
  if (!createProjectForm.value.name) {
    ElMessage.warning('请输入项目名称')
    return
  }
  if (!createProjectForm.value.selectedProvince) {
    ElMessage.warning('请选择项目地址')
    return
  }
  try {
    await addProjectFolder({
      name: createProjectForm.value.name,
      locationId: createProjectForm.value.selectedProvince,
      clientName: createProjectForm.value.clientName,
    })
    ElMessage.success('创建成功')
    createDialogVisible.value = false
    await fetchCollabFolders()
  } catch (e) {
    ElMessage.error('创建失败')
  }
}

// 接口对接：项目ID来源优先从路由 query 读取
const route = useRoute()
const projectId = ref<string | number | null>(null)

function resolveProjectId() {
  const q = route.query?.projectId as string | undefined
  if (q && q.trim()) {
    projectId.value = q
  }
}

async function fetchMembers() {
  if (!projectId.value) return
  try {
    const res: any = await getMemberList({ projectId: projectId.value, page: 1, pageSize: 1000 })
    if (res && (res.code === 200 || res.success)) {
      const list = (res.data?.data || res.data?.list || res.data || []) as any[]
      const mapRoleType = (rt: number | null | undefined) => {
        if (rt === 255) return '创建者'
        return '成员'
      }
      tableRows.value = (Array.isArray(list) ? list : []).map((m: any, idx: number) => ({
        id: m.userId ?? m.id ?? idx + 1,
        account: m.userName || '—',
        name: m.userNickName || '—',
        contactText: '查看',
        status: m.status === 1 ? '已启用' : '已禁用',
        role: mapRoleType(m.roleType),
        taskCount: 0,
        operations: ['移除成员', '设置权限', '分配任务'],
      }))
    }
  } catch (e) {
    ElMessage.error('获取成员列表失败')
  }
}

async function fetchProjectDetail() {
  if (!projectId.value) return
  try {
    const res: any = await getProjectFoldeInfo(projectId.value)
    if (res && (res.code === 200 || res.success)) {
      const d = res.data || {}
      projectDetail.value = {
        name: d.name || '—',
        client: d.clientName || '—',
        createdAt: (d.createdAt || '').slice(0, 10) || '—',
      }
    }
  } catch (e) {
    ElMessage.error('获取项目详情失败')
  }
}

// 任务列表
type TaskItem = { id: string | number; name: string; status: number; assigneeName?: string }
const taskRows = ref<TaskItem[]>([])
const tasksLoading = ref(false)
async function fetchTasks() {
  if (!projectId.value) return
  tasksLoading.value = true
  try {
    const res: any = await getTaskList({ projectId: projectId.value, page: 1, pageSize: 1000 })
    if (res && (res.code === 200 || res.success)) {
      const list = (res.data?.data || res.data?.list || res.data || []) as any[]
      taskRows.value = (Array.isArray(list) ? list : []).map((t: any, i: number) => ({
        id: t.id ?? t.taskId ?? i + 1,
        name: t.name || t.title || '未命名任务',
        status: t.status ?? 0,
        assigneeName: t.assigneeName || t.assignee?.name || '—',
      }))
    }
  } finally {
    tasksLoading.value = false
  }
}

// 分配任务弹框
const assignDialogVisible = ref(false)
const taskForm = ref({
  name: '',
  content: '',
  startDate: '' as any,
  endDate: '' as any,
  duration: ''
})
const taskContentLimit = 500
const contentCount = computed(() => (taskForm.value.content || '').length)
function openAssignDialog() {
  assignDialogVisible.value = true
  taskForm.value = { name: '', content: '', startDate: '', endDate: '', duration: '' }
}
async function handleAssignConfirm() {
  if (!projectId.value) {
    ElMessage.warning('请先选择项目')
    return
  }
  if (!taskForm.value.name) {
    ElMessage.warning('请输入任务名称')
    return
  }
  try {
    await createdTask({
      projectId: projectId.value,
      name: taskForm.value.name,
      content: taskForm.value.content,
      startAt: taskForm.value.startDate || null,
      endAt: taskForm.value.endDate || null,
      duration: taskForm.value.duration || null,
    })
    ElMessage.success('分配成功')
    assignDialogVisible.value = false
    fetchTasks()
  } catch (e) {
    ElMessage.error('分配失败')
  }
}

// 切换到“人员管理”时加载
watch(() => scMenuActive.value, async (idx) => {
  if (idx === 1) {
    await Promise.all([fetchMembers(), fetchProjectDetail()])
  } else if (idx === 0) {
    await fetchCollabFolders()
  } else if (idx === 2) {
    await Promise.all([fetchTasks(), fetchProjectDetail()])
  } else if (idx === 3) {
    await fetchProjectDetail()
  }
})

onMounted(async () => {
  resolveProjectId()
  if (!projectId.value) {
    // 未提供 projectId 时仅展示静态数据
    scMenuActive.value = 0
    await fetchCollabFolders()
    return
  }
  if (scMenuActive.value === 1) {
    await Promise.all([fetchMembers(), fetchProjectDetail()])
  } else if (scMenuActive.value === 2) {
    await Promise.all([fetchTasks(), fetchProjectDetail()])
  } else if (scMenuActive.value === 3) {
    await fetchProjectDetail()
  }
})

// 协同空间目录
type FolderItem = { id: string | number; name: string }
const collabFolders = ref<FolderItem[]>([])
const collabLoading = ref(false)
const selectedFolderId = ref<string | number | null>(null)
function onFolderSelect(f: FolderItem) {
  selectedFolderId.value = f.id
  projectId.value = f.id
  ElMessage.success('已选择项目')
  // 预取项目信息，后续进入“人员管理”可直接展示
  fetchProjectDetail()
}
async function fetchCollabFolders() {
  try {
    collabLoading.value = true
    // 使用目录接口参数：/team/project/resource?page=1&pageSize=16&search=&folders=false
    const res: any = await getProjectFile({ page: 1, pageSize: 16, search: searchValue.value || '', folders: false })
    const list = (res?.data?.data || res?.data?.list || res?.data || []) as any[]
    const rows = Array.isArray(list) ? list : []
    const onlyFolders = rows.filter((it: any) => it?.type === 'folder' || it?.contentType === 0 || it?.length === 0)
    collabFolders.value = onlyFolders.map((it: any, i: number) => ({
      id: it.id ?? it.folderId ?? i + 1,
      name: it.name || it.folderName || it.title || '未命名文件夹',
    }))
  } catch (e) {
    ElMessage.error('获取协同空间目录失败')
  } finally {
    collabLoading.value = false
  }
}
</script>

<template>
  <div class="desktop-container" @click.stop>
    <el-card class="box-card" :style="{ backgroundColor: cardBgColor }">
      <template #header>
        <div class="card-header">
          <span>{{ title }}</span>
        </div>
      </template>
      <div class="desktop-content">
        <div class="dcontent-top">
          <div class="dcontent-top-left">
            <div class="dcontent-top-left-item" v-for="(item, index) in navtitle" :key="item" :class="{ active: activeIndex === index }" @click="activeIndex = index">
              <span>{{ item }}</span>
            </div>
          </div>
          <div class="dcontent-top-right">
            <el-input v-model="searchValue" placeholder="搜索项目或文件" class="search-input" clearable size="small" />
            <div class="right-tabs">
              <div v-for="tab in rightTabs" :key="tab.name" class="right-tab">
                <el-icon :size="18" style="margin-right: 4px;">
                  <component :is="tab.icon" />
                </el-icon>
                <span @click="handleFileOperation(tab)" :class="{ 'loading': operationLoading }">{{ tab.name }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="sc-content">
          <aside class="sc-sider">
            <div
              v-for="(item, index) in scMenuItems"
              :key="item"
              class="sc-menu-item"
              :class="{ active: scMenuActive === index }"
              @click="onMenuClick(index)"
            >
              {{ item }}
            </div>
          </aside>

          <main class="sc-main" v-if="scMenuActive === 1">
            <div class="sc-table">
              <div class="thead">
                <div class="th" v-for="col in tableColumns" :key="col">{{ col }}</div>
              </div>
              <div class="tbody">
                <div
                  class="tr"
                  v-for="row in tableRows"
                  :key="row.id"
                  :class="{ active: selectedRowId === row.id }"
                  @click="onRowClick(row)"
                >
                  <div class="td">{{ row.account }}</div>
                  <div class="td">{{ row.name }}</div>
                  <div class="td"><span class="view-link">{{ row.contactText }}</span></div>
                  <div class="td">{{ row.status }}</div>
                  <div class="td">{{ row.role }}</div>
                  <div class="td">{{ row.taskCount }}</div>
                  <div class="td actions">
                    <span
                      class="op"
                      v-for="(op, i) in row.operations"
                      :key="i"
                      @click.stop="handleMemberOperation(op, row)"
                    >{{ op }}</span>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <main class="sc-main" v-else-if="scMenuActive === 0">
            <div class="folder-grid" v-loading="collabLoading">
              <div class="folder-item" v-for="f in collabFolders" :key="f.id" :class="{ 'is-selected': selectedFolderId === f.id }" @click="onFolderSelect(f)">
                <div class="folder-icon">
                  <img :src="folderIcon" alt="folder" />
                </div>
                <div class="folder-name">{{ f.name }}</div>
              </div>
              <div v-if="collabFolders.length === 0" class="empty-row">暂无目录</div>
            </div>
          </main>

          <!-- 任务管理视图 -->
          <main class="sc-main" v-if="scMenuActive === 2">
            <div class="task-table" v-loading="tasksLoading">
              <div class="thead">
                <div class="th">任务名称</div>
                <div class="th">负责人</div>
                <div class="th">状态</div>
              </div>
              <div class="tbody">
                <div class="tr" v-for="t in taskRows" :key="t.id">
                  <div class="td">{{ t.name }}</div>
                  <div class="td">{{ t.assigneeName || '—' }}</div>
                  <div class="td">{{ t.status === 1 ? '进行中' : t.status === 2 ? '已完成' : '未开始' }}</div>
                </div>
                <div v-if="taskRows.length === 0" class="empty-row">暂无任务</div>
              </div>
            </div>
          </main>

          <!-- 进度看板视图 -->
          <main class="sc-main" v-if="scMenuActive === 3">
            <div class="board-wrapper">
              <div class="board-column">
                <div class="board-title">待办</div>
                <div class="board-item" v-for="t in taskRows.filter(i => (i.status ?? 0) === 0)" :key="'todo-'+t.id">{{ t.name }}</div>
                <div v-if="taskRows.filter(i => (i.status ?? 0) === 0).length === 0" class="empty-row">暂无</div>
              </div>
              <div class="board-column">
                <div class="board-title">进行中</div>
                <div class="board-item" v-for="t in taskRows.filter(i => i.status === 1)" :key="'doing-'+t.id">{{ t.name }}</div>
                <div v-if="taskRows.filter(i => i.status === 1).length === 0" class="empty-row">暂无</div>
              </div>
              <div class="board-column">
                <div class="board-title">已完成</div>
                <div class="board-item" v-for="t in taskRows.filter(i => i.status === 2)" :key="'done-'+t.id">{{ t.name }}</div>
                <div v-if="taskRows.filter(i => i.status === 2).length === 0" class="empty-row">暂无</div>
              </div>
            </div>
          </main>

          <!-- 项目详情（保持在最右侧） -->
          <aside class="sc-detail" v-if="scMenuActive === 1 || scMenuActive === 2 || scMenuActive === 3">
            <ProjectDetailsAside :project="projectDetail" />
          </aside>
        </div>
      </div>
    </el-card>
    <!-- 新建项目弹框（与 desktop 一致样式） -->
    <el-dialog v-model="createDialogVisible" title="创建项目" width="30%" :close-on-click-modal="false">
      <el-form :model="createProjectForm" label-width="130px">
        <el-form-item label="项目名称">
          <el-input v-model="createProjectForm.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目地址">
          <el-select v-model="country" style="width: 130px; margin-right: 10px;" disabled>
            <el-option label="中国" value="中国" />
          </el-select>
          <el-select v-model="createProjectForm.selectedProvince" placeholder="选择省份" style="width: 130px; margin-right: 10px;" @change="onProvinceChange">
            <el-option v-for="item in provinceOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="createProjectForm.selectedCity" placeholder="选择城市" style="width: 130px;" :disabled="!createProjectForm.selectedProvince">
            <el-option v-for="item in cityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="建设方/委托方">
          <el-input v-model="createProjectForm.clientName" placeholder="请输入建设方/委托方" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <div class="dialog-button cancel" @click="createDialogVisible = false">取消</div>
          <div class="dialog-button confirm" @click="handleCreateConfirm">确定</div>
        </span>
      </template>
    </el-dialog>

    <!-- 分配任务弹框 -->
    <el-dialog v-model="assignDialogVisible" title="分配任务" width="520px" :close-on-click-modal="false" class="assign-dialog">
      <el-form label-position="left" label-width="110px">
        <el-form-item label="任务名称">
          <el-input v-model="taskForm.name" placeholder="请输入需要分配的任务名称" />
        </el-form-item>
        <el-form-item label="任务内容">
          <el-input v-model="taskForm.content" type="textarea" :rows="6" placeholder="请输入任务内容" maxlength="500" show-word-limit />
        </el-form-item>
        <el-form-item label="任务开始时间">
          <el-date-picker v-model="taskForm.startDate" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="任务完成时间">
          <el-date-picker v-model="taskForm.endDate" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="工期">
          <el-input v-model="taskForm.duration" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer assign-footer">
          <div class="dialog-button cancel" @click="assignDialogVisible = false">取消</div>
          <div class="dialog-button confirm" @click="handleAssignConfirm">确定</div>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
  
  <style scoped lang="less">
.desktop-container {
  height: 100%;
  :deep(.el-card) { box-shadow: none !important; }
}

.box-card {
  width: 100%;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;
    box-shadow: none;
  max-width: 1200px;
  min-width: 830px;
  margin-left: auto;
  margin-right: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--el-text-color-primary);
  font-size: 24px;
  color: v-bind(menuTextColor);
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.desktop-content {
  min-height: 300px;
  color: var(--el-text-color-regular);
  border: 1px solid v-bind(desktopBboder);
  border-radius: 10px;

  .dcontent-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 55px;
    padding: 20px 10px 20px 20px;
    border-bottom: 1px solid v-bind(desktopBboder);

    .dcontent-top-left {
      display: flex;
      align-items: center;

      .dcontent-top-left-item {
        font-size: 18px;
        color: v-bind(menuTextColor);
        cursor: pointer;
        margin-right: 30px;
        position: relative;
        padding: 0 2px;

        &:hover { opacity: 0.7; }
        &.active { font-weight: bold; }
        &.active::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: -2px;
          right: -2px;
          height: 2px;
          background-color: v-bind(vTextColor);
        }
        span { color: inherit; }
        &:not(.active) span { color: inherit; }
      }
    }

    .dcontent-top-right {
      display: flex;
      align-items: center;
      gap: 16px;

      .search-input {
        width: 300px;
        padding-right: 30px;
        :deep(.el-input__wrapper) {
          background-color: v-bind(menuBgColor);
          border: 1px solid v-bind(borderColor);
          border-radius: 5px;
          padding: 0 12px;
          height: 36px;
          box-shadow: none;
        }
        :deep(.el-input__inner) {
          color: v-bind(menuTextColor);
          font-size: 14px;
        }
      }

      :deep(.el-input__prefix) { color: v-bind(subTextColor); }

      .right-tabs {
        display: flex;
        align-items: center;
        gap: 8px;
        .right-tab {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #8E9094;
          cursor: pointer;
          padding: 0 10px;
          height: 32px;
          border-radius: 4px 4px 0 0;
          transition: color 0.2s, opacity 0.2s;
          opacity: 1;
          &:hover { opacity: 0.7; }
          span {
            &.loading { opacity: 0.6; cursor: not-allowed; }
        }
      }
    }
  }
}
}

/* 三栏内容区 */
.sc-content {
  display: flex;
  min-height: 540px;
  position: relative;
}

.sc-sider {
  width: 145px;
  border-right: 1px solid v-bind(desktopBboder);
  padding: 12px 0;
}

.sc-menu-item {
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 14px;
  color: v-bind(subTextColor);
  cursor: pointer;
  transition: opacity .2s;
}
.sc-menu-item:hover { opacity: .8; }
.sc-menu-item.active { color: v-bind(menuTextColor); font-weight: 600; }

.sc-main {
  flex: 1;
  padding: 16px 20px;
}

.sc-detail {
  width: 300px;
  border-left: 1px solid v-bind(desktopBboder);
  padding: 20px;
}
.sc-detail .panel-title { font-size: 14px; color: v-bind(menuTextColor); margin-bottom: 12px; }
.sc-detail .desc-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; }
.sc-detail .label { color: v-bind(subTextColor); }
.sc-detail .value { color: v-bind(menuTextColor); text-align: right; max-width: 70%; word-break: break-all; }

/* 表格 */
.sc-table { width: 100%; }
.sc-table .thead,
.sc-table .tr {
  display: grid;
  grid-template-columns: 1fr 65px 80px 80px 80px 60px 220px;
  align-items: center;
  text-align: center;
}
.sc-table .thead { height: 42px; border-bottom: 1px solid v-bind(desktopBboder); font-size: 12px; color: v-bind(menuTextColor); }
.sc-table .thead .th { padding: 0 8px; }

.sc-table .tbody { font-size: 12px; }
.sc-table .tr { height: 44px; border-bottom: 1px solid v-bind(desktopBboder); color: #666666; padding: 0 0; transition: background-color .2s; }
.sc-table .tr .td { padding: 0 8px; }
.sc-table .tr .view-link { color: #FFBD33; cursor: pointer; }
.sc-table .tr .actions .op { color: #FFBD33; margin-right: 12px; cursor: pointer; }
.sc-table .tr .actions .op:last-child { margin-right: 0; }

/* 行 hover 与选中高亮 */
.sc-table .tr:hover { background-color: rgba(0,0,0,0.03); }
html.dark .sc-table .tr:hover { background-color: rgba(255,255,255,0.04); }
.sc-table .tr.active { background-color: rgba(0,0,0,0.06); }
html.dark .sc-table .tr.active { background-color: rgba(255,255,255,0.06); }

/* 协同空间 - 文件夹宫格（与 desktop 风格一致） */
.folder-grid { display: flex; padding: 24px; flex-wrap: wrap; gap: 24px; }
.folder-item {
  width: 170px; height: 172px; padding: 16px; border-radius: 12px; cursor: pointer; transition: all .2s ease;
}
.folder-item:hover { background-color: #E5F6E6; }
.folder-item.is-selected { transform: scale(1.1); background-color: #E5F6E6; box-shadow: 0 2px 12px rgba(0,0,0,.1); }
.folder-icon { width: 100px; height: 100px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; }
.folder-icon img { width: 100%; height: 100%; }
.folder-name { font-size: 14px; text-align: center; color: v-bind(menuTextColor); overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-height: 1.4; }
.empty-row { width: 100%; height: 60px; display: flex; align-items: center; justify-content: center; color: v-bind(subTextColor); }

/* 深色主题对齐 desktop 选中/悬停底色 */
html.dark {
  .folder-item:hover { background-color: #1B2126; }
  .folder-item.is-selected { background-color: #1B2126; }
}

/* 任务表 */
.task-table { width: 100%; }
.task-table .thead, .task-table .tr { display: grid; grid-template-columns: 1fr 160px 120px; align-items: center; }
.task-table .thead { height: 42px; border-bottom: 1px solid v-bind(desktopBboder); font-size: 12px; color: v-bind(menuTextColor); }
.task-table .thead .th { padding: 0 8px; }
.task-table .tbody { font-size: 12px; }
.task-table .tr { height: 44px; border-bottom: 1px solid v-bind(desktopBboder); color: #666666; }
.task-table .td { padding: 0 8px; }

/* 看板 */
.board-wrapper { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
.board-column { border: 1px solid v-bind(desktopBboder); border-radius: 8px; padding: 12px; min-height: 240px; }
.board-title { font-size: 13px; color: v-bind(menuTextColor); margin-bottom: 10px; }
.board-item { padding: 10px 12px; border: 1px solid v-bind(desktopBboder); border-radius: 6px; margin-bottom: 10px; background: transparent; }

/* 弹框底部按钮样式（与 desktop 一致） */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;

  .dialog-button {
    padding: 8px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    margin-left: 12px;

    &.cancel {
      background-color: #F5F5F5;
      color: #666666;
      border: 1px solid #E4E4E4;

      &:hover {
        background-color: #E8E8E8;
        border-color: #D4D4D4;
      }
    }

    &.confirm {
      background-color: #FABD33;
      color: #1B2126;

      &:hover {
        background-color: rgba(250,189,51, .6);
      }

      :deep(.el-loading-spinner) {
        .circular { .path { stroke: #F9DE4A !important; } }
      }
      :deep(.el-loading-spinner .circular .path) { stroke: #F9DE4A !important; }
      &.is-loading { :deep(.el-loading-spinner .circular .path) { stroke: #F9DE4A !important; } }
    }
  }
}

html.dark {
  .dialog-button {
    &.cancel {
      background-color: #2B2B2B;
      color: #C4C4D3;
      border: 1px solid #3B3B3B;

      &:hover {
        background-color: #3B3B3B;
        border-color: #4B4B4B;
      }
    }

    &.confirm {
      background-color: rgba(249, 222, 74, 1);
      color: #1B2126;

      &:hover { background-color: rgba(249, 222, 74, 0.8); }

      :deep(.el-loading-spinner) { .circular { .path { stroke: #F9DE4A !important; } } }
    }
  }
}

/* 分配任务弹框内边距与间距还原 */
 :deep(.el-dialog__header) { padding: 14px 14px 0 14px; }
 :deep(.el-dialog__headerbtn) { top: 18px; right: 22px; }
 :deep(.el-dialog__title) { font-size: 20px; font-weight: 700; }
 :deep(.el-dialog__body) { padding: 14px 14px 0 14px; }
 :deep(.el-form-item) { margin-bottom: 30px; }
:deep(.el-form-item__label) { padding: 0  }
:deep(.el-form-item__content) { padding-left: 30px; }
 :deep(.el-input),
 :deep(.el-textarea),
 :deep(.el-date-editor) { width: 370px; }
 :deep(.el-dialog__footer) { padding: 0 30px 30px 30px; }
 :deep(.el-input__wrapper),
 :deep(.el-textarea__inner) {
  background-color: v-bind(menuBgColor);
  border: 1px solid v-bind(borderColor);
  border-radius: 6px;
  box-shadow: none;
}
 :deep(.el-input__inner),
 :deep(.el-textarea__inner) { color: v-bind(menuTextColor); }
 :deep(.el-input__wrapper.is-focus) { box-shadow: none !important; border: 1px solid v-bind(borderColor) !important; }
 :deep(.el-input__wrapper:hover) { box-shadow: none !important; border: 1px solid v-bind(borderColor) !important; }
 :deep(.el-textarea__inner) {
  border: none !important;
  box-shadow: inset 0 0 0 1px v-bind(borderColor) !important;
}
 :deep(.el-textarea__inner:hover),
:deep(.el-textarea__inner:focus),
 :deep(.el-textarea__inner:focus-visible),
 :deep(.el-textarea.is-focus .el-textarea__inner) {
  border: none !important;
  outline: none !important;
  box-shadow: inset 0 0 0 1px v-bind(borderColor) !important;
}


  </style> 


