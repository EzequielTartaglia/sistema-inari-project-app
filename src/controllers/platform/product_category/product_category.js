import supabase from "@/utils/supabase/supabaseClient";

export async function getProductCategories() {
  try {
    const { data, error } = await supabase
      .from("stock_product_categories")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addProductCategory(name, description) {
  try {
    const { data, error } = await supabase.from("stock_product_categories").insert({
      name: name,
      description: description
    });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getProductCategory(stock_product_category_id) {
  try {
    const { data, error } = await supabase
      .from("stock_product_categories")
      .select("*")
      .eq("id", stock_product_category_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editProductCategory(stock_product_category_id, name, description) {
  try {
    const { data, error } = await supabase
      .from("stock_product_categories")
      .update({
        name: name,
        description: description
      })
      .eq("id", stock_product_category_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteProductCategory(stock_product_category_id) {
  try {
    const { data, error } = await supabase
      .from("stock_product_categories")
      .delete()
      .eq("id", stock_product_category_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
