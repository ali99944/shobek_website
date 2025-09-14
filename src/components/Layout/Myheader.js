import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from "react-router-dom";
import { GiShoppingBag } from "react-icons/gi";
import { FaMapMarkerAlt, FaHeadset, FaUser, FaHome, FaList } from "react-icons/fa";
import { useAuth } from '../../context/auth';
import toast from "react-hot-toast";
import SearchInput from '../Form/SearchInput';
import { useCart } from '../../context/cart';
import {Badge} from "antd";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';
import axios from 'axios';

const Myheader = () => {
    const [auth, setAuth] = useAuth();
    const [cart] = useCart();
    const [categories, setCategories] = useState([]);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const isRTL = i18n.language === 'ar';
    const backendUrl = process.env.BACKEND_URL || "https://shobek-server.vercel.app";

    const handleLogout = () => {
        setAuth({
            ...auth,
            user: null,
            token: ""
        });
        localStorage.removeItem("auth");
        toast.success(t('auth.logoutSuccessful'));
    };

    const handleLocationClick = () => {
        if (!auth.user) {
            navigate('/login');
            toast.error(isRTL ? 'يرجى تسجيل الدخول أولاً' : 'Please login first');
        } else {
            navigate('/dashboard/user/profile');
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/v1/category/getcategories`);
            if (data?.success) {
                setCategories(data.categories || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <>
        <div style={{
            background: '#e3f2fd'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '1px',
                padding: '8px',
            }}>
                            <div className="top-header-left">
                                <span className="welcome-text">
                                    {isRTL ? 'مرحباً بكم في شبيك لبيك' : 'Welcome to shopaik lopaik'}
                                </span>
                            </div>
                        </div>
        </div>
            {/* Top Header Bar */}
            <div className="top-header-bar" style={{
                background: 'var(--primary-blue)',
                color: 'white !important'
            }}>
                <div className="container-fluid">
                    <div className="row align-items-center flex-column flex-md-row">
                        
                        <div className="col-12  d-flex justify-content-end">
                            <div className="top-header-right d-flex justify-content-between w-100">
                                <Link to="/cart" className="action-btn cart-btn">
                                    <Badge count={cart?.length} showZero>
                                        <GiShoppingBag className="action-icon" style={{
                                            color: 'white'
                                        }} />
                                        {/* <span className="action-text">
                                            {t('navbar.cart')}
                                        </span> */}
                                    </Badge>
                                </Link>
                                <div className='d-flex gap-4'>
                                    <LanguageSwitcher />
                                {!auth.user ? (
                                    <div className="auth-links">
                                        <Link to="/login" className="auth-link me-2">
                                            <FaUser className="me-1" />
                                            {t('navbar.login')}
                                        </Link>
                                        <span className="separator mx-2">|</span>
                                        <Link to="/register" className="auth-link">
                                            {t('navbar.register')}
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="user-menu">
                                        <div className="dropdown">
                                            <button className="user-dropdown-btn" data-bs-toggle="dropdown">
                                                <FaUser className="me-1" />
                                                <span className="user-name-text">{auth?.user?.name}</span>
                                                <i className="fas fa-chevron-down ms-1"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li>
                                                    <Link to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`} className="dropdown-item">
                                                        {t('navbar.dashboard')}
                                                    </Link>
                                                </li>
                                                <li>
                                                    <button onClick={handleLogout} className="dropdown-item">
                                                        {t('navbar.logout')}
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className="main-header" style={{ backgroundColor: '#e3f2fd' }}>
                <div className="container-fluid">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-lg-9 col-md-8">
                            <div className="header-search">
                                <SearchInput />
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-4 d-flex justify-content-center">
                            <div className="header-actions d-flex align-items-center" style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <Link to="/" className="action-btn home-btn">
                                    <FaHome className="action-icon" />
                                    <span className="action-text">
                                        {isRTL ? 'الرئيسية' : 'Home'}
                                    </span>
                                </Link>
                                {categories.length > 0 && (
                                    <div className="dropdown categories-dropdown">
                                        <button 
                                            className="action-btn categories-btn" 
                                            type="button" 
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <FaList className="action-icon" />
                                            <span className="action-text">
                                                {isRTL ? 'الفئات' : 'Categories'}
                                            </span>
                                        </button>
                                        <ul className="dropdown-menu categories-dropdown-menu">
                                            {categories.map(category => (
                                                <li key={category._id}>
                                                    <Link 
                                                        to={`/category/${category._id}`}
                                                        className="dropdown-item category-dropdown-item"
                                                        onClick={() => window.scrollTo(0, 0)}
                                                    >
                                                        {category.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <button className="action-btn location-btn" onClick={handleLocationClick}>
                                    <FaMapMarkerAlt className="action-icon" />
                                    <span className="action-text">
                                        {isRTL ? 'اختر موقعك' : 'Choose Location'}
                                    </span>
                                </button>
                                <Link to="/contactus" className="action-btn support-btn">
                                    <FaHeadset className="action-icon" />
                                    <span className="action-text">
                                        {isRTL ? 'دعم العملاء' : 'Customer Support'}
                                    </span>
                                </Link>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </header>


        </>
    );
};

export default Myheader;
