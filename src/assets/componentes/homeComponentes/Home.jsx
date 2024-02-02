import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

const Home = () => {
    const [selectedDay, setSelectedDay] = useState(null);
    const [transacciones, setTransacciones] = useState({});
    const [collapseState, setCollapseState] = useState({});

    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const handleDayClick = async (day) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post('http://127.0.0.1:8000/api/auth/verTransacciones', { dia: day }, { headers: { Authorization: `Bearer ${token}` } });
            setTransacciones({ ...transacciones, [day]: response.data });
            setSelectedDay(day);
            setCollapseState({ ...collapseState, [day]: !collapseState[day] });
        } catch (error) {
            if (error.response.status === 500) {
                Swal.fire('Error', 'Hubo un problema al obtener las transacciones.', 'error');
            }

            if (error.response.status === 404) {
                Swal.fire('Error', 'Este dia no tiene transacciones registradas', 'error');
            }
        }
    };

    const renderTable = (day) => {
        if (selectedDay === day && transacciones[day]) {
            return (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Monto</th>
                            <th>Número de Tarjeta</th>
                            <th>Concepto</th>
                            <th>Envia a</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transacciones[day].map((transaccion) => (
                            <tr key={transaccion.id}>
                                <td>{transaccion.id}</td>
                                <td>{transaccion.name}</td>
                                <td>{transaccion.monto}</td>
                                <td>{transaccion.numTarjeta}</td>
                                <td>{transaccion.concepto}</td>
                                <td>{transaccion.aignado_a}</td>
                                <td>{transaccion.fecha}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else {
            return <p>No hay transacciones para este día.</p>;
        }
    };

    return (
        <div>
            {daysOfWeek.map((day) => (
                <div key={day}>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleDayClick(day)}
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${day}`}
                        aria-expanded={collapseState[day]}
                        aria-controls={`collapse${day}`}
                    >
                        {day}{' '}
                        <FontAwesomeIcon icon={collapseState[day] ? faChevronUp : faChevronDown} />
                    </button>
                    <div className={`collapse ${collapseState[day] ? 'show' : ''}`} id={`collapse${day}`}>
                        <div className="card card-body">{renderTable(day)}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Home;
