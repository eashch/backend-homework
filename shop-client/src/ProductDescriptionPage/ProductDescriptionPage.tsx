import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxStore';
import './ProductDescriptionPage.css';
import { IProduct, ISimilarEntity } from '../types';
import placeholderImg from '../product-placeholder.png'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductDescriptionPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const products = useSelector((state: RootState) => state.products);
    const [product, setProduct] = useState<IProduct | null>(null);
    const [similarProductIDs, setSimilarProductIDs] = useState<string[] | null>(null);

    const getSimilarForProduct = async (): Promise<string[] | null> => {
        try {
            const { data } = await axios.get<string[]>(
                `/api/similar/${location.pathname.substring(1)}`
            );
            if (!data || !data.length) 
                return null;
            setSimilarProductIDs(data);
    
            return data;
        } catch (e) {
            return null;
        }
    }

    useEffect(() => {
        getSimilarForProduct();
    }, []);

    useEffect(() => {
        products.find(item => {
            if (item.id === location.pathname.substring(1)) {
                setProduct(item);
                return true;
            }
            return false;
        })
        getSimilarForProduct();
    }, [products, location.pathname]);

    const getSmallImages = (): JSX.Element[] => {
        if (!product || !product.images)
            return [];
        return product.images.map((image) => {
            if (image.main)
                return <></>;
            return (
                <img className='product-images__small-image' 
                    src={image.url}
                    key={image.id}
                />
            );
        }); 
    };

    const getComments = (): JSX.Element[] => {
        if (!product || !product.comments)
            return [];
        return product.comments.map((comment) => {
            return (
                <div className='product-comment' key={comment.id}>
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

    const getSimilarProducts = (): JSX.Element[] => {
        if (!product || !similarProductIDs)
            return [];
        const similarItems: JSX.Element[] = products.map(item => {
            if (similarProductIDs.includes(item.id)) {
                return (
                    <div className='similar-item'
                        key={item.id}
                    >
                        <p className='similar-item__title'
                            onClick={() => navigate(`/${item.id}`)}
                        >
                            {item.title}
                        </p>
                        <p className='similar-item__price'>
                            {item.price} p.
                        </p>
                    </div>
                );
            }
            return <></>;
        });
        return similarItems;
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
                <div className='product-container'>
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
                            {product.price} p.
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
                <div className='similar-products'
                    style={{display: similarProductIDs?.length ? "flex" : "none"}}
                >
                    <p className='similar-products__title'>
                        Похожие товары
                    </p>
                    {getSimilarProducts()}
                </div>
            </div>
    );
}

export default ProductDescriptionPage;