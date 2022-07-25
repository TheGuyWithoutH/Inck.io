import {useState} from 'react';
import './Assets/App.css';
import Canvas from './Components/Canvas';
import Modal from './Components/Modal';

function App() {
  const [show, setShow] = useState(false)

  function showModal(e) {
    setShow(!show)
  };

  return (
    <div className="App">
      <text className='title'>Welcome to my Demo</text>
      <Canvas width={1000} height={500}/>
      <text className='description'>If this demo convinced you, do not hesitate to contact me <a href='mailto:ugo.balducci@epfl.ch'>here</a></text>
      <button className='help' onClick={e => {showModal(e);}}>❔</button>
      <Modal onClose={showModal} show={show}>
          Try to make a circle. Then try to erase it with the eraser tool.
          <br/>
          The library used for shape recognition is <a href='https://github.com/Appfairy/shapeit'>Shapeit</a>
        </Modal>
    </div>
  );
}

export default App;
