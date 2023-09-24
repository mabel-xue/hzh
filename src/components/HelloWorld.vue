<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <p>【系统使用说明】</p>
    <p>* 查询价格已含代订费</p>
    <p>* 未查询到的房型表示<b>已售罄</b></p>
    <p>* 系统内无任何付费操作，交易请在正规平台进行</p>
    <p>* 本系统仅供本人客户查价使用，不得外传、分享</p>
    <br />
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

p {
  font-size: 0.8rem;
}

.greetings h1 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
