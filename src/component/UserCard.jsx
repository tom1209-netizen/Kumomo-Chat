import "../scss/UserCard.scss"

function UserCard({userName, profileUrl, time, latestMsg, active, onClick}) {
  return (
    <div className="user-card" onClick={onClick}>
      <div className="user-profile">
        <img src={profileUrl} className='profile-img' alt="" />
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