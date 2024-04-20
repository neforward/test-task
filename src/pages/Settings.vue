<template>
  <div class="settings-container">
    <div class="whole-settings">
      <h3>Settings Page</h3>
      <div class="settings-flex">
        <label for="currencySelect">Select Currency</label>
        <select
          id="currencySelect"
          v-model="selectedCurrency"
          @change="handleChange"
        >
          <option value="BTCUSDT">BTCUSDT</option>
          <option value="BNBBTC">BNBBTC</option>
          <option value="ETHBTC">ETHBTC</option>
        </select>
      </div>
      <div>
        <h4>Change History</h4>
        <ul>
          <li v-for="(log, i) in changeLog" :key="i">
            Changed {{ log.oldCurrency }} to {{ log.newCurrency }} at
            {{ log.time }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";

const store = useStore();

const selectedCurrency = ref(store.state.selectedCurrency);
const changeLog = ref(store.state.changeLog || []);

const handleChange = () => {
  const oldCurrency = store.state.selectedCurrency;
  const newCurrency = selectedCurrency.value;
  const time = new Date().toLocaleString();

  store.commit("setSelectedCurrency", newCurrency);
  store.dispatch("fetchOrderBook");

  changeLog.value.unshift({
    oldCurrency: oldCurrency,
    newCurrency: newCurrency,
    time: time,
  });

  store.dispatch("connectWebsocket", newCurrency);
};
onMounted(() => {
  store.dispatch("fetchOrderBook");
});

onUnmounted(() => {
  clearTimeout(store.state.retryTimeout);
  if (store.state.socket) {
    store.state.socket.close();
  }
});
</script>
