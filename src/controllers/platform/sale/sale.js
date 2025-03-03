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

export async function getSalesFromBusiness(platform_user_business_id) {
  try {
    const { data, error } = await supabase
      .from("sales")
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

export async function addSale(
  platform_user_id,
  sale_date,
  sale_total,
  is_closed,
  platform_user_business_id
) {
  try {
    const { data, error } = await supabase.from("sales").insert({
      platform_user_id: platform_user_id,
      sale_date: sale_date,
      sale_total: sale_total,
      is_closed: is_closed,
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
  platform_user_id,
  sale_date,
  sale_total,
  is_closed,
  platform_user_business_id
) {
  try {
    const { data, error } = await supabase
      .from("sales")
      .update({
        platform_user_id: platform_user_id,
        sale_date: sale_date,
        sale_total: sale_total,
        is_closed: is_closed,
        platform_user_business_id: platform_user_business_id,
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

export async function getLastSale(platform_user_id) {
  try {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("platform_user_id", platform_user_id)
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

export async function changeSaleTotal(sale_id, sale_total) {
  try {
    const { data, error } = await supabase
      .from("sales")
      .update({
        sale_total: sale_total,
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

export async function closeSale(sale_id) {
  try {
    const { data, error } = await supabase
      .from("sales")
      .update({
        is_closed: true,
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
