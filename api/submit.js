const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, id } = req.headers; // Extract name and id from headers
    const { ...slots } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing name' });
    }

    if (req.method === 'PATCH' && !id) {
      return res.status(400).json({ error: 'ID is required for updates' });
    }

    console.log('Submitting payload:', { name, id, ...slots });

    let query = supabase.from('availability');
    if (req.method === 'PATCH') {
      // Update existing record
      query = query.update({ ...slots }).eq('name', name).eq('id', id);
    } else {
      // Insert new record
      query = query.insert([{ name, ...slots }]);
    }

    const { error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ error: 'Supabase query failed', details: error.message });
    }

    return res.status(200).json({ message: 'Submission successful' });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
};
