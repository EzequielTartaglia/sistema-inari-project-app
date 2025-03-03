import supabase from "@/utils/supabase/supabaseClient";

export async function getProducts() {
  try {
    const { data, error } = await supabase.from("stock_products").select("*");
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
  stock_product_category_id,
  price,
  stock_product_measure_unit_id,
  quantity,
  has_bar_code,
  bar_code,
  platform_user_business_id
) {
  try {
    const { data, error } = await supabase.from("stock_products").insert({
      name: name,
      description: description,
      has_image: has_image,
      image_path: image_path,
      stock_product_category_id: stock_product_category_id,
      price: price,
      stock_product_measure_unit_id: stock_product_measure_unit_id,
      quantity: quantity,
      has_bar_code: has_bar_code,
      bar_code: bar_code,
      platform_user_business_id: platform_user_business_id,
    });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getProduct(stock_products_id) {
  try {
    const { data, error } = await supabase
      .from("stock_products")
      .select("*")
      .eq("id", stock_products_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getProductsFromBusiness(platform_user_business_id) {
  try {
    const { data, error } = await supabase
      .from("stock_products")
      .select("*")
      .eq("platform_user_business_id", platform_user_business_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editProduct(
  stock_products_id,
  name,
  description,
  has_image,
  image_path,
  stock_product_category_id,
  price,
  stock_product_measure_unit_id,
  quantity,
  has_bar_code,
  bar_code,
  platform_user_business_id
) {
  try {
    const { data, error } = await supabase
      .from("stock_products")
      .update({
        name: name,
        description: description,
        has_image: has_image,
        image_path: image_path,
        stock_product_category_id: stock_product_category_id,
        price: price,
        stock_product_measure_unit_id: stock_product_measure_unit_id,
        quantity: quantity,
        has_bar_code: has_bar_code,
        bar_code: bar_code,
        platform_user_business_id: platform_user_business_id,
      })
      .eq("id", stock_products_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteProduct(stock_products_id) {
  try {
    const { data, error } = await supabase
      .from("stock_products")
      .delete()
      .eq("id", stock_products_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
