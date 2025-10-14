import React, { useState } from 'react';
import { FaDollarSign, FaFileContract, FaChartLine, FaPlus, FaPercentage, FaHandshake, FaArrowUp, FaCalendarAlt, FaTimes, FaSave, FaHome, FaUser, FaMapMarkerAlt, FaClock, FaCheckCircle } from 'react-icons/fa';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

// Syncfusion Components
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, LineSeries, Category, Tooltip, Legend, ColumnSeries, AccumulationChartComponent, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, AccumulationLegend, AccumulationDataLabel, AccumulationTooltip, PieSeries } from '@syncfusion/ej2-react-charts';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Sort, Filter, Inject as GridInject } from '@syncfusion/ej2-react-grids';

const Ventas = () => {
  const { currentMode, currentColor } = useStateContext();
  
  // Estados para los modales
  const [showModalVenta, setShowModalVenta] = useState(false);
  const [showModalAlquiler, setShowModalAlquiler] = useState(false);
  const [showModalSeguimiento, setShowModalSeguimiento] = useState(false);
  
  // Estados para modales de estadísticas
  const [showModalVentasMes, setShowModalVentasMes] = useState(false);
  const [showModalOperacionesActivas, setShowModalOperacionesActivas] = useState(false);
  const [showModalComisiones, setShowModalComisiones] = useState(false);
  const [showModalTasaCierre, setShowModalTasaCierre] = useState(false);
  
  // Estado para nueva venta
  const [nuevaVenta, setNuevaVenta] = useState({
    propiedad: '',
    cliente: '',
    monto: '',
    moneda: 'USD',
    agente: '',
    fechaCierre: '',
    comision: '3.5',
    formaPago: 'Contado',
    observaciones: '',
  });
  
  // Estado para nuevo alquiler
  const [nuevoAlquiler, setNuevoAlquiler] = useState({
    propiedad: '',
    cliente: '',
    montoMensual: '',
    moneda: 'USD',
    agente: '',
    fechaInicio: '',
    duracion: '12',
    deposito: '',
    comision: '1',
    observaciones: '',
  });
  
  // Estado para seguimiento
  const [nuevoSeguimiento, setNuevoSeguimiento] = useState({
    operacion: '',
    tipo: 'Llamada',
    fecha: '',
    hora: '',
    descripcion: '',
    prioridad: 'Media',
  });

  const operaciones = [
    { id: 1, tipo: 'Venta', propiedad: 'Depto 2amb Palermo', cliente: 'Juan Pérez', monto: 150000, estado: 'En Curso', fecha: '2025-10-05', agente: 'Ana López', comision: 5250 },
    { id: 2, tipo: 'Alquiler', propiedad: 'Casa 3amb Belgrano', cliente: 'María González', monto: 1200, estado: 'Cerrada', fecha: '2025-09-28', agente: 'Carlos Ruiz', comision: 1200 },
    { id: 3, tipo: 'Venta', propiedad: 'Oficina Microcentro', cliente: 'Empresa XYZ', monto: 280000, estado: 'Reservada', fecha: '2025-10-10', agente: 'Laura Fernández', comision: 9800 },
    { id: 4, tipo: 'Venta', propiedad: 'PH Colegiales', cliente: 'Ana Martínez', monto: 320000, estado: 'Cerrada', fecha: '2025-10-01', agente: 'Sofía Torres', comision: 11200 },
    { id: 5, tipo: 'Alquiler', propiedad: 'Local Recoleta', cliente: 'Comercio ABC', monto: 2500, estado: 'En Curso', fecha: '2025-10-08', agente: 'Marcos Silva', comision: 2500 },
  ];

  // KPIs de Ventas
  const kpisVentas = [
    { title: 'Ventas del Mes', value: `$${(operaciones.filter(o => o.tipo === 'Venta' && o.estado === 'Cerrada').reduce((sum, o) => sum + o.monto, 0) / 1000).toFixed(0)}K`, desc: '+15% vs anterior', icon: <FaDollarSign />, color: 'from-green-500 to-green-600' },
    { title: 'Operaciones Activas', value: operaciones.filter(o => o.estado !== 'Cerrada').length, desc: `${operaciones.filter(o => o.estado === 'Reservada').length} en cierre`, icon: <FaFileContract />, color: 'from-blue-500 to-blue-600' },
    { title: 'Comisiones', value: `$${(operaciones.reduce((sum, o) => sum + o.comision, 0) / 1000).toFixed(0)}K`, desc: 'Este mes', icon: <FaChartLine />, color: 'from-purple-500 to-purple-600' },
    { title: 'Tasa de Cierre', value: `${Math.round((operaciones.filter(o => o.estado === 'Cerrada').length / operaciones.length) * 100)}%`, desc: 'Últimos 30 días', icon: <FaPercentage />, color: 'from-orange-500 to-orange-600' },
  ];

  // Datos para gráficos
  const ventasPorMes = [
    { mes: 'May', ventas: 6, alquileres: 12 },
    { mes: 'Jun', ventas: 8, alquileres: 15 },
    { mes: 'Jul', ventas: 5, alquileres: 10 },
    { mes: 'Ago', ventas: 12, alquileres: 18 },
    { mes: 'Sep', ventas: 9, alquileres: 14 },
    { mes: 'Oct', ventas: 11, alquileres: 16 },
  ];

  const estadosData = [
    { estado: 'Cerrada', cantidad: operaciones.filter(o => o.estado === 'Cerrada').length, fill: '#10B981' },
    { estado: 'En Curso', cantidad: operaciones.filter(o => o.estado === 'En Curso').length, fill: '#3B82F6' },
    { estado: 'Reservada', cantidad: operaciones.filter(o => o.estado === 'Reservada').length, fill: '#F59E0B' },
  ];

  const tiposData = [
    { tipo: 'Venta', cantidad: operaciones.filter(o => o.tipo === 'Venta').length },
    { tipo: 'Alquiler', cantidad: operaciones.filter(o => o.tipo === 'Alquiler').length },
  ];

  const cardBase = 'rounded-xl shadow-md p-6 bg-white dark:bg-secondary-dark-bg transition transform hover:scale-105';

  // Funciones de manejo para Venta
  const handleVentaChange = (e) => {
    const { name, value } = e.target;
    setNuevaVenta(prev => ({ ...prev, [name]: value }));
  };

  const handleVentaSubmit = (e) => {
    e.preventDefault();
    console.log('Nueva venta:', nuevaVenta);
    alert('¡Venta registrada exitosamente!');
    setShowModalVenta(false);
    setNuevaVenta({
      propiedad: '',
      cliente: '',
      monto: '',
      moneda: 'USD',
      agente: '',
      fechaCierre: '',
      comision: '3.5',
      formaPago: 'Contado',
      observaciones: '',
    });
  };

  // Funciones de manejo para Alquiler
  const handleAlquilerChange = (e) => {
    const { name, value } = e.target;
    setNuevoAlquiler(prev => ({ ...prev, [name]: value }));
  };

  const handleAlquilerSubmit = (e) => {
    e.preventDefault();
    console.log('Nuevo alquiler:', nuevoAlquiler);
    alert('¡Alquiler registrado exitosamente!');
    setShowModalAlquiler(false);
    setNuevoAlquiler({
      propiedad: '',
      cliente: '',
      montoMensual: '',
      moneda: 'USD',
      agente: '',
      fechaInicio: '',
      duracion: '12',
      deposito: '',
      comision: '1',
      observaciones: '',
    });
  };

  // Funciones de manejo para Seguimiento
  const handleSeguimientoChange = (e) => {
    const { name, value } = e.target;
    setNuevoSeguimiento(prev => ({ ...prev, [name]: value }));
  };

  const handleSeguimientoSubmit = (e) => {
    e.preventDefault();
    console.log('Nuevo seguimiento:', nuevoSeguimiento);
    alert('¡Seguimiento programado exitosamente!');
    setShowModalSeguimiento(false);
    setNuevoSeguimiento({
      operacion: '',
      tipo: 'Llamada',
      fecha: '',
      hora: '',
      descripcion: '',
      prioridad: 'Media',
    });
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-main-bg dark:bg-main-dark-bg rounded-3xl">
      <Header category="Operaciones" title="💼 Gestión de Operaciones" />
      
      {/* Botones de Acción */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button 
          onClick={() => setShowModalVenta(true)}
          className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md"
        >
          <FaPlus /> Nueva Venta
        </button>
        <button 
          onClick={() => setShowModalAlquiler(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
        >
          <FaHandshake /> Nuevo Alquiler
        </button>
        <button 
          onClick={() => setShowModalSeguimiento(true)}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors"
        >
          <FaCalendarAlt /> Programar Seguimiento
        </button>
      </div>

      {/* KPIs de Operaciones - Clickeables */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {kpisVentas.map((kpi, i) => (
          <div 
            key={i} 
            onClick={() => {
              if (i === 0) setShowModalVentasMes(true);
              else if (i === 1) setShowModalOperacionesActivas(true);
              else if (i === 2) setShowModalComisiones(true);
              else if (i === 3) setShowModalTasaCierre(true);
            }}
            className={`${cardBase} overflow-hidden cursor-pointer hover:shadow-xl`}
          >
            <div className={`h-2 w-full bg-gradient-to-r ${kpi.color}`} />
            <div className="flex items-center gap-4 mt-3">
              <div className={`text-3xl text-white p-3 rounded-lg bg-gradient-to-br ${kpi.color}`}>{kpi.icon}</div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">{kpi.title}</p>
                <p className="text-2xl font-semibold dark:text-gray-100 truncate">{kpi.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{kpi.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos de Tendencias y Estados */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de Tendencias */}
        <div className={cardBase}>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">📈 Tendencias de Ventas vs Alquileres</h3>
          <ChartComponent
            id="tendencias-chart"
            primaryXAxis={{ valueType: 'Category', title: 'Meses' }}
            primaryYAxis={{ title: 'Cantidad' }}
            tooltip={{ enable: true }}
            legendSettings={{ visible: true }}
            height="300px"
          >
            <Inject services={[LineSeries, Category, Tooltip, Legend]} />
            <SeriesCollectionDirective>
              <SeriesDirective
                type="Line"
                dataSource={ventasPorMes}
                xName="mes"
                yName="ventas"
                name="Ventas"
                marker={{ visible: true }}
                fill="#10B981"
              />
              <SeriesDirective
                type="Line"
                dataSource={ventasPorMes}
                xName="mes"
                yName="alquileres"
                name="Alquileres"
                marker={{ visible: true }}
                fill="#3B82F6"
              />
            </SeriesCollectionDirective>
          </ChartComponent>
        </div>

        {/* Gráfico de Estados */}
        <div className={cardBase}>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">📊 Estados de Operaciones</h3>
          <AccumulationChartComponent
            id="estados-chart"
            tooltip={{ enable: true }}
            legendSettings={{ visible: true }}
            height="300px"
          >
            <Inject services={[PieSeries, AccumulationLegend, AccumulationDataLabel, AccumulationTooltip]} />
            <AccumulationSeriesCollectionDirective>
              <AccumulationSeriesDirective
                type="Pie"
                dataSource={estadosData}
                xName="estado"
                yName="cantidad"
                name="Operaciones"
                innerRadius="40%"
                dataLabel={{ visible: true, name: 'estado', position: 'Outside' }}
              />
            </AccumulationSeriesCollectionDirective>
          </AccumulationChartComponent>
        </div>
      </div>

      {/* Grid de Operaciones y Panel de Comisiones */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className={`xl:col-span-2 ${cardBase}`}>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">💼 Operaciones Activas</h3>
          <GridComponent
            dataSource={operaciones}
            allowPaging
            pageSettings={{ pageSize: 10 }}
            allowSorting
            allowFiltering
          >
            <GridInject services={[Page, Sort, Filter]} />
            <ColumnsDirective>
              <ColumnDirective field="tipo" headerText="Tipo" width="100" />
              <ColumnDirective field="propiedad" headerText="Propiedad" width="180" />
              <ColumnDirective field="cliente" headerText="Cliente" width="150" />
              <ColumnDirective field="monto" headerText="Monto" textAlign="Right" width="120" format="C0" />
              <ColumnDirective field="estado" headerText="Estado" width="120" />
              <ColumnDirective field="agente" headerText="Agente" width="130" />
              <ColumnDirective field="comision" headerText="Comisión" textAlign="Right" width="120" format="C0" />
            </ColumnsDirective>
          </GridComponent>
        </div>

        {/* Panel de Comisiones */}
        <div className={cardBase}>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">💰 Comisiones por Agente</h3>
          <div className="space-y-4">
            {['Ana López', 'Carlos Ruiz', 'Laura Fernández', 'Sofía Torres', 'Marcos Silva'].map((agente, i) => {
              const comisionAgente = operaciones.filter(o => o.agente === agente).reduce((sum, o) => sum + o.comision, 0);
              return (
                <div key={i} className="border dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold dark:text-gray-200 text-sm">{agente}</h4>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      ${comisionAgente.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-green-500" 
                      style={{ width: `${Math.min((comisionAgente / 15000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {operaciones.filter(o => o.agente === agente).length} operaciones
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panel de Seguimiento y Próximas Acciones */}
      <div className={cardBase}>
        <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">🎯 Seguimiento y Próximas Acciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-6 border-2 border-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <FaArrowUp className="text-4xl text-red-500 mx-auto mb-3" />
              <h4 className="font-bold dark:text-gray-200">Urgentes</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Requieren atención inmediata</p>
              <p className="text-2xl font-bold text-red-600 mt-2">3</p>
              <p className="text-xs text-gray-500">Operaciones</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="p-6 border-2 border-yellow-500 rounded-lg hover:bg-yellow-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <FaCalendarAlt className="text-4xl text-yellow-500 mx-auto mb-3" />
              <h4 className="font-bold dark:text-gray-200">Esta Semana</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Seguimientos programados</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">8</p>
              <p className="text-xs text-gray-500">Contactos</p>
            </div>
          </div>

          <div className="text-center">
            <div className="p-6 border-2 border-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <FaHandshake className="text-4xl text-green-500 mx-auto mb-3" />
              <h4 className="font-bold dark:text-gray-200">Por Cerrar</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Próximas a finalizar</p>
              <p className="text-2xl font-bold text-green-600 mt-2">5</p>
              <p className="text-xs text-gray-500">Operaciones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Nueva Venta */}
      {showModalVenta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentMode === 'Dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaPlus /> Nueva Venta
                </h2>
                <p className="text-green-100 text-sm mt-1">Registrar una nueva operación de venta</p>
              </div>
              <button onClick={() => setShowModalVenta(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleVentaSubmit} className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100 flex items-center gap-2">
                  <FaHome className="text-green-500" /> Información de la Operación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Propiedad *</label>
                    <input type="text" name="propiedad" value={nuevaVenta.propiedad} onChange={handleVentaChange} required placeholder="Depto 2amb Palermo" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Cliente *</label>
                    <input type="text" name="cliente" value={nuevaVenta.cliente} onChange={handleVentaChange} required placeholder="Juan Pérez" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Monto *</label>
                    <input type="number" name="monto" value={nuevaVenta.monto} onChange={handleVentaChange} required placeholder="150000" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Moneda *</label>
                    <select name="moneda" value={nuevaVenta.moneda} onChange={handleVentaChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-gray-100">
                      <option value="USD">USD - Dólares</option>
                      <option value="ARS">ARS - Pesos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Agente *</label>
                    <select name="agente" value={nuevaVenta.agente} onChange={handleVentaChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-gray-100">
                      <option value="">Seleccionar agente</option>
                      <option value="Ana López">Ana López</option>
                      <option value="Carlos Ruiz">Carlos Ruiz</option>
                      <option value="Laura Fernández">Laura Fernández</option>
                      <option value="Sofía Torres">Sofía Torres</option>
                      <option value="Marcos Silva">Marcos Silva</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Fecha de Cierre *</label>
                    <input type="date" name="fechaCierre" value={nuevaVenta.fechaCierre} onChange={handleVentaChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Comisión (%)</label>
                    <input type="number" name="comision" value={nuevaVenta.comision} onChange={handleVentaChange} step="0.1" placeholder="3.5" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Forma de Pago</label>
                    <select name="formaPago" value={nuevaVenta.formaPago} onChange={handleVentaChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-gray-100">
                      <option value="Contado">Contado</option>
                      <option value="Financiado">Financiado</option>
                      <option value="Hipoteca">Hipoteca</option>
                      <option value="Mixto">Mixto</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Observaciones</label>
                <textarea name="observaciones" value={nuevaVenta.observaciones} onChange={handleVentaChange} rows="3" placeholder="Detalles adicionales de la operación..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-gray-100" />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t dark:border-gray-700">
                <button type="button" onClick={() => setShowModalVenta(false)} className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors font-medium">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2">
                  <FaSave /> Registrar Venta
                </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Nuevo Alquiler */}
      {showModalAlquiler && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentMode === 'Dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaHandshake /> Nuevo Alquiler
                </h2>
                <p className="text-blue-100 text-sm mt-1">Registrar una nueva operación de alquiler</p>
              </div>
              <button onClick={() => setShowModalAlquiler(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleAlquilerSubmit} className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100 flex items-center gap-2">
                  <FaHome className="text-blue-500" /> Información del Alquiler
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Propiedad *</label>
                    <input type="text" name="propiedad" value={nuevoAlquiler.propiedad} onChange={handleAlquilerChange} required placeholder="Casa 3amb Belgrano" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Cliente *</label>
                    <input type="text" name="cliente" value={nuevoAlquiler.cliente} onChange={handleAlquilerChange} required placeholder="María González" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Monto Mensual *</label>
                    <input type="number" name="montoMensual" value={nuevoAlquiler.montoMensual} onChange={handleAlquilerChange} required placeholder="1200" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Moneda *</label>
                    <select name="moneda" value={nuevoAlquiler.moneda} onChange={handleAlquilerChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100">
                      <option value="USD">USD - Dólares</option>
                      <option value="ARS">ARS - Pesos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Agente *</label>
                    <select name="agente" value={nuevoAlquiler.agente} onChange={handleAlquilerChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100">
                      <option value="">Seleccionar agente</option>
                      <option value="Ana López">Ana López</option>
                      <option value="Carlos Ruiz">Carlos Ruiz</option>
                      <option value="Laura Fernández">Laura Fernández</option>
                      <option value="Sofía Torres">Sofía Torres</option>
                      <option value="Marcos Silva">Marcos Silva</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Fecha de Inicio *</label>
                    <input type="date" name="fechaInicio" value={nuevoAlquiler.fechaInicio} onChange={handleAlquilerChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Duración (meses)</label>
                    <input type="number" name="duracion" value={nuevoAlquiler.duracion} onChange={handleAlquilerChange} placeholder="12" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Depósito</label>
                    <input type="number" name="deposito" value={nuevoAlquiler.deposito} onChange={handleAlquilerChange} placeholder="2400" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Comisión (meses)</label>
                    <input type="number" name="comision" value={nuevoAlquiler.comision} onChange={handleAlquilerChange} step="0.5" placeholder="1" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Observaciones</label>
                <textarea name="observaciones" value={nuevoAlquiler.observaciones} onChange={handleAlquilerChange} rows="3" placeholder="Detalles adicionales del alquiler..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100" />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t dark:border-gray-700">
                <button type="button" onClick={() => setShowModalAlquiler(false)} className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors font-medium">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2">
                  <FaSave /> Registrar Alquiler
                </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Seguimiento */}
      {showModalSeguimiento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentMode === 'Dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaCalendarAlt /> Programar Seguimiento
                </h2>
                <p className="text-purple-100 text-sm mt-1">Agendar una acción de seguimiento</p>
              </div>
              <button onClick={() => setShowModalSeguimiento(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSeguimientoSubmit} className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100 flex items-center gap-2">
                  <FaClock className="text-purple-500" /> Detalles del Seguimiento
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Operación *</label>
                    <select name="operacion" value={nuevoSeguimiento.operacion} onChange={handleSeguimientoChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-gray-100">
                      <option value="">Seleccionar operación</option>
                      {operaciones.map(op => (
                        <option key={op.id} value={op.id}>{op.propiedad} - {op.cliente}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Tipo de Seguimiento *</label>
                    <select name="tipo" value={nuevoSeguimiento.tipo} onChange={handleSeguimientoChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-gray-100">
                      <option value="Llamada">Llamada</option>
                      <option value="Email">Email</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Reunión">Reunión</option>
                      <option value="Visita">Visita</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Prioridad *</label>
                    <select name="prioridad" value={nuevoSeguimiento.prioridad} onChange={handleSeguimientoChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-gray-100">
                      <option value="Baja">Baja</option>
                      <option value="Media">Media</option>
                      <option value="Alta">Alta</option>
                      <option value="Urgente">Urgente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Fecha *</label>
                    <input type="date" name="fecha" value={nuevoSeguimiento.fecha} onChange={handleSeguimientoChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Hora *</label>
                    <input type="time" name="hora" value={nuevoSeguimiento.hora} onChange={handleSeguimientoChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-gray-100" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Descripción *</label>
                <textarea name="descripcion" value={nuevoSeguimiento.descripcion} onChange={handleSeguimientoChange} required rows="4" placeholder="Detalles del seguimiento a realizar..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-gray-100" />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t dark:border-gray-700">
                <button type="button" onClick={() => setShowModalSeguimiento(false)} className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors font-medium">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium flex items-center gap-2">
                  <FaCheckCircle /> Programar Seguimiento
                </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ventas del Mes */}
      {showModalVentasMes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentMode === 'Dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaDollarSign /> Ventas del Mes
                </h2>
                <p className="text-green-100 text-sm mt-1">
                  ${operaciones.filter(o => o.tipo === 'Venta' && o.estado === 'Cerrada').reduce((sum, o) => sum + o.monto, 0).toLocaleString()} en ventas cerradas
                </p>
              </div>
              <button onClick={() => setShowModalVentasMes(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {operaciones
                  .filter(o => o.tipo === 'Venta' && o.estado === 'Cerrada')
                  .sort((a, b) => b.monto - a.monto)
                  .map((operacion, index) => (
                    <div key={operacion.id} className={`${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4 border ${currentMode === 'Dark' ? 'border-gray-700' : 'border-gray-200'} hover:shadow-md transition-shadow`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            index === 0 ? 'bg-yellow-400 text-yellow-900' :
                            index === 1 ? 'bg-gray-300 text-gray-700' :
                            index === 2 ? 'bg-orange-400 text-orange-900' :
                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg dark:text-gray-100">{operacion.propiedad}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Cliente: {operacion.cliente}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                              <span>Agente: {operacion.agente}</span>
                              <span>•</span>
                              <span>Fecha: {operacion.fecha}</span>
                              <span>•</span>
                              <span className="px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                {operacion.estado}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-3xl font-bold text-green-600 dark:text-green-400">${operacion.monto.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Comisión: {operacion.comisionPorcentaje}%</p>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">
                            ${operacion.comision.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              <div className={`mt-6 p-4 ${currentMode === 'Dark' ? 'bg-green-900/20' : 'bg-green-50'} rounded-lg border-2 border-green-500`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Ventas</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${operaciones.filter(o => o.tipo === 'Venta' && o.estado === 'Cerrada').reduce((sum, o) => sum + o.monto, 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Cantidad</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {operaciones.filter(o => o.tipo === 'Venta' && o.estado === 'Cerrada').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Promedio</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${Math.round(operaciones.filter(o => o.tipo === 'Venta' && o.estado === 'Cerrada').reduce((sum, o) => sum + o.monto, 0) / operaciones.filter(o => o.tipo === 'Venta' && o.estado === 'Cerrada').length).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Comisiones</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${operaciones.filter(o => o.tipo === 'Venta' && o.estado === 'Cerrada').reduce((sum, o) => sum + o.comision, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Operaciones Activas */}
      {showModalOperacionesActivas && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentMode === 'Dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaFileContract /> Operaciones Activas
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {operaciones.filter(o => o.estado !== 'Cerrada').length} operaciones en proceso
                </p>
              </div>
              <button onClick={() => setShowModalOperacionesActivas(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {operaciones
                  .filter(o => o.estado !== 'Cerrada')
                  .sort((a, b) => {
                    const estadoOrder = { 'Reservada': 1, 'En Proceso': 2, 'Pendiente': 3 };
                    return (estadoOrder[a.estado] || 4) - (estadoOrder[b.estado] || 4);
                  })
                  .map((operacion) => (
                    <div key={operacion.id} className={`${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4 border-2 ${currentMode === 'Dark' ? 'border-blue-700' : 'border-blue-200'} hover:shadow-md transition-shadow`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg dark:text-gray-100">{operacion.propiedad}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              operacion.estado === 'Reservada' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                              operacion.estado === 'En Proceso' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                              'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                            }`}>
                              {operacion.estado}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Cliente:</p>
                              <p className="font-medium dark:text-gray-200">{operacion.cliente}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Tipo:</p>
                              <p className="font-medium dark:text-gray-200">{operacion.tipo}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Agente:</p>
                              <p className="font-medium dark:text-gray-200">{operacion.agente}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Fecha:</p>
                              <p className="font-medium dark:text-gray-200">{operacion.fecha}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${operacion.monto.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Comisión potencial</p>
                          <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                            ${operacion.comision.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              {operaciones.filter(o => o.estado !== 'Cerrada').length === 0 && (
                <div className="text-center py-12">
                  <FaFileContract className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No hay operaciones activas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Comisiones */}
      {showModalComisiones && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentMode === 'Dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaChartLine /> Comisiones Totales
                </h2>
                <p className="text-purple-100 text-sm mt-1">
                  ${operaciones.reduce((sum, o) => sum + o.comision, 0).toLocaleString()} en comisiones
                </p>
              </div>
              <button onClick={() => setShowModalComisiones(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {operaciones
                  .sort((a, b) => b.comision - a.comision)
                  .map((operacion, index) => (
                    <div key={operacion.id} className={`${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4 border ${currentMode === 'Dark' ? 'border-gray-700' : 'border-gray-200'} hover:shadow-md transition-shadow`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700' :
                            index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                          }`}>
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg dark:text-gray-100">{operacion.propiedad}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{operacion.tipo} • {operacion.cliente}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                              <span>Agente: {operacion.agente}</span>
                              <span>•</span>
                              <span>{operacion.comisionPorcentaje}% comisión</span>
                              <span>•</span>
                              <span className={`px-2 py-1 rounded ${
                                operacion.estado === 'Cerrada' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                              }`}>
                                {operacion.estado}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Monto operación</p>
                          <p className="text-lg font-semibold dark:text-gray-200">${operacion.monto.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Comisión</p>
                          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">${operacion.comision.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              <div className={`mt-6 p-4 ${currentMode === 'Dark' ? 'bg-purple-900/20' : 'bg-purple-50'} rounded-lg border-2 border-purple-500`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Comisiones</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      ${operaciones.reduce((sum, o) => sum + o.comision, 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Comisiones Cerradas</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      ${operaciones.filter(o => o.estado === 'Cerrada').reduce((sum, o) => sum + o.comision, 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Promedio</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      ${Math.round(operaciones.reduce((sum, o) => sum + o.comision, 0) / operaciones.length).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Mayor Comisión</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      ${Math.max(...operaciones.map(o => o.comision)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tasa de Cierre */}
      {showModalTasaCierre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentMode === 'Dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaPercentage /> Tasa de Cierre
                </h2>
                <p className="text-orange-100 text-sm mt-1">Análisis de efectividad de ventas</p>
              </div>
              <button onClick={() => setShowModalTasaCierre(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Embudo de Ventas */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Embudo de Operaciones</h3>
                <div className="space-y-4">
                  {[
                    { estado: 'Total Operaciones', count: operaciones.length, color: 'blue', width: '100%' },
                    { estado: 'En Proceso', count: operaciones.filter(o => o.estado === 'En Proceso').length, color: 'yellow', width: '75%' },
                    { estado: 'Reservadas', count: operaciones.filter(o => o.estado === 'Reservada').length, color: 'orange', width: '50%' },
                    { estado: 'Cerradas', count: operaciones.filter(o => o.estado === 'Cerrada').length, color: 'green', width: `${(operaciones.filter(o => o.estado === 'Cerrada').length / operaciones.length * 100).toFixed(0)}%` },
                  ].map((etapa) => (
                    <div key={etapa.estado} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium dark:text-gray-200">{etapa.estado}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{etapa.count} operaciones</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 relative overflow-hidden">
                        <div 
                          className={`h-8 rounded-full bg-${etapa.color}-500 flex items-center justify-center text-white font-bold transition-all duration-500`}
                          style={{ width: etapa.width }}
                        >
                          {etapa.width}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estadísticas de Cierre */}
              <div className={`p-6 ${currentMode === 'Dark' ? 'bg-orange-900/20' : 'bg-orange-50'} rounded-lg border-2 border-orange-500`}>
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Métricas de Cierre</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tasa de Cierre</p>
                    <p className="text-4xl font-bold text-orange-600 dark:text-orange-400 my-2">
                      {Math.round((operaciones.filter(o => o.estado === 'Cerrada').length / operaciones.length) * 100)}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {operaciones.filter(o => o.estado === 'Cerrada').length} de {operaciones.length} operaciones
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">En Proceso → Cerrada</p>
                    <p className="text-4xl font-bold text-orange-600 dark:text-orange-400 my-2">
                      {operaciones.filter(o => o.estado === 'En Proceso').length > 0 
                        ? Math.round((operaciones.filter(o => o.estado === 'Cerrada').length / (operaciones.filter(o => o.estado === 'En Proceso').length + operaciones.filter(o => o.estado === 'Cerrada').length)) * 100)
                        : 0}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Conversión efectiva</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Operaciones Activas</p>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 my-2">
                      {operaciones.filter(o => o.estado !== 'Cerrada').length}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Potencial de cierre</p>
                  </div>
                </div>
              </div>

              {/* Operaciones por Estado */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { estado: 'Pendiente', color: 'yellow', icon: '📋', count: operaciones.filter(o => o.estado === 'Pendiente').length },
                  { estado: 'En Proceso', color: 'blue', icon: '⚙️', count: operaciones.filter(o => o.estado === 'En Proceso').length },
                  { estado: 'Reservada', color: 'orange', icon: '🔒', count: operaciones.filter(o => o.estado === 'Reservada').length },
                  { estado: 'Cerrada', color: 'green', icon: '✅', count: operaciones.filter(o => o.estado === 'Cerrada').length },
                ].map((item) => (
                  <div key={item.estado} className={`${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 border ${currentMode === 'Dark' ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.estado}</p>
                    <p className="text-2xl font-bold dark:text-gray-100">{item.count}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {Math.round((item.count / operaciones.length) * 100)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ventas;
