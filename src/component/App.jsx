import '../scss/App.scss'
import Navbar from './Navbar'
import ChatWindow from './ChatWindow'
import ChatList from './ChatList'

function App() {
  return (
    <div className="screen">
      <Navbar></Navbar>
      <ChatList></ChatList>
      <ChatWindow userName={"Taniyama Tom"} active={true} ></ChatWindow>
    </div>
  )
}

export default App
