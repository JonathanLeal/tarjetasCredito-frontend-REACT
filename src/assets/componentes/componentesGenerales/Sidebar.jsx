import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faArrowRight, faChartBar, faUser, faHome } from '@fortawesome/free-solid-svg-icons';
import { Navbar, Nav } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const irLogin = () => navigate("/")

    const handleLogout = () => {
        const token = sessionStorage.getItem('token');

        if (token) {
            axios.post('http://127.0.0.1:8000/api/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } })
                .then(() => {
                    sessionStorage.removeItem('token');
                    setUser(null);
                    irLogin();
                })
                .catch(error => {
                    // Handle error if needed
                    console.error("Logout error:", error);
                });
        }
    };

    useEffect(() => {
        // Leer el token desde sessionStorage
        const token = sessionStorage.getItem('token');
    
        // Verificar si el token está presente antes de realizar la solicitud
        if (token) {
            // Realizar una solicitud para obtener los detalles del usuario utilizando el token
            axios.post('http://127.0.0.1:8000/api/auth/me', {}, { headers: { Authorization: `Bearer ${token}` } })
                .then(response => {
                    setUser(response.data);
                })
                .catch(error => {
                    if (error.response.status === 401) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oppsss....',
                            text: 'Tu sesion a expirado vuelve a iniciar sesion',
                        }).then(() => {
                            irLogin();
                        })
                      }
                });
        }
    }, []);

    return (
        <Navbar bg="dark" variant="dark" className="sidebar d-flex flex-column m-0">
            <Nav className="flex-column">
                <Nav.Item>
                    <Nav.Link as={Link} to="/perfil" className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faUser} className="mr-2" /> {user && user.name}
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/home" className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faHome} className="mr-2" /> Inicio
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/transacciones" className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faChartBar} className="mr-2" /> Transacciones
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/tarjetas" className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faCreditCard} className="mr-2" /> Tarjetas
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/transferencias" className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faArrowRight} className="mr-2" /> Transferencias
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/control-gastos" className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faChartBar} className="mr-2" /> Control de gastos
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                <Nav.Link onClick={handleLogout} className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faArrowRight} className="mr-2" /> Cerrar Sesión
                </Nav.Link>
            </Nav.Item>
            </Nav>
        </Navbar>
    );
};

export default Sidebar;
