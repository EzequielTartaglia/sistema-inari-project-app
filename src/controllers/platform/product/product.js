import supabase from "@/utils/supabase/supabaseClient";

export async function getProducts() {
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addProduct(
  name,
  description,
  has_image,
  image_path,
  product_category_id,
  price,
  product_measure_unit_id,
  quantity,
  has_bar_code,
  bar_code
) {
  try {
    const { data, error } = await supabase.from("products").insert({
      name: name,
      description: description,
      has_image: has_image,
      image_path: image_path,
      product_category_id: product_category_id,
      price: price,
      product_measure_unit_id: product_measure_unit_id,
      quantity: quantity,
      has_bar_code: has_bar_code,
      bar_code: bar_code,
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

export async function editProduct(
  product_id,
  name,
  description,
  has_image,
  image_path,
  product_category_id,
  price,
  product_measure_unit_id,
  quantity,
  has_bar_code,
  bar_code
) {
  try {
    const { data, error } = await supabase
      .from("products")
      .update({
        name: name,
        description: description,
        has_image: has_image,
        image_path: image_path,
        product_category_id: product_category_id,
        price: price,
        product_measure_unit_id: product_measure_unit_id,
        quantity: quantity,
        has_bar_code: has_bar_code,
        bar_code: bar_code,
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
