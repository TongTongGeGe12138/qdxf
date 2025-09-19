<template>
  <div>
    <el-table
      :data="tableData"
      border
      :span-method="arraySpanMethod"
      style="width: 100%"
    >
      <el-table-column prop="date" label="日期" width="180" />
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="address" label="地址" />
    </el-table>

    <div style="margin-top: 20px">
      <h3>合并结果：</h3>
      <pre>{{ mergedCells }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const tableData = ref([
  { date: "2025-09-01", name: "Tom", address: "No. 189, Grove St" },
  { date: "2025-09-01", name: "Jerry", address: "No. 189, Grove St" },
  { date: "2025-09-02", name: "Alice", address: "No. 200, Lake St" },
  { date: "2025-09-03", name: "Bob", address: "No. 300, River Rd" },
])

// 存储合并结果
const mergedCells = ref([])

const arraySpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  console.log(row, column, rowIndex, columnIndex)
  // 合并 "日期" 列 (columnIndex === 0)
  if (columnIndex === 0) {
    // 第 0 行合并 2 行
    if (rowIndex === 0) {
      mergedCells.value.push({
        row: rowIndex,
        col: columnIndex,
        rowspan: 2,
        colspan: 1,
        value: row.date,
      })
      return [2, 1]
    }
    // 第 1 行被合并掉
    if (rowIndex === 1) {
      return [0, 0]
    }
  }

  // 其他情况不合并
  return [1, 1]
}
</script>
