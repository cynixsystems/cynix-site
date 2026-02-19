-- Execute no Supabase Dashboard: SQL Editor
-- Tabelas projects e previews + RLS para /minha-area

-- 1. Tabela projects (projetos do cliente)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'briefing' CHECK (status IN ('briefing', 'desenvolvimento', 'revisao', 'entregue')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);

-- 2. Tabela previews (prévias de desenvolvimento)
CREATE TABLE IF NOT EXISTS public.previews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_previews_project_id ON public.previews(project_id);

-- 3. RLS (Row Level Security)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.previews ENABLE ROW LEVEL SECURITY;

-- Projects: usuário só vê e altera seus próprios projetos
DROP POLICY IF EXISTS "projects_select_own" ON public.projects;
CREATE POLICY "projects_select_own" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects_insert_own" ON public.projects;
CREATE POLICY "projects_insert_own" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects_update_own" ON public.projects;
CREATE POLICY "projects_update_own" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Previews: usuário só vê previews dos seus projetos
DROP POLICY IF EXISTS "previews_select_own_project" ON public.previews;
CREATE POLICY "previews_select_own_project" ON public.previews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_id AND projects.user_id = auth.uid()
    )
  );
