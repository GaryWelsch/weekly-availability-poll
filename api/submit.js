const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { name, ...slots } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).send('Missing or invalid name');
  }

  try {
    const { error } = await supabase
      .from('availability')
      .insert([{ name, ...slots }]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).send('Error inserting data');
    }

    return res.status(200).send('Success');
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).send('Unexpected error');
  }
};
