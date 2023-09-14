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
import { throttle } from 'lodash-es'

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
const showModal = ref()
const bookText = ref()
const model = ref({
  name: '',
  phone: ''
})
const areaSelected = ref()
const selected = ref()

const dateDisabled = (ts) => {
  const date = new Date(ts).getDate()
  const today = new Date().getDate()
  if (new Date().getHours() >= 3) {
    return date < today
  } else {
    return ts < Date.now() - oneDayMillis
  }
}

const columns = [
  {
    title: '房型',
    key: 'typeRoomName'
  },
  {
    title: '(每晚)价格',
    key: 'price'
  },
  {
    title: '窗',
    key: 'hasWindow'
  },
  {
    title: '床',
    key: 'bedSize'
  },
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

// TODO
// const hasAlreadyBook = computed(() => alreadyBook.get(city.value)?.includes())

const handleBook = (row: any) => {
  selected.value = row
  showModal.value = true
}

const handleCopy = () => {
  if (model.value.name && model.value.phone) {
    copy(
      `【预定信息】${areaSelected.value?.label} ${selected.value?.typeRoomName} ${selected.value?.price} ${model.value.name} ${model.value.phone}`
    )
  } else {
    alert('请填写入住人信息')
  }
}

const copy = async (text: string) => {
  await navigator.clipboard.writeText(text)
  alert('已复制到剪贴板, 可直接发我下单，并拍下链接')
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
}, 2000)

const handleHotelOptions = (res) => {
  return res.filter((i) => i.value.length === 7)
}

const handleSelectHotel = async () => {
  loading.value = true
  tableData.value = await getDetail({
    hotelId: area.value,
    checkInDate: date.value?.[0],
    checkOutDate: date.value?.[1]
  })
  loading.value = false
}

const handleAreaSelect = (value, option) => {
  areaSelected.value = option
}

const handleSwitch = (value) => {
  // TODO
}
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <header>
      <div class="wrapper">
        <HelloWorld msg="hzhdd" />

        <n-space vertical>
          <n-select
            v-model:value="city"
            filterable
            :options="cities"
            placeholder="请输入城市名, 如北京、成都"
          />
          <p>热门城市</p>
          <n-space>
            <n-button
              v-for="item in hotCities"
              :key="item.label"
              text
              tag="a"
              type="primary"
              @click="city = item.label"
            >
              {{ item.label }}</n-button
            >
          </n-space>

          <template v-if="city">
            <n-select
              v-model:value="area"
              filterable
              remote
              :options="areaOptions"
              :loading="loading"
              @search="handleSearch"
              @update:value="handleAreaSelect"
              placeholder="请输入关键词查询酒店，如地名/地标/酒店名"
            />

            <n-date-picker
              type="daterange"
              v-model:formatted-value="date"
              value-format="yyyy-MM-dd"
              :is-date-disabled="dateDisabled"
              placeholder="请选择入住时间"
            />

            <n-button type="primary" @click="handleSelectHotel">查价</n-button>

            <n-switch v-model:value="hasBreakfase" @change="handleSwitch">
              <template #checked> 双早 </template>
              <template #unchecked> 无早 </template>
            </n-switch>

            <n-data-table :bordered="false" :columns="columns" :data="tableData" />
          </template>
        </n-space>

        <n-modal :show="showModal">
          <n-card
            style="width: 600px"
            title="请填写入住人信息"
            :bordered="false"
            role="dialog"
            aria-modal="true"
          >
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
              <textarea
                disabled
                :rows="3"
                :cols="35"
                ref="bookText"
                :value="`【预定信息】${areaSelected?.label} ${selected?.typeRoomName} ${selected?.price} ${model.name} ${model.phone}`"
              />
              <n-button type="primary" @click="handleCopy">点击复制</n-button>
            </n-space>
          </n-card>
        </n-modal>
      </div>
    </header>

    <RouterView />
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
