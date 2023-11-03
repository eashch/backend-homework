import { Outlet, useNavigate, useLocation } from "react-router-dom";
import './Layout.css';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="layout">
            <header className="layout-header">
                <h1 
                className={location.pathname !== "/" 
                    ? "layout__button-home_active" 
                    : "layout__button-home"} 
                onClick={() => {
                    if (location.pathname !== "/")
                        navigate('/');
                }}>
                    Shop.Client
                </h1>
            </header>
            <Outlet />
        </div>
    )
};

export default Layout;
