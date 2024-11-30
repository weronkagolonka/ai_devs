SELECT dc_id 
FROM datacenters 
WHERE is_active = 1 AND manager NOT IN (SELECT id FROM users WHERE is_active = 1);