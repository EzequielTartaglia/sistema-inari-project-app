import supabase from "@/utils/supabase/supabaseClient";

export async function getProductMeasureUnits() {
  try {
    const { data, error } = await supabase
      .from("product_measure_units")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addProductMeasureUnit(name, description) {
  try {
    const { data, error } = await supabase.from("product_measure_units").insert({
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

export async function getProductMeasureUnit(product_measure_unit_id) {
  try {
    const { data, error } = await supabase
      .from("product_measure_units")
      .select("*")
      .eq("id", product_measure_unit_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editProductMeasureUnit(product_measure_unit_id, name, description) {
  try {
    const { data, error } = await supabase
      .from("product_measure_units")
      .update({
        name: name,
        description: description
      })
      .eq("id", product_measure_unit_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteProductMeasureUnit(product_measure_unit_id) {
  try {
    const { data, error } = await supabase
      .from("product_measure_units")
      .delete()
      .eq("id", product_measure_unit_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
