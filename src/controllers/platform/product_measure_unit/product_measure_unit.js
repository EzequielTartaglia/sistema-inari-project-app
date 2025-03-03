import supabase from "@/utils/supabase/supabaseClient";

export async function getProductMeasureUnits() {
  try {
    const { data, error } = await supabase
      .from("stock_product_measure_units")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getProductMeasureUnitsFromBusiness(platform_user_business_id) {
  try {
    const { data, error } = await supabase
      .from("stock_product_measure_units")
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

export async function addProductMeasureUnit(name, description, platform_user_business_id) {
  try {
    const { data, error } = await supabase.from("stock_product_measure_units").insert({
      name: name,
      description: description,
      platform_user_business_id: platform_user_business_id
    });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getProductMeasureUnit(stock_product_measure_unit_id) {
  try {
    const { data, error } = await supabase
      .from("stock_product_measure_units")
      .select("*")
      .eq("id", stock_product_measure_unit_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editProductMeasureUnit(stock_product_measure_unit_id, name, description, platform_user_business_id) {
  try {
    const { data, error } = await supabase
      .from("stock_product_measure_units")
      .update({
        name: name,
        description: description,
        platform_user_business_id: platform_user_business_id
      })
      .eq("id", stock_product_measure_unit_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteProductMeasureUnit(stock_product_measure_unit_id) {
  try {
    const { data, error } = await supabase
      .from("stock_product_measure_units")
      .delete()
      .eq("id", stock_product_measure_unit_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
