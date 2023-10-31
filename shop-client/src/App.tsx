import { useEffect } from 'react';
import './App.css';
import {
    BrowserRouter,
    Route,
    Routes
  } from "react-router-dom";
import Layout from './Layout/Layout';
import ProductsPage from './ProductsPage/ProductsPage';
import ProductDescriptionPage from './ProductDescriptionPage/ProductDescriptionPage';
import MainPage from './MainPage/MainPage';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingStatus, setProducts } from './productsSlice';
import { RootState } from './reduxStore';
import Loader from './Loader/Loader';
import { ELoadingStatus } from './types';

function App() {
    const dispatch = useDispatch();
    const loadingStatus = useSelector((state: RootState) => state.loadingStatus);

    const loadProducts = async () => {
        const options = {
            method: 'GET',
            url: '/api/products'
        };
        
        axios.request(options).then((response: any) => {
            dispatch(setProducts(response.data));
            dispatch(setLoadingStatus(ELoadingStatus.LOADED));
        }).catch((error) => {
            console.error(error);
            dispatch(setLoadingStatus(ELoadingStatus.ERROR));
        });
    }

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={loadingStatus === ELoadingStatus.LOADED 
                        ? <MainPage /> : <Loader/>} />
                    <Route path="products-list" element={loadingStatus === ELoadingStatus.LOADED 
                        ? <ProductsPage /> : <Loader/>} />
                    <Route path=":id" element={loadingStatus === ELoadingStatus.LOADED 
                        ? <ProductDescriptionPage /> : <Loader/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
