import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faMoneyBill, faCalendar, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

const Transacciones = () => {
    const [tarjetas, setTarjetas] = useState([]);
    const [transacciones, setTransacciones] = useState([]);
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        const obtenerTarjetas = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/auth/tarjetas', {}, { headers: { Authorization: `Bearer ${token}` } });
                setTarjetas(response.data);
            } catch (error) {
                console.error('Error al obtener las tarjetas:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al obtener las tarjetas.',
                });
            }
        };

        const obtenerTransacciones = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/auth/transaccionesCompletas', {}, { headers: { Authorization: `Bearer ${token}` } });
                setTransacciones(response.data);
            } catch (error) {
                console.error('Error al obtener las transacciones:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al obtener las transacciones.',
                });
            }
        };

        obtenerTarjetas();
        obtenerTransacciones();
    }, [token]); 

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Tarjetas de Crédito</h1>
            <div className="row">
                {tarjetas.map((tarjeta) => (
                    <div
                        key={tarjeta.id}
                        className="col-md-6"
                    >
                        <div className="card mb-4" style={{ maxWidth: '18rem', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <div className="card-header text-right small" style={{ backgroundColor: '#3498db', color: '#fff', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                                {tarjeta.banco}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <FontAwesomeIcon icon={faMoneyBill} className="mr-2" style={{ color: '#27ae60' }} />
                                    Monto: ${tarjeta.monto}
                                </h5>
                                <p className="card-text small">
                                    <FontAwesomeIcon icon={faCreditCard} className="mr-2" style={{ color: '#e74c3c' }} />
                                    Número: {tarjeta.numTarjeta}
                                </p>
                                <p className="card-text x-small">
                                    <FontAwesomeIcon icon={faUser} className="mr-2" style={{ color: '#f39c12' }} />
                                    {tarjeta.name}
                                </p>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="card-text small">
                                            <FontAwesomeIcon icon={faCreditCard} className="mr-2" style={{ color: '#e74c3c' }} />
                                            CVV: {tarjeta.cvv}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="card-text small">
                                            <FontAwesomeIcon icon={faCalendar} className="mr-2" style={{ color: '#27ae60' }} />
                                            Valida: {tarjeta.fechaVencimiento}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4">
                <h2 className="text-center mb-4">Transacciones Completas</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Monto</th>
                            <th>Concepto</th>
                            <th>Fecha</th>
                            <th>Asignado a</th>
                            <th>Día</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transacciones.map((transaccion) => (
                            <tr key={transaccion.id}>
                                <td>{transaccion.id}</td>
                                <td>{transaccion.name}</td>
                                <td>${transaccion.monto}</td>
                                <td>{transaccion.concepto}</td>
                                <td>{transaccion.fecha}</td>
                                <td>{transaccion.aignado_a}</td>
                                <td>{transaccion.dia}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transacciones;
