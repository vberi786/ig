import './App.css';
import { useContext } from 'react';
import Login from "./pages/Login";
import SignUp from './pages/SignUp';
import Feed from './pages/Feed';
import Reels from './pages/Reels';
import {Routes,Route} from "react-router-dom";
import { AuthContext } from './context/AuthContext';

function App() {
  const {currentUser}=useContext(AuthContext);
  console.log(currentUser);

  return (
    <div className="App">
      <Routes>
        <Route path='/lg' element={currentUser?<Feed/>:<Login/>}/>
        <Route path='/reel' element={currentUser?<Reels/>:<Login/>}/>
        <Route path='/login' element={currentUser?<Feed/>:<Login/>}/>
        <Route path='/signup' element={currentUser?<Feed/>:<SignUp/>}/>
      </Routes>
      </div>
  );
}

export default App;
