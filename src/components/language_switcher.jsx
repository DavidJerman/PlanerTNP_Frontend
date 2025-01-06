import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import './language_switcher.css';

function LanguageSwitcher() {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setIsOpen(false); // Close dropdown after selection
    };

    return (
        <div className="language-switcher">
            <button
                className="dropdown-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                🌐 {t('language')}
            </button>
            {isOpen && (
                <ul className="dropdown-menu">
                    <li onClick={() => changeLanguage('en')}>English</li>
                    <li onClick={() => changeLanguage('sl')}>Slovenščina</li>
                </ul>
            )}
        </div>
    );
}

export default LanguageSwitcher;
