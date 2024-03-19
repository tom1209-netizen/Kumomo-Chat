import './scss/App.scss'
import { AuthContext } from './context/AuthContext'
import { useContext } from 'react'
import Navbar from './component/Navbar'
import ChatWindow from './component/ChatWindow'
import ChatList from './component/ChatList'
import ChatHeader from './component/ChatHeader'
import Login from './pages/Login'
import Register from './pages/Register'
import Message from './component/Message'

function App() {
  const {currentUser} = useContext(AuthContext);

  console.log(currentUser)
  return (
    <>
      <div className="app-container">
        <Navbar />
        <ChatList />
        <ChatWindow userName="Phúc Du" active={true} />
      </div>
    </>
  )
}

export default App
