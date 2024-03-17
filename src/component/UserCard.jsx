import user_profile from "../assets/img/user_profile.jpg"
import "../scss/UserCard.scss"

function UserCard({userName, time, latestMsg, active}) {
  return (
    <div className="user-card">
      <div className="user-profile">
        <img src={user_profile} className='profile-img' alt="" />
        {active && <div className="active-indicator" />}
      </div>
      <div className="info">
        <div className="name-time">
          <h1 className='name'>{userName}</h1>
          <p className='time'>{time}</p>
        </div>
        <div className="latest-msg-container">
          <p className='msg'>{latestMsg}</p>
          <div className="num-container">
            <p className='num'>2</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserCard