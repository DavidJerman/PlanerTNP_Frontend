import axios from 'axios';
import Cookie from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import env from "../../env.json";
import { useTranslation } from 'react-i18next'; // Import the hook for translation
import './profile.css';

function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Get translation function

  const [userData, setUserData] = useState({
    FirstName: '',
    LastName: '',
    Username: '',
    Email: '',
    Country: '',
    PhoneNumber: '',
    Location: '',
    Birthday: {
      Day: '',
      Month: '',
    },
  });

  useEffect(() => {
    if (Cookie.get("signed_in_user") !== undefined) {
      const user = JSON.parse(Cookie.get('signed_in_user'));

      axios.get(`${env.api}/auth/user/${user._id}/get-profile`).then((response) => {
        setUserData((prevData) => ({
          ...prevData,
          Email: response.data.Email || "",
          Username: response.data.Username || "",
          FirstName: response.data.FirstName || "",
          LastName: response.data.LastName || "",
          Country: response.data.Country || "",
          PhoneNumber: response.data.PhoneNumber || "",
          Location: response.data.Location || "",
          Birthday: {
            Day: response.data.Birthday?.Day || "",
            Month: response.data.Birthday?.Month || "",
          },
        }));
      }).catch((error) => {
        console.log('Error:', error);
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Day' || name === 'Month') {
      setUserData((prevData) => ({
        ...prevData,
        Birthday: {
          ...prevData.Birthday,
          [name]: value,
        },
      }));
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSaveChanges = () => {
    const user = JSON.parse(Cookie.get('signed_in_user'));
    axios.put(`${env.api}/auth/user/${user._id}/update-data`, userData).then(() => {
      alert(t('myprofile.changes saved!'));
    }).catch((error) => {
      console.log('Error:', error);
    });
  };

  const handleDeleteAccount = () => {
    if (window.confirm(t('myprofile.are you sure you want to delete your account?'))) {
      const user = JSON.parse(Cookie.get('signed_in_user'));
      axios.delete(`${env.api}/auth/user/${user._id}`).then(() => {
        Cookie.remove("signed_in_user");
        alert(t('myprofile.account deleted'));
        navigate("/");
        window.location.reload();
      }).catch((error) => {
        console.log('Error:', error);
      });
    }
  };

  return (
      <div className="page-background">
        <div className="profile-container">
          <h1>{t('myprofile.my profile')}</h1>
          <form className="profile-form">
            <div className="form-group">
              <label>{t('myprofile.first name')}:</label>
              <input
                  type="text"
                  name="FirstName"
                  value={userData.FirstName}
                  onChange={handleChange}
                  placeholder={t('myprofile.first name')}
              />
            </div>
            <div className="form-group">
              <label>{t('myprofile.last name')}:</label>
              <input
                  type="text"
                  name="LastName"
                  value={userData.LastName}
                  onChange={handleChange}
                  placeholder={t('myprofile.last name')}
              />
            </div>
            <div className="form-group">
              <label>{t('myprofile.username')}:</label>
              <input
                  type="text"
                  name="Username"
                  value={userData.Username}
                  onChange={handleChange}
                  placeholder={t('myprofile.username')}
              />
            </div>
            <div className="form-group">
              <label>{t('myprofile.email')}:</label>
              <input
                  type="email"
                  name="Email"
                  value={userData.Email}
                  onChange={handleChange}
                  placeholder={t('myprofile.email')}
              />
            </div>
            <div className="form-group">
              <label>{t('myprofile.country')}:</label>
              <input
                  type="text"
                  name="Country"
                  value={userData.Country}
                  onChange={handleChange}
                  placeholder={t('myprofile.country')}
              />
            </div>
            <div className="form-group">
              <label>{t('myprofile.phone number')}:</label>
              <input
                  type="text"
                  name="PhoneNumber"
                  value={userData.PhoneNumber}
                  onChange={handleChange}
                  placeholder={t('myprofile.phone number')}
              />
            </div>
            <div className="form-group">
              <label>{t('myprofile.location')}:</label>
              <input
                  type="text"
                  name="Location"
                  value={userData.Location}
                  onChange={handleChange}
                  placeholder={t('myprofile.location')}
              />
            </div>
            <div className="form-group birthday-group">
              <label>{t('myprofile.birthday')}:</label>
              <input
                  type="text"
                  name="Day"
                  value={userData.Birthday.Day}
                  onChange={handleChange}
                  placeholder={t('myprofile.day')}
              />
              <input
                  type="text"
                  name="Month"
                  value={userData.Birthday.Month}
                  onChange={handleChange}
                  placeholder={t('myprofile.month')}
              />
            </div>
            <button type="button" className="save-button" onClick={handleSaveChanges}>
              {t('myprofile.save changes')}
            </button>
          </form>
          <div className="delete-account-section">
            <h2>{t('myprofile.delete account')}</h2>
            <p>{t('myprofile.after deleting your account')}</p>
            <button type="button" className="delete-button" onClick={handleDeleteAccount}>
              {t('myprofile.delete my account')}
            </button>
          </div>
        </div>
      </div>
  );
}

export default Profile;
