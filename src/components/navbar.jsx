import Cookie from "js-cookie";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./language_switcher";
import '../App.css';
import './navbar.css';

function Navbar({ toggleTheme, darkMode }) {
    const location = useLocation();
    const [signedIn, setSignedIn] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (Cookie.get("signed_in_user") !== undefined) {
            setSignedIn(Cookie.get("signed_in_user"));
        } else {
            setSignedIn(false);
        }
    }, []);

    function logout() {
        Cookie.remove("signed_in_user");
        window.location.replace(`http://${window.location.host}/`);
    }

    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className={`navbar-item ${location.pathname === '/' ? 'active' : ''}`}>
                    <Link to="/">{t('navbar.home')}</Link>
                </li>
                {signedIn !== false ? (
                    <>
                        <li className={`navbar-item ${location.pathname === '/todos' ? 'active' : ''}`}>
                            <Link to="/todos">{t('navbar.todos')}</Link>
                        </li>
                        <li className={`navbar-item ${location.pathname === '/todo-history' ? 'active' : ''}`}>
                            <Link to="/todo-history">{t('navbar.todosHistory')}</Link>
                        </li>
                        <li className={`navbar-item ${location.pathname === '/pie' ? 'active' : ''}`}>
                            <Link to="/pie">{t('navbar.pie')}</Link>
                        </li>
                        <li className={`navbar-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                            <Link to="/profile">{t('navbar.profile')}</Link>
                        </li>
                        <li className={`navbar-item`}>
                            <Link onClick={logout}>{t('navbar.logout')}</Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li className={`navbar-item ${location.pathname === '/login' ? 'active' : ''}`}>
                            <Link to="/login">{t('navbar.login')}</Link>
                        </li>
                        <li className={`navbar-item ${location.pathname === '/register' ? 'active' : ''}`}>
                            <Link to="/register">{t('navbar.register')}</Link>
                        </li>
                    </>
                )}
                <li className="navbar-item">
                    <LanguageSwitcher />
                </li>
                <li className="navbar-item">
                    <button className="theme-toggle-button" onClick={toggleTheme}>
                        {darkMode ? t("navbar.light_mode") : t("navbar.dark_mode")}
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;