const { createClient } = require('@supabase/supabase-js');

// ✅ Server-side secure keys (from Vercel Environment Variables)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, ...slots } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Missing name' });
  }

  try {
    const { error } = await supabase
      .from('availability')
      .insert([{ name, ...slots }]);

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return res.status(500).json({ error: 'Supabase insert failed' });
    }

    return res.status(200).json({ message: 'Success' });
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return res.status(500).json({ error: 'Unexpected error' });
  }
};
