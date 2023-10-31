import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxStore';
import { IProduct } from '../types';

function MainPage() {
    const navigate = useNavigate();
    const products = useSelector((state: RootState) => state.products);

    const getTotalPrice = () => {
        return products.reduce(
            (prev: number, current: IProduct) => prev + current.price, 
            0);
    }

    return (
        <div className='main-page'>
            <h3>
                В базе данных находится {products.length} товаров общей стоимостью {getTotalPrice()}
            </h3>
            <button className='button' onClick={() => navigate("/products-list")}>
                Перейти к списку товаров
            </button>
        </div>
    );
}

export default MainPage;