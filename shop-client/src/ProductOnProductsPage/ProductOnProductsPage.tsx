import './ProductOnProductsPage.css';
import { IProductOnPageProps } from '../types';
import placeholderImg from '../product-placeholder.png'
import { useNavigate } from 'react-router-dom';

function ProductOnProductsPage(productProps: IProductOnPageProps) {
    const navigate = useNavigate();

    return (
        <div className='page-product'>
            <div className='page-product-images'>
                <img className='page-product-images__thumbnail' 
                    src={productProps.product.thumbnail?.url ?? placeholderImg}
                    onClick={() => navigate('/' + productProps.product.id)}
                />
            </div>
            <div className='page-product-description'>
                <p className='page-product-description__title'
                    onClick={() => navigate('/' + productProps.product.id)}
                >
                    {productProps.product.title}
                </p>
                <p className='page-product-description__price'>
                    {productProps.product.price} р.
                </p>
                <p>
                    Комментарии ({productProps.product.comments?.length ?? 0})
                </p>
            </div>
            
        </div>
    );
}

export default ProductOnProductsPage;