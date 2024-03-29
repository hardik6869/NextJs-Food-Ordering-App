import {createSlice} from '@reduxjs/toolkit';
import {Products} from '../interface/Interface';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        products: [] as Products[],
        quantity: 0 as number,
        total: 0 as number,
    },
    reducers: {
        addProduct: (state, action) => {
            state.products.push(action.payload);
            state.quantity += 1;
            state.total += action.payload.price * action.payload.quantity;
        },
        reset: (state) => {
            state.products = [];
            state.quantity = 0;
            state.total = 0;
        },
    },
});

export const {addProduct, reset} = cartSlice.actions;

export default cartSlice.reducer;
