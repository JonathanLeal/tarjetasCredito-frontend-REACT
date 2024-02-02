import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Login from './assets/componentes/LoginComponentes/Login';
import Registro from './assets/componentes/Registro';
import Home from './assets/componentes/homeComponentes/Home';
import Sidebar from './assets/componentes/componentesGenerales/Sidebar';
import Transacciones from './assets/componentes/componentesTransacciones/Transacciones';
import Tarjeta from './assets/componentes/componentesTarjeta/Tarjeta';
import Transferencia from './assets/componentes/componentesTransferencia/Transferencia';
import Perfil from './assets/componentes/compoenentesPerfil/Perfil';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/registro' element={<Registro />} />
                <Route
                    path='/home'
                    element={
                        <div className="d-flex">
                            <Sidebar />
                            <div className="flex-grow-1">
                                <Home />
                            </div>
                        </div>
                    }
                />
                <Route
                    path='/transacciones'
                    element={
                        <div className="d-flex">
                            <Sidebar />
                            <div className="flex-grow-1">
                                <Transacciones />
                            </div>
                        </div>
                    }
                />
                <Route
                    path='/tarjetas'
                    element={
                        <div className="d-flex">
                            <Sidebar />
                            <div className="flex-grow-1">
                                <Tarjeta />
                            </div>
                        </div>
                    }
                />
                <Route
                    path='/transferencias'
                    element={
                        <div className="d-flex">
                            <Sidebar />
                            <div className="flex-grow-1">
                                <Transferencia />
                            </div>
                        </div>
                    }
                />
                <Route
                    path='/perfil'
                    element={
                        <div className="d-flex">
                            <Sidebar />
                            <div className="flex-grow-1">
                                <Perfil />
                            </div>
                        </div>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
