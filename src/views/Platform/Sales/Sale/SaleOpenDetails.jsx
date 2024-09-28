"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getProducts } from "@/src/models/platform/product/product";
import {
  getSaleItemsFromSale,
  addSaleItem,
  deleteSaleItem,
  increaseSaleItemQuantity,
  decreaseSaleItemQuantity,
} from "@/src/models/platform/sale_item/sale_item";
import { changeSaleItemQuantity } from "@/src/models/platform/sale_item/sale_item";
import { FaSearch, FaTimes } from "react-icons/fa";
import SearchInput from "@/components/SearchInput";
import { FiTrash2 } from "react-icons/fi";

export default function SaleOpenDetails({ saleId }) {
  const [saleItems, setSaleItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
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
        setError("Error al cargar los items o productos.");
      } finally {
        setLoading(false);
      }
    };
    loadSaleData();
  }, [saleId]);

  const filteredProducts = useMemo(() => {
    return searchTerm === ""
      ? products
      : products.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
  }, [searchTerm, products]);

  const handleAddProductToSale = async () => {
    if (!selectedProduct) {
      setError("Por favor selecciona un producto.");
      return;
    }

    const existingItem = saleItems.find(
      (item) => item.product_id === selectedProduct.id
    );
    const saleItemTotal = selectedProduct.price * quantity;

    try {
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const newSaleItemTotal = selectedProduct.price * newQuantity;
        await changeSaleItemQuantity(
          existingItem.id,
          newQuantity,
          newSaleItemTotal
        );
      } else {
        await addSaleItem(saleId, selectedProduct.id, quantity, saleItemTotal);
      }

      const updatedSaleItems = await getSaleItemsFromSale(saleId);
      setSaleItems(updatedSaleItems);
      setSelectedProduct(null);
      setQuantity(1);
    } catch (error) {
      setError("Error al agregar el producto a la venta.");
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteSaleItem(itemId);
      const updatedSaleItems = await getSaleItemsFromSale(saleId);
      setSaleItems(updatedSaleItems);
    } catch (error) {
      setError("Error al eliminar el producto de la venta.");
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleSaleItems = saleItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(saleItems.length / itemsPerPage);

  if (loading) {
    return <div>Cargando datos de la venta...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="box-theme text-title-active-static">
      <h2 className="text-xl font-bold mb-4">Detalles de la Venta #{saleId}</h2>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-title-active-static">
          Productos en la Venta
        </h3>
      </div>
      <div className="border table-box font-semibold mt-4">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="box-theme">
              <th className="border border-white border-opacity-25 px-6 py-2">
                Nombre
              </th>
              <th className="border border-white border-opacity-25 px-6 py-2">
                Cantidad
              </th>
              <th className="border border-white border-opacity-25 px-6 py-2">
                Precio
              </th>
              <th className="border border-white border-opacity-25 px-6 py-2">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleSaleItems.length > 0 ? (
              visibleSaleItems.map((item) => {
                const product = products.find(
                  (prod) => prod.id === item.product_id
                );
                return (
                  <tr key={item.id} className="">
                    <td className="border border-white border-opacity-25 px-6 py-2">
                      {product ? product.name : "N/A"}
                    </td>
                    <td className="border border-white border-opacity-25 px-6 py-2">
                      <button
                        onClick={async () => {
                          try {
                            await decreaseSaleItemQuantity(
                              item.id,
                              product.price,
                              item.quantity
                            );
                            const updatedSaleItems = await getSaleItemsFromSale(
                              saleId
                            );
                            setSaleItems(updatedSaleItems);
                          } catch (error) {
                            setError("Error decreasing sale_item quantity.");
                          }
                        }}
                        className="mr-2 text-primary hover:text-red-500 px-3 py-1 rounded"
                        title="Reducir Cantidad"
                      >
                        -
                      </button>
                      {item.quantity}
                      <button
                        onClick={async () => {
                          try {
                            await increaseSaleItemQuantity(
                              item.id,
                              product.price,
                              item.quantity
                            );
                            const updatedSaleItems = await getSaleItemsFromSale(
                              saleId
                            );
                            setSaleItems(updatedSaleItems);
                          } catch (error) {
                            setError("Error increasing sale_item quantity.");
                          }
                        }}
                        className="ml-2 text-primary hover:text-green-500 px-3 py-1 rounded"
                        title="Aumentar Cantidad"
                      >
                        +
                      </button>
                    </td>
                    <td className="border border-white border-opacity-25 px-6 py-2">
                      ${item.sale_item_total.toFixed(2)}
                    </td>
                    <td className="border border-white border-opacity-25 px-6 py-2">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="ml-2 flex-shrink-0"
                        title="Eliminar"
                      >
                        <FiTrash2 className="text-delete-link" size={24} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No hay productos en la venta actualmente.
                </td>
              </tr>
            )}
          </tbody>
        </table>

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

      <div className="my-6">
        <h3 className="text-lg font-semibold mb-2">
          Agregar Producto a la Venta
        </h3>
        <SearchInput
          placeholder="Buscar producto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex items-center space-x-4 mt-2">
          <select
            value={selectedProduct ? selectedProduct.id : ""}
            onChange={(e) =>
              setSelectedProduct(
                filteredProducts.find(
                  (product) => product.id === Number(e.target.value)
                )
              )
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
            Producto seleccionado: <strong>{selectedProduct.name}</strong> -
            Precio unitario:{" "}
            <strong>${selectedProduct.price.toFixed(2)}</strong>
          </p>
        )}
      </div>
    </div>
  );
}
