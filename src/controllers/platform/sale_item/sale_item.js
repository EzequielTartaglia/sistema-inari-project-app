import supabase from "@/utils/supabase/supabaseClient";

export async function getSaleItems() {
  try {
    const { data, error } = await supabase.from("sale_items").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addSaleItem(
  sale_id,
  stock_product_id,
  quantity = 1,
  sale_item_total
) {
  try {
    const { data: productData, error: productError } = await supabase
      .from("stock_products")
      .select("quantity")
      .eq("id", stock_product_id)
      .single();

    if (productError) {
      throw productError;
    }

    if (productData.quantity < quantity) {
      throw new Error("No hay suficiente cantidad en el inventario.");
    }

    const { data, error } = await supabase.from("sale_items").insert({
      sale_id: sale_id,
      stock_product_id: stock_product_id,
      quantity: quantity,
      sale_item_total: sale_item_total,
    });

    if (error) {
      throw error;
    }

    const newQuantity = productData.quantity - quantity;
    const { error: updateProductError } = await supabase
      .from("stock_products")
      .update({ quantity: newQuantity })
      .eq("id", stock_product_id);

    if (updateProductError) {
      throw updateProductError;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getSaleItem(sale_item_id) {
  try {
    const { data, error } = await supabase
      .from("sale_items")
      .select("*")
      .eq("id", sale_item_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editSaleItem(
  sale_item_id,
  sale_id,
  stock_product_id,
  quantity,
  sale_item_total
) {
  try {
    const { data, error } = await supabase
      .from("sale_items")
      .update({
        sale_id: sale_id,
        stock_product_id: stock_product_id,
        quantity: quantity,
        sale_item_total: sale_item_total,
      })
      .eq("id", sale_item_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteSaleItem(sale_item_id) {
  try {
    const { data: saleItemData, error: saleItemError } = await supabase
      .from("sale_items")
      .select("stock_product_id, quantity")
      .eq("id", sale_item_id)
      .single();

    if (saleItemError) {
      throw saleItemError;
    }

    const { data, error } = await supabase
      .from("sale_items")
      .delete()
      .eq("id", sale_item_id)
      .single();

    if (error) {
      throw error;
    }

    const { data: productData, error: productError } = await supabase
      .from("stock_products")
      .select("quantity")
      .eq("id", saleItemData.stock_product_id)
      .single();

    if (productError) {
      throw productError;
    }

    const newQuantity = productData.quantity + saleItemData.quantity;
    const { error: updateProductError } = await supabase
      .from("stock_products")
      .update({ quantity: newQuantity })
      .eq("id", saleItemData.stock_product_id);

    if (updateProductError) {
      throw updateProductError;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getSaleItemsFromSale(sale_id) {
  try {
    const { data, error } = await supabase
      .from("sale_items")
      .select("*")
      .eq("sale_id", sale_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function changeSaleItemQuantity(
  sale_item_id,
  quantity,
  sale_item_total
) {
  try {
    const { data: saleItemData, error: saleItemError } = await supabase
      .from("sale_items")
      .select("stock_product_id, quantity")
      .eq("id", sale_item_id)
      .single();

    if (saleItemError) {
      throw saleItemError;
    }

    const quantityDifference = quantity - saleItemData.quantity;

    const { data, error } = await supabase
      .from("sale_items")
      .update({
        quantity: quantity,
        sale_item_total: sale_item_total,
      })
      .eq("id", sale_item_id);

    if (error) {
      throw error;
    }

    const { data: productData, error: productError } = await supabase
      .from("stock_products")
      .select("quantity")
      .eq("id", saleItemData.stock_product_id)
      .single();

    if (productError) {
      throw productError;
    }

    const newQuantity = productData.quantity - quantityDifference;
    const { error: updateProductError } = await supabase
      .from("stock_products")
      .update({ quantity: newQuantity })
      .eq("id", saleItemData.stock_product_id);

    if (updateProductError) {
      throw updateProductError;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function increaseSaleItemQuantity(
  sale_item_id,
  product_price,
  current_quantity,
  stock_product_id,
  product_quantity
) {
  try {
    const newQuantity = current_quantity + 1;
    const newSaleItemTotal = product_price * newQuantity;

    const { data: saleItemData, error: saleItemError } = await supabase
      .from("sale_items")
      .update({
        quantity: newQuantity,
        sale_item_total: newSaleItemTotal,
      })
      .eq("id", sale_item_id);

    if (saleItemError) {
      throw saleItemError;
    }

    const { data: productData, error: productError } = await supabase
      .from("stock_products")
      .update({
        quantity: product_quantity - 1,
      })
      .eq("id", stock_product_id);

    if (productError) {
      throw productError;
    }

    return saleItemData;
  } catch (error) {
    throw error;
  }
}

export async function decreaseSaleItemQuantity(
  sale_item_id,
  product_price,
  current_quantity,
  stock_product_id,
  product_quantity
) {
  try {
    const newQuantity = current_quantity - 1;
    const newSaleItemTotal = product_price * newQuantity;

    const { data: saleItemData, error: saleItemError } = await supabase
      .from("sale_items")
      .update({
        quantity: newQuantity,
        sale_item_total: newSaleItemTotal,
      })
      .eq("id", sale_item_id);

    if (saleItemError) {
      throw saleItemError;
    }

    const { data: productData, error: productError } = await supabase
      .from("stock_products")
      .update({
        quantity: product_quantity + 1,
      })
      .eq("id", stock_product_id);

    if (productError) {
      throw productError;
    }

    return saleItemData;
  } catch (error) {
    throw error;
  }
}

export async function emptyCart(sale_id) {
  try {
    // Paso 1: Obtener todos los sale_items para la venta
    const { data: saleItems, error: saleItemsError } = await supabase
      .from("sale_items")
      .select("stock_product_id, quantity")
      .eq("sale_id", sale_id);

    if (saleItemsError) {
      throw saleItemsError;
    }

    // Paso 2: Actualizar las cantidades de los productos
    for (const saleItem of saleItems) {
      const { data: productData, error: productError } = await supabase
        .from("stock_products")
        .select("quantity")
        .eq("id", saleItem.stock_product_id)
        .single();

      if (productError) {
        throw productError;
      }

      const newQuantity = productData.quantity + saleItem.quantity;

      const { error: updateProductError } = await supabase
        .from("stock_products")
        .update({ quantity: newQuantity })
        .eq("id", saleItem.stock_product_id);

      if (updateProductError) {
        throw updateProductError;
      }
    }

    // Paso 3: Eliminar todos los sale_items para la venta
    const { error: deleteError } = await supabase
      .from("sale_items")
      .delete()
      .eq("sale_id", sale_id);

    if (deleteError) {
      throw deleteError;
    }

    // Paso 4: Actualizar el total de la venta a 0
    const { error: updateSaleError } = await supabase
      .from("sales") // Asumiendo que tienes una tabla llamada "sales" donde se guarda la venta
      .update({ sale_total: 0 }) // Cambia "total" por el nombre real de la columna si es diferente
      .eq("id", sale_id);

    if (updateSaleError) {
      throw updateSaleError;
    }

    return { message: "El carrito ha sido vaciado y los productos actualizados." };
  } catch (error) {
    throw error;
  }
}
