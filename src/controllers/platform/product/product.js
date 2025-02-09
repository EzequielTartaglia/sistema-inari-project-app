import supabase from "@/utils/supabase/supabaseClient";

export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addProduct(name, description, image_path, product_category_id, price, product_measure_unit_id, quantity) {
  try {
    const { data, error } = await supabase.from("products").insert({
      name: name,
      description: description,
      image_path: image_path,
      product_category_id: product_category_id,
      price: price,
      product_measure_unit_id: product_measure_unit_id,
      quantity: quantity
    });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getProduct(product_id) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", product_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editProduct(product_id, name, description, image_path, product_category_id, price, product_measure_unit_id, quantity) {
  try {
    const { data, error } = await supabase
      .from("products")
      .update({
        name: name,
        description: description,
        image_path: image_path,
        product_category_id: product_category_id,
        price: price,
        product_measure_unit_id: product_measure_unit_id,
        quantity: quantity
      })
      .eq("id", product_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteProduct(product_id) {
  try {
    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", product_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
