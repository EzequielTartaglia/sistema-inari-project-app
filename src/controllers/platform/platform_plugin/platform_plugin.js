import supabase from "@/utils/supabase/supabaseClient";

export async function getPlatformPlugins() {
  try {
    const { data, error } = await supabase.from("platform_plugins").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addPlatformPlugin(name, description) {
  try {
    const { data, error } = await supabase.from("platform_plugins").insert({
      name: name,
      description: description,
    });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getPlatformPlugin(platform_plugin_id) {
  try {
    const { data, error } = await supabase
      .from("platform_plugins")
      .select("*")
      .eq("id", platform_plugin_id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching pluggin:", error);
    throw error;
  }
}

export async function editPlatformPlugin(platform_plugin_id, name, description) {
  try {
    const { data, error } = await supabase
      .from("platform_plugins")
      .update({
        name: name,
        description: description,
      })
      .eq("id", platform_plugin_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deletePlatformPlugin(platform_plugin_id) {
  try {
    const { data, error } = await supabase
      .from("platform_plugins")
      .delete()
      .eq("id", platform_plugin_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
