<template>
  <div class="members-container">
    <div class="members-content">
      <!-- 这里添加人员管理相关的内容 -->
      <!-- 成员列表 -->
      <el-table :data="memberList" style="width: 100%">
        <el-table-column prop="account" label="用户账号" min-width="120" />
        <el-table-column prop="name" label="姓名" min-width="60" />
        <el-table-column prop="contact" label="联系方式" min-width="100" >
          <template #default="{ row }">
            <div @click="lookcontact(row)">查看</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="账号状态" min-width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === '已启用' ? 'success' : 'info'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="权限" min-width="60" />
        <el-table-column prop="tasks" label="任务" min-width="100" align="center" />
        <el-table-column label="操作" min-width="280" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              @click="handleTransfer(row)"
            >
              移除成员
            </el-button>
            <el-button
              link
              type="primary"
              @click="handlePermission(row)"
            >
              设置权限
            </el-button>
            <el-button
              link
              type="primary"
              @click="handleAssignTask(row)"
            >
              分配任务
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Member {
  account: string
  name: string
  contact: string
  status: string
  role: string
  tasks: number
}

const memberList = ref<Member[]>([
  {
    account: 'gbid_xfi0fjsfjslaq',
    name: '李思思',
    contact: '13800138000',
    status: '已启用',
    role: '创建者',
    tasks: 0
  },
  {
    account: 'gbid_xfi0fjsfjslaq',
    name: '张三',
    contact: '13800138001',
    status: '已启用',
    role: '创建者',
    tasks: 0
  },
  {
    account: 'gbid_xfi0fjsfjslaq',
    name: '李四',
    contact: '13800138002',
    status: '已启用',
    role: '创建者',
    tasks: 0
  }
])

// 操作方法
const handleView = (row: Member) => {
  console.log('查看成员:', row)
}

const handleTransfer = (row: Member) => {
  console.log('移除成员:', row)
}

const handlePermission = (row: Member) => {
  console.log('设置权限:', row)
}

const handleAssignTask = (row: Member) => {
  console.log('分配任务:', row)
}
</script>

<style scoped>
.members-container {
  padding: 20px;
}

.members-content {
  margin-top: 20px;
}

:deep(.el-button) {
  padding: 4px 8px;
  height: 24px;
  font-size: 12px;
}

:deep(.el-table) {
  --el-table-header-bg-color: var(--el-fill-color-light);
  --el-table-border-color: var(--el-border-color-lighter);
  --el-table-row-hover-bg-color: var(--el-fill-color);
  border-radius: 4px;
  border: 1px solid var(--el-table-border-color);
}

:deep(.el-table__header) {
  font-size: 12px;
  color: var(--el-text-color-regular);
}

:deep(.el-table__row) {
  font-size: 12px;
}
</style> 