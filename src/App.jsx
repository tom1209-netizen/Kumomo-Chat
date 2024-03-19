import './scss/App.scss'
import Navbar from './component/Navbar'
import ChatWindow from './component/ChatWindow'
import ChatList from './component/ChatList'
import ChatHeader from './component/ChatHeader'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    // <div className="screen">
    //   <Navbar></Navbar>
    //   <ChatList></ChatList>
    //   <ChatWindow userName={"Taniyama Tom"} active={true} ></ChatWindow>
    // </div>
    <Login></Login>
  )
}

export default App
