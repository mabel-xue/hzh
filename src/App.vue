<script setup lang="tsx">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { computed, onMounted, ref } from 'vue'
import { getCities, getDetail, searchHotel } from '@/apis'
import {
  NModal,
  NForm,
  NInput,
  NFormItem,
  NCard,
  NDataTable,
  NDatePicker,
  NSwitch,
  NSpace,
  NText,
  NButton,
  NSelect,
  NConfigProvider,
  zhCN,
  dateZhCN
} from 'naive-ui'
import { throttle, intersection } from 'lodash-es'
import { getDatesBetween } from './utils'

const alreadyBook = new Map([
  ['北京', ['0923']],
  ['天津', ['1014']],
  ['杭州', ['0915', '0916', '1004']],
  ['连云港', ['0927']],
  ['济南', ['0916', '0926', '1005']],
  ['乌鲁木齐', ['0919']],
  ['长沙', ['0915']],
  ['青岛', ['0915', '0916']],
  ['威海', ['0924', '0925', '0926', '0927']],
  ['南京', ['0914', '0915', '0918', '0919', '1006', '1007']],
  ['昆明', ['0915']],
  ['洛阳', ['0929', '0930']],
  ['广州', ['0920', '0921', '0926', '0927']],
  ['香格里拉', ['1017', '1018']],
  ['珠江', ['0914', '0920', '0921', '0926', '0927', '0928']]
])

const city = ref()
const cities = ref([])
const hotCities = ref([])
const area = ref()
const areaOptions = ref<any>([])
const date = ref()
const loading = ref()
const hasBreakfase = ref(true)
const oneDayMillis = 24 * 60 * 60 * 1000
const tableData = ref()
const originTableData = ref()
const showModal = ref(false)
const bookText = ref()
const model = ref({
  name: '',
  phone: ''
})
const areaSelected = ref()
const selected = ref()
const tableRef = ref()

const dateDisabled = (ts) => {
  const date = new Date(ts).getDate()
  const today = new Date().getDate()
  if (new Date().getHours() >= 3) {
    return date < today
  } else {
    return ts < Date.now() - oneDayMillis
  }
}

const isAlreadyBook = computed(() => {
  const dateRepeat = intersection(getDatesBetween(date.value?.[0], date.value?.[1]), alreadyBook.get(city.value))
  return alreadyBook.get(city.value) && dateRepeat.length;
})

const columns = [
  {
    title: '房型',
    key: 'typeRoomName'
  },
  {
    title: '元/每晚',
    key: 'price'
  },
  {
    title: '窗',
    key: 'hasWindow'
  },
  // {
  //   title: '床',
  //   key: 'bedSize'
  // },
  {
    title: '操作',
    key: 'actions',
    render: (row: any) => (
      <NButton type="primary" onClick={() => handleBook(row)}>
        我想预定
      </NButton>
    )
  }
]

const bookMsg = computed(() => `【预定信息】${areaSelected.value?.label} ${selected.value?.typeRoomName} ${hasBreakfase.value ? (isAlreadyBook.value ? '含早' : '免费双早') : '无早'} ${selected.value?.price} ${model.value.name} ${model.value.phone}`)

const handleBook = (row: any) => {
  selected.value = row
  showModal.value = true
}

const handleCopy = () => {
  if (model.value.name && model.value.phone) {
    copy(bookMsg.value)
  } else {
    alert('请填写入住人信息')
  }
}

const copy = async (text: string) => {
  await navigator.clipboard.writeText(text)
  alert('已复制到剪贴板, 可直接粘贴发我进行预定')
}

onMounted(async () => {
  const cityData = await getCities()
  cities.value = cityData?.cities
  hotCities.value = cityData?.hotCityList
})

const handleSearch = throttle(async (query) => {
  loading.value = true
  const areas = await searchHotel(city.value, query)
  areaOptions.value = handleHotelOptions(areas)
  loading.value = false
}, 1600, {leading: false})

const handleHotelOptions = (res) => {
  return res.filter((i) => i.value.length === 7)
}

const handleSelectHotel = async () => {
  if (!date.value || !area.value) {
    return alert('请输入入住酒店和时间')
  }
  loading.value = true
  hasBreakfase.value = !isAlreadyBook.value
  const detail = await getDetail({
    hotelId: area.value,
    checkInDate: date.value?.[0],
    checkOutDate: date.value?.[1]
  })
  originTableData.value = hasBreakfase.value ? detail : detail?.map(i => ({ ...i, price: Math.ceil(i.price - 3) }))
  tableData.value = originTableData.value
  loading.value = false
}

const handleAreaSelect = (value, option) => {
  areaSelected.value = option
}

const handleSwitch = (hasBreakfase: boolean) => {
  if (isAlreadyBook.value && hasBreakfase) {
    tableData.value = tableData.value?.map(i => ({ ...i, price: Math.ceil(i.price * 1.036) }))
  } else if (!isAlreadyBook.value && !hasBreakfase) {
    tableData.value = tableData.value?.map(i => ({ ...i, price: Math.ceil(i.price - 3) }))
  } else {
    tableData.value = originTableData.value
  }
}

const authCode = ref()
const authed = ref(false)

const handleAuth = () => {
  authed.value = authCode.value === '1'
}
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <header>
      <div class="wrapper">

        <template v-if="!authed">
          <n-space vertical>
            <n-input v-model:value="authCode" placeholder="请输入使用码" />
            <n-button @click="handleAuth">确认</n-button>
          </n-space>
        </template>

        <template v-else>
          <HelloWorld msg="hzhdd" />

          <n-space vertical>
            <n-select v-model:value="city" filterable :options="cities" placeholder="请输入城市名, 如北京、成都" />
            <p>热门城市</p>
            <n-space>
              <n-button v-for="item in hotCities" :key="item.label" text tag="a" type="primary"
                        @click="city = item.label">
                {{ item.label }}</n-button>
            </n-space>

            <template v-if="city">
              <n-select v-model:value="area" filterable remote :options="areaOptions" :loading="loading"
                        @search="handleSearch" @update:value="handleAreaSelect" placeholder="输入关键词查询酒店,如地名/地标/酒店名" />

              <n-date-picker type="daterange" v-model:formatted-value="date" value-format="yyyy-MM-dd"
                             :is-date-disabled="dateDisabled" placeholder="请选择入住时间" />

              <n-button type="primary" @click="handleSelectHotel" :loading="loading">查价</n-button>

              <n-switch v-model:value="hasBreakfase" @update:value="handleSwitch">
                <template #checked> 双早 </template>
                <template #unchecked> 无早 </template>
              </n-switch>

              <n-data-table ref="tableRef" :bordered="false" :columns="columns" :data="tableData" />

            </template>
          </n-space>
        </template>

        <n-modal v-model:show="showModal" preset="dialog">
          <n-card title="请填写入住人信息" :bordered="false" role="dialog" aria-modal="true">
            <n-form ref="formRef" :model="model">
              <n-form-item path="name" label="姓名">
                <n-input v-model:value="model.name" />
              </n-form-item>
              <n-form-item path="phone" label="手机号">
                <n-input v-model:value="model.phone" />
              </n-form-item>
            </n-form>
            <n-space vertical>
              <n-text depth="3"> 填写好入住人信息，复制以下信息发我： </n-text>
              <textarea disabled :rows="3" ref="bookText" :value="bookMsg" />
              <n-button type="primary" @click="handleCopy">点击复制</n-button>
            </n-space>
          </n-card>
        </n-modal>
      </div>
    </header>

    <!-- <RouterView /> -->
  </n-config-provider>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
