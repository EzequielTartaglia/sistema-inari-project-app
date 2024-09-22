'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getProducts } from '@/src/models/platform/product/product';
import { getSaleItemsFromSale, addSaleItem } from '@/src/models/platform/sale_item/sale_item';
import { FaSearch, FaTimes } from 'react-icons/fa';

export default function SaleOpenDetails({ saleId }) {
  const [saleItems, setSaleItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadSaleData = async () => {
      try {
        const [saleItemsData, productsData] = await Promise.all([
          getSaleItemsFromSale(saleId),
          getProducts(),
        ]);
        setSaleItems(saleItemsData);
        setProducts(productsData);
      } catch (err) {
        setError('Error al cargar los items o productos.');
      } finally {
        setLoading(false);
      }
    };
    loadSaleData();
  }, [saleId]);

  const filteredProducts = useMemo(() => {
    return searchTerm === ''
      ? products
      : products.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
  }, [searchTerm, products]);

  const handleAddProductToSale = async () => {
    if (!selectedProduct) {
      setError('Por favor selecciona un producto.');
      return;
    }
    const saleItemTotal = selectedProduct.price * quantity;

    try {
      await addSaleItem(saleId, selectedProduct.id, quantity, saleItemTotal);
      const updatedSaleItems = await getSaleItemsFromSale(saleId);
      setSaleItems(updatedSaleItems);
      setSelectedProduct(null);
      setQuantity(1);
    } catch (error) {
      setError('Error al agregar el producto a la venta.');
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleSaleItems = saleItems.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(saleItems.length / itemsPerPage);

  if (loading) {
    return <div>Cargando datos de la venta...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Detalles de la Venta #{saleId}</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Productos en la Venta</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 mt-4">
            <thead className="bg-blue-500 text-white font-bold">
              <tr>
                <th className="py-2 px-4 border-b">Nombre</th>
                <th className="py-2 px-4 border-b">Cantidad</th>
                <th className="py-2 px-4 border-b">Precio</th>
              </tr>
            </thead>
            <tbody>
              {visibleSaleItems.length > 0 ? (
                visibleSaleItems.map((item) => {
                  const product = products.find((prod) => prod.id === item.product_id); 
                  return (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b text-center">{product ? product.name : 'N/A'}</td>
                      <td className="py-2 px-4 border-b text-center">{item.quantity}</td>
                      <td className="py-2 px-4 border-b text-center">${item.sale_item_total.toFixed(2)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">No hay productos en la venta actualmente.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {saleItems.length > itemsPerPage && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="py-1 px-2 bg-blue-500 text-white rounded"
            >
              Primera
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="py-1 px-2 bg-blue-500 text-white rounded"
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="py-1 px-2 bg-blue-500 text-white rounded"
            >
              Siguiente
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="py-1 px-2 bg-blue-500 text-white rounded"
            >
              Última
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Agregar Producto a la Venta</h3>
        <SearchInput
          placeholder="Buscar producto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex items-center space-x-4 mt-2">
          <select
            value={selectedProduct ? selectedProduct.id : ''}
            onChange={(e) =>
              setSelectedProduct(filteredProducts.find((product) => product.id === Number(e.target.value)))
            }
            className="p-2 border rounded-md w-full text-primary"
          >
            <option value="" disabled>
              Selecciona un producto
            </option>
            {filteredProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - ${product.price.toFixed(2)}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="p-2 border rounded-md w-20 text-primary"
          />

          <button
            onClick={handleAddProductToSale}
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Agregar
          </button>
        </div>

        {selectedProduct && (
          <p className="mt-2 text-sm">
            Producto seleccionado: <strong>{selectedProduct.name}</strong> - Precio unitario: <strong>${selectedProduct.price.toFixed(2)}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

function SearchInput({ placeholder, value, onChange }) {
  return (
    <div className="relative w-full lg:w-1/2">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-3 pl-10 pr-10 border rounded text-primary"
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      {value && (
        <FaTimes
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer"
          onClick={() => onChange({ target: { value: '' } })}
        />
      )}
    </div>
  );
}
