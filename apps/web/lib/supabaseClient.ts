import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveDocument({
  id,
  owner_id,
  title,
  content,
  markdown,
  html,
  origin = 'user',
  ai_metadata = null,
}: {
  id?: string;
  owner_id: string;
  title: string;
  content: any;
  markdown?: string;
  html?: string;
  origin?: 'user' | 'ai' | 'copypaste';
  ai_metadata?: any;
}) {
  // Only include id if it is defined
  const doc: any = {
    owner_id,
    title,
    content,
    markdown,
    html,
    origin,
    ai_metadata,
    updated_at: new Date().toISOString(),
  };
  if (id) doc.id = id;

  const { data, error } = await supabase
    .from('documents')
    .upsert([doc], { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function loadDocument(owner_id: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('owner_id', owner_id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116: No rows found
  return data;
} 