import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        selectedCurrency: localStorage.getItem('selectedCurrency') || 'BTCUSDT',
        orderBook: null,
        bids: [],
        asks: [],
        itemsCount: 100,
        changeLog: [],
        socket: null,
        timeout: null,
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
        setChangeLog(state, log) {
            state.changeLog.push(log);
        },
        setSocket(state, socket) {
            state.socket = socket;
        },
        setSecondTimeout(state, timeout) {
            state.timeout = timeout;
        },
    },
    actions: {
        async fetchOrderBook({ commit, state, dispatch }) {
            const res = await axios.get(`https://api.binance.com/api/v3/depth?symbol=${state.selectedCurrency}&limit=1000`);
            if (res.status === 200) {
                commit('setOrderBook', res.data);
                commit('updateOrders');
            } else {
                commit('setChangeLog', 'Error fetching order book');
                dispatch('secondFetchOrderBook');
            }
        },
        secondFetchOrderBook({ commit, dispatch }) {
            const timeout = setTimeout(() => {
                dispatch('fetchOrderBook');
            }, 5000);
            commit('setSecondTimeout', timeout);
        },

        connectWebsocket({ commit, state, dispatch }) {
            const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${state.selectedCurrency.toLowerCase()}@depth`);
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.b || data.a) {
                    commit('setOrderBook', { bids: data.b, asks: data.a });
                    commit('updateOrders');
                }
            };
            socket.onclose = () => {
                dispatch('secondconnectWebsocket');
            };
            commit('setSocket', socket);
        },
        secondconnectWebsocket({ commit, dispatch }) {
            const timeout = setTimeout(() => {
                dispatch('connectWebsocket');
            }, 5000);
            commit('setSecondTimeout', timeout);
        },
        secondFetchOrderBook({ commit, dispatch }) {
            const timeout = setTimeout(() => {
                dispatch('fetchOrderBook');
            }, 5000);
            commit('setSecondTimeout', timeout);
        },
    },
    modules: {

    },
});
