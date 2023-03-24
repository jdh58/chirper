import './styles/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import Bookmarks from './components/Bookmarks';
import Notifications from './components/Notifications';
import Explore from './components/Explore';
import Home from './components/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={SignIn}></Route>
        <Route path="/home" element={Home}></Route>
        <Route path="/explore" element={Explore}></Route>
        <Route path="/notifications" element={Notifications}></Route>
        <Route path="/bookmarks" element={Bookmarks}></Route>
        <Route path="/profile/:id"></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
