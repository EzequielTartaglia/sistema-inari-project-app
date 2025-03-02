import supabase from "@/utils/supabase/supabaseClient";

export async function getPlatformUserBusinesses() {
  try {
    const { data, error } = await supabase
      .from("platform_user_businesses")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addPlatformUserBusiness(
  name
) {
  try {
    const { data, error } = await supabase
      .from("platform_user_businesses")
      .insert({
        name: name
      });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addPlatformUserBusinessEnabledPlugins(
  platform_user_business_id,
  enabled_plugins
) {
  try {
    const { data, error } = await supabase
      .from("platform_user_businesses")
      .update({
        enabled_plugins: enabled_plugins,
      })
      .eq("id", platform_user_business_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getPlatformUserBusiness(platform_user_business_id) {
  try {
    const { data, error } = await supabase
      .from("platform_user_businesses")
      .select("*")
      .eq("id", platform_user_business_id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching platform_user:", error);
    throw error;
  }
}

export async function getPlatformUserBusinessEnabledPluggins(platform_user_business_id) {
  try {
    const { data, error } = await supabase
      .from("platform_user_businesses")
      .select("enabled_plugins") 
      .eq("id", platform_user_business_id)
      .single(); 

    if (error) {
      throw error;
    }
    return data?.enabled_plugins || []; 
  } catch (error) {
    console.error("Error fetching platform_user:", error);
    throw error;
  }
}


export async function editPlatformUserBusiness(
  platform_user_business_id,
  name
) {
  try {
    const { data, error } = await supabase
      .from("platform_user_businesses")
      .update({
        name: name,
      })
      .eq("id", platform_user_business_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editPlatformUserBusinessEnabledPlugins(
  platform_user_business_id,
  enabled_plugins
) {
  try {
    const { data, error } = await supabase
      .from("platform_user_businesses")
      .update({
        enabled_plugins: enabled_plugins,
      })
      .eq("id", platform_user_business_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deletePlatformUserBusiness(platform_user_business_id) {
  try {
    const { data, error } = await supabase
      .from("platform_user_businesses")
      .delete()
      .eq("id", platform_user_business_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}