import supabase from "@/utils/supabase/supabaseClient";

export async function getPlatformUserRoles() {
  try {
    const { data, error } = await supabase
      .from("platform_user_roles")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addPlatformUserRole(name) {
  try {
    const { data, error } = await supabase.from("platform_user_roles").insert({
      name: name,
    });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getPlatformUserRole(user_role_id) {
  try {
    const { data, error } = await supabase
      .from("platform_user_roles")
      .select("*")
      .eq("id", user_role_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editPlatformUserRole(user_role_id, name) {
  try {
    const { data, error } = await supabase
      .from("platform_user_roles")
      .update({
        name: name,
      })
      .eq("id", user_role_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deletePlatformUserRole(user_role_id) {
  try {
    const { data, error } = await supabase
      .from("platform_user_roles")
      .delete()
      .eq("id", user_role_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
