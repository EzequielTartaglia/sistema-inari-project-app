"use client";

import { getProducts } from "@/src/models/platform/product/product";
import { getProductCategories } from "@/src/models/platform/product_category/product_category";
import { getProductMeasureUnits } from "@/src/models/platform/product_measure_unit/product_measure_unit";
import {
  changeSaleTotal,
  closeSale,
  getSale,
} from "@/src/models/platform/sale/sale";
import {
  getSaleItemsFromSale,
  addSaleItem,
  deleteSaleItem,
  increaseSaleItemQuantity,
  decreaseSaleItemQuantity,
  changeSaleItemQuantity,
  emptyCart,
} from "@/src/models/platform/sale_item/sale_item";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUserInfoContext } from "@/contexts/UserInfoContext";

import SearchInput from "@/components/SearchInput";
import { FiCheckCircle, FiTrash2 } from "react-icons/fi";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageHeader from "@/components/page_formats/PageHeader";
import TableOfProductsInSale from "@/components/tables/TableOfProductsInSale";
import Button from "@/components/Button";
import { FaCartArrowDown, FaCartPlus, FaShoppingBag } from "react-icons/fa";
import ClosePreviusSaleAndCreateNewOneButton from "../ClosePreviusSaleAndCreateNewOneButton";

export default function SaleOpenDetails({ saleId }) {
  const [categories, setCategories] = useState([]);
  const [measureUnits, setMeasureUnits] = useState([]);
  const [isClosed, setIsClosed] = useState(false);
  const [saleItems, setSaleItems] = useState([]);
  const [products, setProducts] = useState([]);

  const { user } = useUserInfoContext();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);
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
        const [saleItemsData, productsData, saleData] = await Promise.all([
          getSaleItemsFromSale(saleId),
          getProducts(),
          getSale(saleId),
        ]);
        setSaleItems(saleItemsData);
        setProducts(productsData);
        setIsClosed(saleData.is_closed);
      } catch (err) {
        setError("Error al cargar los items o productos.");
      } finally {
        setLoading(false);
      }
    };
    loadSaleData();
  }, [saleId]);

  const filteredData = useMemo(() => {
    return products
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((product) => {
        const productCategory = categories.find(
          (category) => category.id === product.product_category_id
        );
        const productMeasureUnit = measureUnits.find(
          (measure_unit) => measure_unit.id === product.product_measure_unit_id
        );
        return {
          id: product.id,
          name: product.name,
          product_category_id: productCategory ? productCategory.name : "N/A",
          price: `$ ${parseFloat(product.price).toFixed(2)}`,
          product_measure_unit_id: productMeasureUnit
            ? productMeasureUnit.name
            : "N/A",
          quantity: product.quantity,
        };
      })
      .sort((a, b) => a.id - b.id);
  }, [searchTerm, products, categories, measureUnits]);

  const handleAddProductToSale = async (productId) => {
    const product = products.find((product) => product.id === productId);
    const existingItem = saleItems.find(
      (item) => item.product_id === product.id
    );

    const saleItemTotal = product.price * quantityToAdd;

    try {
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantityToAdd;
        const newSaleItemTotal = product.price * newQuantity;

        await changeSaleItemQuantity(
          existingItem.id,
          newQuantity,
          newSaleItemTotal
        );
      } else {
        await addSaleItem(saleId, product.id, quantityToAdd, saleItemTotal);
      }

      const updatedSaleItems = await getSaleItemsFromSale(saleId);
      const sortedSaleItems = updatedSaleItems.sort((a, b) => a.id - b.id);

      setSaleItems(sortedSaleItems);
      setQuantityToAdd(1);
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
    const updateTotalSaleAndProducts = async () => {
      try {
        const fetchedCategories = await getProductCategories();
        const fetchedMeasureUnits = await getProductMeasureUnits();
        const fetchedProducts = await getProducts();

        setCategories(fetchedCategories);
        setMeasureUnits(fetchedMeasureUnits);
        setProducts(fetchedProducts);

        await changeSaleTotal(saleId, totalSale);
      } catch (error) {
        console.error("Error updating sale total:", error);
      }
    };

    updateTotalSaleAndProducts();
  }, [totalSale, saleId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const columns = [
    "name",
    "product_category_id",
    "price",
    "product_measure_unit_id",
    "quantity",
  ];
  const columnAliases = {
    name: "Nombre",
    product_category_id: "Categoria",
    price: "Precio",
    product_measure_unit_id: "Unidad de medida",
    quantity: "Cantidad",
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEmptyCart = async () => {
    try {
      await emptyCart(saleId);
      setSaleItems([]);
    } catch (error) {
      setError("Error trying to empty cart.");
    }
  };

  const handleClosesale = async () => {
    try {
      await closeSale(saleId);

      setTimeout(() => {
        router.push(`/platform/sales/`);
      }, 2000);
    } catch (error) {
      setError("Error trying to close sale.");
    }
  };

  const userHasAccess =
    user.user_role_id === 1 ||
    user.user_role_id === 2 ||
    user.user_role_id === 3 ||
    user.user_role_id === 4 ||
    user.user_role_id === 6;

  return (
    <>
      {isClosed ? (
        <PageHeader
          title={`Detalles de venta`}
          goBackRoute={"/platform/sales"}
          goBackText={"Volver al listado de ventas"}
        />
      ) : (
        <PageHeader title={`Detalles de venta`} />
      )}

      <div className="box-theme text-title-active-static">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-title-active-static">
            Productos seleccionados
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
                        {item.quantity > 1 && !isClosed ? (
                          <button
                            onClick={async () => {
                              try {
                                await decreaseSaleItemQuantity(
                                  item.id,
                                  product.price,
                                  item.quantity,
                                  product.id,
                                  product.quantity
                                );
                                const updatedSaleItems =
                                  await getSaleItemsFromSale(saleId);
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
                        ) : (
                          <button className="mr-4 text-primary hover:text-red-500 px-3 py-1 rounded"></button>
                        )}
                        {item.quantity}
                        {product.quantity > 0 && !isClosed ? (
                          <button
                            onClick={async () => {
                              try {
                                await increaseSaleItemQuantity(
                                  item.id,
                                  product.price,
                                  item.quantity,
                                  product.id,
                                  product.quantity
                                );
                                const updatedSaleItems =
                                  await getSaleItemsFromSale(saleId);
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
                            className="ml-2 text-primary hover:text-red-500 px-3 py-1 rounded"
                            title="Aumentar Cantidad"
                          >
                            +
                          </button>
                        ) : (
                          <button className="ml-2 text-primary hover:text-red-500 px-3 py-1 rounded"></button>
                        )}
                      </td>
                      <td className="border border-white border-opacity-25 px-6 py-2">
                        $ {item.sale_item_total.toFixed(2)}
                      </td>
                      {!isClosed ? (
                        <td className="border border-white border-opacity-25 px-6 py-2">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Eliminar Producto"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </td>
                      ) : (
                        <td className="border border-white border-opacity-25 px-6 py-2">
                          <button>No aplica</button>
                        </td>
                      )}
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
        </div>

        {totalSale.toFixed(2) > 0 && !isClosed && (
          <>
            <div className="flex my-4">
              <Button
                isAnimated={false}
                customFunction={handleEmptyCart}
                icon={<FaCartArrowDown size={20} />}
                customClasses="px-4 py-2 bg-red-300 rounded-md shadow-md hover:bg-secondary transition duration-300 border-secondary-light text-title-active-static font-semibold gradient-button"
                title={"Vaciar carrito"}
              />

              <div className="flex ml-auto">
                <Button
                  isAnimated={false}
                  customFunction={handleClosesale}
                  customClasses="px-4 py-2 rounded-md shadow-md transition duration-300 bg-primary border-primary-light font-semibold mr-2 gradient-button"
                  icon={<FiCheckCircle size={20} />}
                  title={"Finalizar y volver al listado de ventas"}
                />

                <ClosePreviusSaleAndCreateNewOneButton
                  saleId={saleId}
                  customClasses="px-4 py-2 rounded-md shadow-md transition duration-300 bg-primary border-primary-light font-semibold  gradient-button"
                  Icon={FaShoppingBag}
                  title="Finalizar y crear nueva venta"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {!isClosed && (
        <div className="box-theme text-title-active-static">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-title-active-static">
              Productos disponibles
            </h3>
            <SearchInput
              placeholder="Buscar producto..."
              searchTerm={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <TableOfProductsInSale
            columns={columns}
            data={filteredData}
            columnAliases={columnAliases}
            hasDelete={false}
            hasCustomButton={() => userHasAccess}
            quantityToAdd={quantityToAdd}
            setQuantityToAdd={setQuantityToAdd}
            buttonCustomRoute={handleAddProductToSale}
            buttonCustomIcon={<FaCartPlus className="text-lg mr-1" size={20} />}
          />
        </div>
      )}
    </>
  );
}
