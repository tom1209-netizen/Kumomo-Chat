import "../scss/UserCard.scss"
import PropTypes from 'prop-types';

function UserCard({userName, profileUrl, time, latestMsg, onClick}) {
  return (
    <div className="user-card" onClick={onClick}>
      <div className="user-profile">
        <img src={profileUrl} className='profile-img' alt="" />
      </div>
      <div className="info">
        <div className="name-time">
          <h1 className='name'>{userName}</h1>
          <p className='time'>{time}</p>
        </div>
        <div className="latest-msg-container">
          <p className='msg'>{latestMsg}</p>
        </div>
      </div>
    </div>
  )
}

UserCard.propTypes = {
  userName: PropTypes.string,
  profileUrl: PropTypes.string,
  time: PropTypes.string,
  latestMsg: PropTypes.string,
  onClick: PropTypes.func,
}

export default UserCard