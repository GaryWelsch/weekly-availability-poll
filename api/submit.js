import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  runtime: 'edge',
};

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const body = await req.json();
  const { name, ...slots } = body;

  // Basic validation
  if (!name || typeof name !== 'string') {
    return new Response('Invalid name', { status: 400 });
  }

  const { error } = await supabase
    .from('availability')
    .insert([{ name, ...slots }]);

  if (error) {
    console.error(error);
    return new Response('Database error', { status: 500 });
  }

  return new Response('Success', { status: 200 });
};
