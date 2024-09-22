'use client';

import React, { useState, useEffect } from 'react';
import { getProducts } from '@/src/models/platform/product/product';
import { getSaleItemsFromSale, addSaleItem } from '@/src/models/platform/sale_item/sale_item';

export default function SaleOpenDetails({ saleId }) {
  const [saleItems, setSaleItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Cargar datos de la venta y productos
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

  // Agregar producto a la venta
  const handleAddProductToSale = async () => {
    if (!selectedProduct) {
      setError('Por favor selecciona un producto.');
      return;
    }

    const saleItemTotal = selectedProduct.price * quantity;

    try {
      await addSaleItem(saleId, selectedProduct.id, quantity, saleItemTotal);
      // Recargar los items de la venta
      const updatedSaleItems = await getSaleItemsFromSale(saleId);
      setSaleItems(updatedSaleItems);
      setSelectedProduct(null);
      setQuantity(1);
    } catch (error) {
      setError('Error al agregar el producto a la venta.');
    }
  };

  if (loading) {
    return <div>Cargando datos de la venta...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Detalles de la Venta #{saleId}</h2>

      {/* Mostrar los items de la venta */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Productos en la Venta</h3>
        {saleItems.length > 0 ? (
          <ul className="list-disc pl-6">
            {saleItems.map((item) => (
              <li key={item.id}>
                Producto: {item.product_name || item.product_id} - Cantidad: {item.quantity} - Total: ${item.sale_item_total.toFixed(2)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay productos en la venta actualmente.</p>
        )}
      </div>

      {/* Seleccionar producto para agregar a la venta */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Agregar Producto a la Venta</h3>
        <div className="flex items-center space-x-4 mb-2 text-primary">
          <select
            value={selectedProduct ? selectedProduct.id : ''}
            onChange={(e) =>
              setSelectedProduct(products.find((product) => product.id === Number(e.target.value)))
            }
            className="p-2 border rounded-md w-full"
          >
            <option value="" disabled>
              Selecciona un producto
            </option>
            {products.map((product) => (
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
            placeholder="Cantidad"
          />

          <button
            onClick={handleAddProductToSale}
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Agregar
          </button>
        </div>

        {selectedProduct && (
          <p className="text-sm">
            Producto seleccionado: <strong>{selectedProduct.name}</strong> - Precio unitario: <strong>${selectedProduct.price.toFixed(2)}</strong>
          </p>
        )}
      </div>
    </div>
  );
}
