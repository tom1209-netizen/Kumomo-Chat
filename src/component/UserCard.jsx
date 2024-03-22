import "../scss/UserCard.scss"
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

function UserCard({userName, profileUrl, time, latestMsg, onClick}) {
  return (
    <div className="user-card" onClick={onClick}>
      <div className="user-profile">
        <Avatar size={50} icon={<UserOutlined />} src={profileUrl}/>
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