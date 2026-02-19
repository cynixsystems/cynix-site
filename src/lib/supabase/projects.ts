import { supabase } from "./client";

export type ProjectStatus = "briefing" | "desenvolvimento" | "revisao" | "entregue";

export interface Project {
  id: string;
  user_id: string;
  name: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface Preview {
  id: string;
  project_id: string;
  title: string;
  url: string;
  created_at: string;
}

export async function fetchProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("fetchProjects error:", error);
    return [];
  }
  return (data ?? []) as Project[];
}

export async function fetchProjectById(projectId: string, userId: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", userId)
    .single();
  if (error || !data) return null;
  return data as Project;
}

export async function fetchPreviewsByProject(projectId: string): Promise<Preview[]> {
  const { data, error } = await supabase
    .from("previews")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as Preview[];
}
