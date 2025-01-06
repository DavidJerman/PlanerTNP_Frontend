import axios from 'axios';
import sha256 from 'crypto-js/sha256';
import Cookie from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import sha256 from 'crypto-js/sha256';
import axios from 'axios';
import env from '../../env.json';
import './login.css';

function Register() {
    const { t } = useTranslation(); // Access translation
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('no-scroll');
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert(t('register.passwordMismatch'));
            return;
        }

        const hashedPassword = sha256(password).toString();
        const data = {
            Username: username,
            Email: email,
            Password: hashedPassword
        };

        try {
            await axios.post(`${env.api}/auth/register`, data, {
                headers: { 'Content-Type': 'application/json' }
            });
            alert(t('register.success'));
            navigate("/login");
        } catch (error) {
            console.log('Error:', error);
            alert(t('register.error'));
        }
    };

    return (
        <div className="login-background">
            <div className="login-container">
                <h1>{t('register.title')}</h1>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">{t('register.username')}:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">{t('register.email')}:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">{t('register.password')}:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">{t('register.confirmPassword')}:</label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">{t('register.button')}</button>
                </form>
                <div className="terms">
                    {t('register.terms')}
                </div>
            </div>
        </div>
    );
}

export default Register;
