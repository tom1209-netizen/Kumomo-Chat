import '../scss/Home.scss'
import Navbar from '../component/Navbar'
import ChatWindow from '../component/ChatWindow'
import ChatList from '../component/ChatList'

function Home() {
  return (
    <>
      <div className="app-container">
        <Navbar />
        <ChatList />
        <ChatWindow />
      </div>
    </>
  )
}

export default Home
