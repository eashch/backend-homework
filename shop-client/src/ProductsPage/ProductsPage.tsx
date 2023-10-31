import { useSelector } from 'react-redux';
import { RootState } from '../reduxStore';
import './ProductsPage.css';
import ProductOnProductsPage from '../ProductOnProductsPage/ProductOnProductsPage';
import { IProduct } from '../types';

function ProductsPage() {
    const products = useSelector((state: RootState) => state.products);

    const addProductsToPage = (): JSX.Element[] => {
        return products.map((product: IProduct) => {
            return (
                <ProductOnProductsPage
                    product={product}
                />
            );
        });
    }

    return (
        <div>
            <h3>Список товаров ({products.length})</h3>
            <div className='products-container'>
                {addProductsToPage()}
            </div>
        </div>
    );
}

export default ProductsPage;