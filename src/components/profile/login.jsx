import axios from 'axios';
import sha256 from 'crypto-js/sha256';
import Cookie from "js-cookie";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import env from "../../env.json";
import { useTranslation } from 'react-i18next';
import './login.css';

function Login() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hashedPassword = sha256(password).toString();
        const data = {
            Email: email,
            Password: hashedPassword
        };

        axios.post(`${env.api}/auth/login`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            Cookie.set("signed_in_user", JSON.stringify(response.data));
            navigate("/");
            window.location.reload();
        }).catch((error) => {
            alert(t("login.invalid email or password"));
            console.log(error);
        });
    };

    useEffect(() => {
        document.body.classList.add('no-scroll');

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, []);

    return (
        <div className="login-background">
            <div className="login-container">
                <h1>{t('login.login')}</h1>
                <div className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">{t('login.email')}:</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">{t('login.password')}:</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="login-button" onClick={handleSubmit}>{t('login.login')}</button>
                    <div className="terms">
                        {t('login.by clicking continue, you agree to our')}{' '}
                        <strong>{t('login.terms of service')}</strong> {t('login.and')}{' '}
                        <strong>{t('login.privacy policy')}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
