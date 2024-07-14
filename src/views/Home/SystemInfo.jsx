import React from "react";
import { FaShoppingCart, FaBoxes, FaMoneyBillAlt } from "react-icons/fa";

export default function SystemInfo() {
  const systemName = process.env.NEXT_PUBLIC_SYSTEM_NAME;

  return (
    <div className="box-theme p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center text-primary mb-6">
        Acerca del Sistema {systemName}
      </h1>
      <p className="text-lg text-center text-primary mb-8">
        {systemName} es un sistema de gestión comercial diseñado para optimizar
        la administración de tiendas y comercios electrónicos. Nuestra plataforma
        ofrece herramientas avanzadas para control de inventario, gestión de
        pedidos y manejo de transacciones financieras.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg shadow-md text-center border-card-detail">
          <FaShoppingCart className="text-primary text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">
            Gestión de Ventas
          </h2>
          <p className="text-primary">
            Optimiza tu proceso de ventas con herramientas avanzadas para gestionar
            pedidos y transacciones.
          </p>
        </div>
        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg shadow-md text-center border-card-detail">
          <FaBoxes className="text-primary text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">
            Control de Stock
          </h2>
          <p className="text-primary">
            Administra y supervisa tu inventario en tiempo real para mantener el
            control total sobre tus productos.
          </p>
        </div>
        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg shadow-md text-center border-card-detail">
          <FaMoneyBillAlt className="text-primary text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">
            Gestión Financiera
          </h2>
          <p className="text-primary">
            Maneja eficazmente las transacciones financieras y asegura una gestión
            contable precisa.
          </p>
        </div>
      </div>
    </div>
  );
}
