CREATE MATERIALIZED VIEW "inactiveBallotsView" AS
SELECT
  election.society_id AS societyId,
  COUNT(*) AS count
FROM
  "election"
WHERE
  "start_date" > CURRENT_DATE
  OR "end_date" < CURRENT_DATE
GROUP BY
  election.society_id;