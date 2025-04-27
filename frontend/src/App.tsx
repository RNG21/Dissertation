import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';
import CommandBuilder from './builder/builder';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/command_builder" element={<CommandBuilder />} />
            </Routes>
        </Router>
    );
}

export default App;
