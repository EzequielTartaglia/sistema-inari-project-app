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
    const { data, error } = await supabase.from("sale_items").insert({
      sale_id: sale_id,
      product_id: product_id,
      quantity: quantity,
      sale_item_total: sale_item_total,
    });
    if (error) {
      throw error;
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
    const { data, error } = await supabase
      .from("sale_items")
      .delete()
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
        sale_item_total: sale_item_total
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

export async function increaseSaleItemQuantity(sale_item_id, product_price, current_quantity) {
  try {
    const newQuantity = current_quantity + 1;
    const newSaleItemTotal = product_price * newQuantity;
    
    const { data, error } = await supabase
      .from("sale_items")
      .update({
        quantity: newQuantity,
        sale_item_total: newSaleItemTotal
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

export async function decreaseSaleItemQuantity(sale_item_id, product_price, current_quantity) {
  try {
    const newQuantity = current_quantity - 1;
    const newSaleItemTotal = product_price * newQuantity;
    
    const { data, error } = await supabase
      .from("sale_items")
      .update({
        quantity: newQuantity,
        sale_item_total: newSaleItemTotal
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


