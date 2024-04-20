import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        selectedCurrency: localStorage.getItem('selectedCurrency') || 'BTCUSDT',
        orderBook: null,
        bids: [],
        asks: [],
        itemsCount: 1000,
    },
    mutations: {
        setSelectedCurrency(state, currency) {
            state.selectedCurrency = currency;
            localStorage.setItem('selectedCurrency', currency);
        },
        setOrderBook(state, orderBook) {
            state.orderBook = orderBook;
        },
        setBids(state, bids) {
            state.bids = bids;
        },
        setAsks(state, asks) {
            state.asks = asks;
        },
        updateOrders(state) {
            if (state.orderBook) {
                const { bids, asks } = state.orderBook;
                const displayedBids = bids.slice(0, state.itemsCount).map(([price, quantity]) => ({ price, quantity, total: price * quantity })).sort((a, b) => b.price - a.price);
                const displayedAsks = asks.slice(0, state.itemsCount).map(([price, quantity]) => ({ price, quantity, total: price * quantity })).sort((a, b) => a.price - b.price);
                state.bids = displayedBids;
                state.asks = displayedAsks;
            }
        },
    },
    actions: {
        async fetchOrderBook({ commit, state }) {
            const res = await axios.get(`https://api.binance.com/api/v3/depth?symbol=${state.selectedCurrency}&limit=1000`);
            if (res.status === 200) {
                commit('setOrderBook', res.data);
                commit('updateOrders');
            }
        },
        updateOrders({ state, commit }) {
            if (state.orderBook) {
                const { bids, asks } = state.orderBook;
                const displayedBids = bids.slice(0, state.itemsCount).map(([price, quantity]) => ({ price, quantity, total: price * quantity })).sort((a, b) => b.price - a.price);
                const displayedAsks = asks.slice(0, state.itemsCount).map(([price, quantity]) => ({ price, quantity, total: price * quantity })).sort((a, b) => a.price - b.price);
                commit('setBids', displayedBids);
                commit('setAsks', displayedAsks);
            }
        },
        connectWebsocket({ commit, dispatch, state }) {
            const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${state.selectedCurrency.toLowerCase()}@depth`);
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.b || data.a) {
                    dispatch('fetchOrderBook');
                }
            };
        },
    },
    modules: {},
});
