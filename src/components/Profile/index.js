import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

const Profile = () => {
  const [session, setSession] = useState([]);
  const [jwtToken, setJwtToken] = useState(Cookies.get('jwtToken'));
  const [username, setUsername] = useState(JSON.parse(localStorage.getItem('user')).username);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllSession = async () => {
      const url = 'https://clawn-backendprojk.netlify.app/sessions';

      const response = await fetch(url);
      if (response.ok) {
        const responseToJson = await response.json();
        console.log('response', responseToJson);
        setSession(responseToJson);
      } else {
        console.log('Error fetching all sessions');
      }
    };

    fetchAllSession();
  }, []);

  const logoutUser = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log('usersData', userData.id);

    const url = 'https://clawn-backendprojk.netlify.app/loginSession';

    const data = {
      user_id: userData.id,
      login_time: localStorage.getItem('loginTime'),
      logout_time: new Date().toString(),
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);
    if (response.ok) {
      console.log('Logout successful');
      Cookies.remove('jwtToken');
      localStorage.removeItem('user');
      localStorage.removeItem('loginTime');
      navigate('/login');
    } else {
      console.log('Logout failed');
    }
  };

  if (!jwtToken) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <div className="profile-container">
        <h1>Profile</h1>
        <h2>Welcome, {username}!</h2>

        <h3>Hey back to Home</h3>
        <Link to="/">
          <button className="home-profile-button" type="button">
            Home
          </button>
        </Link>

        <h3>or</h3>
        <button className="user-logout-button" onClick={logoutUser} type="button">
          Logout
        </button>
      </div>

      <hr />

      <div className="time-spend-spent-container">
        {session.length > 0 ? (
          <div className="session-container">
            {session.map((session, index) => (
              <div className="session" key={session.id}>
                <p>id:{session.id}</p>
                <p>Start time: {session.login_time}</p>
                <p>End time: {session.logout_time}</p>
                <hr />
              </div>
            ))}
          </div>
        ) : (
          <div className="no-session-container">
            <h3>No sessions yet</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;