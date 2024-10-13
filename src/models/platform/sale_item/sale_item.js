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
  product_id,
  quantity = 1,
  sale_item_total
) {
  try {
    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("quantity")
      .eq("id", product_id)
      .single();

    if (productError) {
      throw productError;
    }

    if (productData.quantity < quantity) {
      throw new Error("No hay suficiente cantidad en el inventario.");
    }

    const { data, error } = await supabase.from("sale_items").insert({
      sale_id: sale_id,
      product_id: product_id,
      quantity: quantity,
      sale_item_total: sale_item_total,
    });

    if (error) {
      throw error;
    }

    const newQuantity = productData.quantity - quantity;
    const { error: updateProductError } = await supabase
      .from("products")
      .update({ quantity: newQuantity })
      .eq("id", product_id);

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
  product_id,
  quantity,
  sale_item_total
) {
  try {
    const { data, error } = await supabase
      .from("sale_items")
      .update({
        sale_id: sale_id,
        product_id: product_id,
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
      .select("product_id, quantity")
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
      .from("products")
      .select("quantity")
      .eq("id", saleItemData.product_id)
      .single();

    if (productError) {
      throw productError;
    }

    const newQuantity = productData.quantity + saleItemData.quantity;
    const { error: updateProductError } = await supabase
      .from("products")
      .update({ quantity: newQuantity })
      .eq("id", saleItemData.product_id);

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
    return data;
  } catch (error) {
    throw error;
  }
}

export async function increaseSaleItemQuantity(
  sale_item_id,
  product_price,
  current_quantity,
  product_id,
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
      .from("products")
      .update({
        quantity: product_quantity - 1,
      })
      .eq("id", product_id);

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
  product_id,
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
      .from("products")
      .update({
        quantity: product_quantity + 1,
      })
      .eq("id", product_id);

    if (productError) {
      throw productError;
    }

    return saleItemData;
  } catch (error) {
    throw error;
  }
}
