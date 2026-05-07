<template>
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-4 text-center">{{ appConfig.siteName }}</h1>
    <p class="mb-8 text-center">點擊法規名稱旁的「檢視」按鈕，查看各學生自治組織自訂規章。</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(group, orgId) in groupedRegulations" :key="orgId" class="border rounded-lg shadow-md hover:shadow-lg transition bg-white dark:bg-slate-900 overflow-hidden">
        <div class="bg-lake-600 text-white p-4">
          <h2 class="text-xl font-bold">{{ group.orgName }}</h2>
        </div>
        
        <div class="p-4">
          <ul class="space-y-2">
            <li v-for="reg in group.regulations" :key="reg.stem" class="flex justify-between items-center border-b pb-1 last:border-0">
              <span class="text-gray-700 dark:text-gray-200 font-medium">{{ reg.title }}</span>
              <NuxtLink 
                :to="reg.path"
                class="text-xs bg-lake-100 text-lake-700 dark:bg-lake-800 dark:text-lake-200 px-2 py-1 rounded hover:bg-lake-200"
              >
                檢視
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()

// 取得所有法規資料
const { data: allRegulations } = await useAsyncData('home-regulations', () => {
  return queryCollection('regulations')
    .select('fullTitle', 'shortTitle', 'belongsTo', 'path', 'stem', 'version')
    .order('version', 'DESC') // 先按日期降序，確保下面過濾時先抓到最新的
    .all()
})

// 資料處理：依照組織分組，並過濾出每個法規的「最新版本」
const groupedRegulations = computed(() => {
  if (!allRegulations.value) return {}

  const groups: Record<string, any> = {}

  allRegulations.value.forEach(item => {
    // 假設路徑結構為 /regulations/org-id/reg-id/version
    // item.stem 會類似 "regulations/ntpu-su/constitution/2025-02-17"
    const parts = item.stem.split('/')
    if (parts.length < 4) return // 結構不對則跳過

    const orgId = parts[1]
    const regId = parts[2]

    if (!groups[orgId]) {
      groups[orgId] = {
        orgName: item.belongsTo,
        regulations: [] // 這裡存放該組織處理過的法規清單
      }
    }

    // 檢查這個法規是否已經被加入過 (因為我們已按日期降序，第一個遇到的一定是最新版)
    const exists = groups[orgId].regulations.find((r: any) => r.regId === regId)
    if (!exists) {
      groups[orgId].regulations.push({
        title: item.shortTitle,
        regId: regId,
        path: item.path, // 連結到最新版的路徑
        latestVersion: item.version
      })
    }
  })

  return groups
})
</script>