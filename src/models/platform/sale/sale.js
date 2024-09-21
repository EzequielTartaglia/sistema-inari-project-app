import supabase from "@/utils/supabase/supabaseClient";

export async function getSales() {
  try {
    const { data, error } = await supabase.from("sales").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addSale(user_id, sale_date, sale_total, is_closed) {
  try {
    const { data, error } = await supabase
      .from("sales")
      .insert({
        user_id: user_id,
        sale_date: sale_date,
        sale_total: sale_total,
        is_closed: is_closed,
      });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getSale(sale_id) {
  try {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("id", sale_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}


export async function editSale(
  sale_id,
  user_id,
  sale_date,
  sale_total,
  is_closed
) {
  try {
    const { data, error } = await supabase
      .from("sales")
      .update({
        user_id: user_id,
        sale_date: sale_date,
        sale_total: sale_total,
        is_closed: is_closed,
      })
      .eq("id", sale_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteSale(sale_id) {
  try {
    const { data, error } = await supabase
      .from("sales")
      .delete()
      .eq("id", sale_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getLastSale(user_id) {
  try {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("user_id", user_id)
      .order("sale_date", { ascending: false }) 
      .limit(1) 
      .single(); 

    if (error) {
      throw error;
    }
    return data; 
  } catch (error) {
    throw error;
  }
}
