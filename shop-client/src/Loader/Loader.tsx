import { useDispatch, useSelector } from 'react-redux';
import './Loader.css';
import { setLoadingStatus } from '../productsSlice';
import { ELoadingStatus } from '../types';
import { RootState } from '../reduxStore';

const Loader = () => {
    const dispatch = useDispatch();
    const loadingStatus = useSelector((state: RootState) => state.loadingStatus);

    return (
        <div className="layout">
            <h2 onClick={() => dispatch(setLoadingStatus(ELoadingStatus.LOADED))}>
                { loadingStatus === ELoadingStatus.LOADING 
                    ? "Loading..." 
                    : "Server error"
                } 
            </h2>
        </div>
    )
};

export default Loader;
