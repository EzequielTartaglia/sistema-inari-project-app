"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getProducts } from "@/src/models/platform/product/product";
import { changeSaleTotal } from "@/src/models/platform/sale/sale";
import {
  getSaleItemsFromSale,
  addSaleItem,
  deleteSaleItem,
  increaseSaleItemQuantity,
  decreaseSaleItemQuantity,
  changeSaleItemQuantity,
} from "@/src/models/platform/sale_item/sale_item";
import { FaSearch, FaTimes } from "react-icons/fa";
import SearchInput from "@/components/SearchInput";
import { FiTrash2 } from "react-icons/fi";
import LoadingSpinner from "@/components/LoadingSpinner";

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

  const totalSale = saleItems.reduce(
    (total, item) => total + item.sale_item_total,
    0
  );

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
      const sortedSaleItems = updatedSaleItems.sort((a, b) => a.id - b.id);
      setSaleItems(sortedSaleItems);
      setSelectedProduct(null);
      setQuantity(1);
    } catch (error) {
      setError("Error trying to add product to the sale.");
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteSaleItem(itemId);
      const updatedSaleItems = await getSaleItemsFromSale(saleId);
      const sortedSaleItems = updatedSaleItems.sort((a, b) => a.id - b.id);
      setSaleItems(sortedSaleItems);
    } catch (error) {
      setError("Error trying to delete product to the sale.");
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleSaleItems = saleItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(saleItems.length / itemsPerPage);

  useEffect(() => {
    const updateTotalSale = async () => {
      try {
        await changeSaleTotal(saleId, totalSale);
      } catch (error) {
        console.error("Error updating sale total:", error);
      }
    };

    updateTotalSale();
  }, [totalSale, saleId]);

  if (loading) {
    return LoadingSpinner;
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
                  <tr key={item.id}>
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
                            const sortedSaleItems = updatedSaleItems.sort(
                              (a, b) => a.id - b.id
                            );
                            setSaleItems(sortedSaleItems);
                          } catch (error) {
                            setError(
                              "Error al reducir la cantidad del producto."
                            );
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
                            const sortedSaleItems = updatedSaleItems.sort(
                              (a, b) => a.id - b.id
                            );
                            setSaleItems(sortedSaleItems);
                          } catch (error) {
                            setError(
                              "Error al aumentar la cantidad del producto."
                            );
                          }
                        }}
                        className="ml-2 text-primary hover:text-green-500 px-3 py-1 rounded"
                        title="Aumentar Cantidad"
                      >
                        +
                      </button>
                    </td>
                    <td className="border border-white border-opacity-25 px-6 py-2">
                      $ {item.sale_item_total.toFixed(2)}
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
          {/* Retrieve the sale's total */}
          <tfoot>
            <tr>
              <td
                colSpan="2"
                className="border border-white border-opacity-25 px-6 py-2 text-right font-bold"
              >
                Total
              </td>
              <td className="border border-white border-opacity-25 px-6 py-2">
                $ {totalSale.toFixed(2)}
              </td>
              <td className="border border-white border-opacity-25 px-6 py-2"></td>
            </tr>
          </tfoot>
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

      {/* Section to add products */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Agregar Producto</h3>
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm("")}
          clearIcon={<FaTimes />}
          searchIcon={<FaSearch />}
        />
        {selectedProduct && (
          <div className="mt-2">
            Producto seleccionado: {selectedProduct.name}
          </div>
        )}
        <div className="flex mt-4">
          <select
            value={selectedProduct ? selectedProduct.id : ""}
            onChange={(e) => {
              const product = products.find(
                (prod) => prod.id === parseInt(e.target.value)
              );
              setSelectedProduct(product);
            }}
            className="border rounded px-2 py-1"
          >
            <option value="">Seleccionar producto</option>
            {filteredProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - ${product.price}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, e.target.value))}
            className="border rounded px-2 py-1 ml-2 w-16"
          />
          <button
            onClick={handleAddProductToSale}
            className="bg-blue-500 text-white rounded px-4 py-1 ml-2"
          >
            Agregar
          </button>
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
}
