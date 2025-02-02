CREATE OR REPLACE FUNCTION initiativeResultsFunction(election_id_param INT)
RETURNS TABLE (
  optionData JSON
) AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    option
  FROM 
      "initiativeResultsView"
  WHERE 
      electionId = election_id_param;
END; $$
LANGUAGE plpgsql;