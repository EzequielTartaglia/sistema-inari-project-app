import supabase from "@/utils/supabase/supabaseClient";

export async function getCoursesModules() {
  try {
    const { data, error } = await supabase.from("course_modules").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCourseModules(course_id) {
  try {
    const { data: courseModules, error } = await supabase
      .from("course_modules")
      .select("id, title")
      .eq("course_id", course_id);

    if (error) {
      throw error;
    }

    return courseModules;
  } catch (error) {
    throw error;
  }
}

export async function addCourseModule(title, course_id) {
  try {
    const { data, error } = await supabase
      .from("course_modules")
      .insert({ title: title, course_id: course_id });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCourseModule(courseModuleId) {
  try {
    const { data, error } = await supabase
      .from("course_modules")
      .select("*")
      .eq("id", courseModuleId)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editCourseModule(courseModuleId, title) {
  try {
    const { data, error } = await supabase
      .from("course_modules")
      .update({ title: title })
      .eq("id", courseModuleId);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteCourseModule(courseModuleId) {
  try {
    const { data, error } = await supabase
      .from("course_modules")
      .delete()
      .eq("id", courseModuleId);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
