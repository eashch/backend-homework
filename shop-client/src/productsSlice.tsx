import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ELoadingStatus, IProduct, IProductsSlice } from './types';

const initialState = { 
    products: [],
    loadingStatus: ELoadingStatus.LOADING
} as IProductsSlice

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts(state, action: PayloadAction<IProduct[]>) {
            state.products = action.payload;
        },
        setLoadingStatus(state, action: PayloadAction<ELoadingStatus>) {
            state.loadingStatus = action.payload;
        }
    },
});

export const { 
    setProducts,
    setLoadingStatus
} = productsSlice.actions
export default productsSlice.reducer