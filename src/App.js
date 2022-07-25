import './Assets/App.css';
import Canvas from './Components/Canvas';

function App() {
  return (
    <div className="App">
      <text className='title'>Welcome to my Demo</text>
      <Canvas width={1000} height={500}/>
      <text className='description'>If this demo convinced you, do not hesitate to contact me <a href='mailto:ugo.balducci@epfl.ch'>here</a></text>
    </div>
  );
}

export default App;
