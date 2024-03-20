import './scss/App.scss'
import { AuthContext } from './context/AuthContext'
import { useContext } from 'react'
import Navbar from './component/Navbar'
import ChatWindow from './component/ChatWindow'
import ChatList from './component/ChatList'

function App() {
  const {currentUser} = useContext(AuthContext);

  console.log(currentUser)
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

export default App
