const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, ...slots } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing name' });
    }

    console.log('Submitting payload:', { name, ...slots });

    const { error } = await supabase
      .from('availability')
      .insert([{ name, ...slots }]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Supabase insert failed', details: error.message });
    }

    return res.status(200).json({ message: 'Submission successful' });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
};
