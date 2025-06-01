// api/submit.js
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

  if (!name) return res.status(400).send('Missing name');

  const { error } = await supabase.from('availability').insert([{ name, ...slots }]);

  if (error) return res.status(500).send('Insert failed');

  return res.status(200).send('Success');
};
