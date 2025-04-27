import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';
import Asd from './builder/DragDrop';
import CurvedLine from './builder/CurvedLine';

const line = {
    startX: 100,
    startY: 100,
    endX: 300,
    endY: 200,
};

function App() {

  
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/command_builder" element={<Asd pageName='Command Builder' />} />
                <Route path="/playground" element={<CurvedLine line={line} />} />
            </Routes>
        </Router>
    );
}

export default App;
