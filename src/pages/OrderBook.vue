<template>
  <div class="order-book-container">
    <div class="table-container">
      <h2>Bids</h2>
      <table class="bids-table order-table">
        <thead>
          <tr>
            <th>Price</th>
            <th>Quantity</th>
            <th class="total">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bid, index) in bids" :key="index">
            <td>{{ bid.price }}</td>
            <td>{{ bid.quantity }}</td>
            <td class="total">{{ bid.price * bid.quantity }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-container">
      <h2>Asks</h2>
      <table class="asks-table order-table">
        <thead>
          <tr>
            <th>Price</th>
            <th>Quantity</th>
            <th class="total">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ask, index) in asks" :key="index">
            <td>{{ ask.price }}</td>
            <td>{{ ask.quantity }}</td>
            <td class="total">{{ ask.price * ask.quantity }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="order-book-container">
    <div class="select-container">
      <label for="item-count">Items per page:</label>
      <select id="item-count" v-model="itemsPerPage" @change="tableData">
        <option value="100">100</option>
        <option value="500">500</option>
        <option value="1000">1000</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();

const bids = ref([]);
const asks = ref([]);
const itemsPerPage = ref(100);

const tableData = () => {
  bids.value = store.state.bids.slice(0, itemsPerPage.value);
  asks.value = store.state.asks.slice(0, itemsPerPage.value);
};

onMounted(async () => {
  await store.dispatch("fetchOrderBook");
  store.dispatch("connectWebsocket");
  store.watch(
    () => store.state.bids,
    (newBids) => {
      bids.value = newBids.slice(0, itemsPerPage.value);
    }
  );
  store.watch(
    () => store.state.asks,
    (newAsks) => {
      asks.value = newAsks.slice(0, itemsPerPage.value);
    }
  );
});

watch(itemsPerPage, tableData);
</script>
