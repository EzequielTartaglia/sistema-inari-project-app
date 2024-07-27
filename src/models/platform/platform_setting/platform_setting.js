import supabase from "@/utils/supabase/supabaseClient";

export async function getPlatformSettings(platform_setting_id) {
  try {
    const { data, error } = await supabase
      .from("platform_settings")
      .select("*")
      .eq("id", parseInt(platform_setting_id))
      .single(); 

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching platform settings:', error);
    throw error;
  }
}


export async function editPlatformSettings(platform_setting_id, contact_number) {
  try {
    const { data, error } = await supabase
      .from("platform_settings")
      .update({
        contact_number: contact_number,
      })
      .eq("id", platform_setting_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
