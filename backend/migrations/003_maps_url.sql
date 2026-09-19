UPDATE site_settings
SET value = jsonb_set(
  COALESCE(value, '{}'::jsonb),
  '{maps_url}',
  '"https://maps.google.com/?q=ISKCON+Margao+Matchless+Gifts"'
)
WHERE key = 'public';
