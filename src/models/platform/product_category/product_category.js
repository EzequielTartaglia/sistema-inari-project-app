import supabase from "@/utils/supabase/supabaseClient";

export async function getProductCategories() {
  try {
    const { data, error } = await supabase
      .from("product_categories")
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
    const { data, error } = await supabase.from("product_categories").insert({
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

export async function getProductCategory(product_category_id) {
  try {
    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .eq("id", product_category_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editProductCategory(product_category_id, name, description) {
  try {
    const { data, error } = await supabase
      .from("product_categories")
      .update({
        name: name,
        description: description
      })
      .eq("id", product_category_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteProductCategory(product_category_id) {
  try {
    const { data, error } = await supabase
      .from("product_categories")
      .delete()
      .eq("id", product_category_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
