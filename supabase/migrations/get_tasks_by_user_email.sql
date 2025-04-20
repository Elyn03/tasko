CREATE OR REPLACE FUNCTION get_tasks_by_user_email(
  email TEXT,
  userLat DOUBLE PRECISION,
  userLng DOUBLE PRECISION
)
RETURNS TABLE (
  task_id INTEGER,
  title TEXT,
  description VARCHAR,
  done BOOLEAN,
  created_at TIMESTAMP,
  lng DOUBLE PRECISION,
  lat DOUBLE PRECISION,
  distance DOUBLE PRECISION
)
LANGUAGE SQL
AS $$
  SELECT
    tasks.id AS task_id,
    tasks.title,
    tasks.description,
    tasks.done,
    tasks.created_at,
    ST_X(tasks.location::geometry) AS lng,
    ST_Y(tasks.location::geometry) AS lat,
    ST_DISTANCE(
      tasks.location,
      ST_SetSRID(ST_MakePoint(userLng, userLat), 4326)::geography
    ) AS distance
  FROM
    tasks
  JOIN
    users ON tasks.user_id = users.id
  WHERE users.email = get_tasks_by_user_email.email
    AND tasks.location IS NOT NULL
  ORDER BY
    distance ASC;
$$;
