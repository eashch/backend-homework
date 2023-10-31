import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxStore';
import './ProductDescriptionPage.css';
import { IProduct } from '../types';
import placeholderImg from '../product-placeholder.png'
import { useLocation } from 'react-router-dom';

function ProductDescriptionPage() {
    const location = useLocation();
    console.log("ID? " + location.pathname);
    const products = useSelector((state: RootState) => state.products);
    const [product, setProduct] = useState<IProduct | null>(null);

    useEffect(() => {
        products.find(item => {
            if (item.id === location.pathname.substring(1)) {
                setProduct(item);
                return true;
            }
            return false;
        })
        
    }, [products]);

    const getSmallImages = (): JSX.Element[] => {
        if (!product || !product.images)
            return [];
        return product.images.map((image) => {
            if (image.main)
                return <></>;
            return (
                <img className='product-images__small-image' 
                    src={image.url}
                />
            );
        }); 
    };

    const getComments = (): JSX.Element[] => {
        if (!product || !product.comments)
            return [];
        return product.comments.map((comment) => {
            return (
                <div className='product-comment'>
                    <p className='product-comment__title'>
                        {comment.name}
                    </p>
                    <p className='product-comment__email'>
                        {comment.email}
                    </p>
                    <p className='product-comment__body'>
                        {comment.body}
                    </p>
                </div>
            );
        });
    }

    return (
        product === null 
        ?
            <div className='product-error'>
                <p className='product-error__text'>
                    No product with this id
                </p>
            </div>
        :
            <div className='product'>
                <div className='product-images'>
                    <img className='product-images__thumbnail' 
                        src={product.thumbnail?.url ?? placeholderImg}
                    />
                    <div className='product-images_small'>
                        {getSmallImages()}
                    </div>
                </div>
                <div className='product-description'>
                    <p className='product-description__title'>
                        {product.title}
                    </p>
                    <p className='product-description__price'>
                        {product.price} р.
                    </p>
                    <p>
                        {product.description}
                    </p>
                    <div className='product-separator'></div>
                    <div className='product-similar'>

                    </div>
                    <div className='product-comments'>
                        {getComments()}
                    </div>
                </div>
            </div>
    );
}

export default ProductDescriptionPage;