-- =============================================================================
-- CargoGrid OS — allowed values for questionnaire and inquiry choice fields
-- =============================================================================
-- Run once in Supabase Dashboard > SQL Editor. Safe to re-run.
--
-- WHY THIS EXISTS
--   The choice columns were declared as plain VARCHAR and TEXT[], with the
--   permitted values recorded only in a trailing SQL comment. Comments do not
--   reject anything, and they go stale the moment the form changes: by the time
--   the modules were realigned with the product guide, every one of those
--   comments described a set that no longer matched the questionnaire.
--
--   These constraints move the value set from a comment into the database,
--   where a typo in a form option or a rename that misses one of the three
--   label maps fails loudly instead of silently storing an id nothing can
--   display.
--
-- WHY NOT VALID
--   Each constraint is added NOT VALID, so it governs every INSERT and UPDATE
--   from now on without scanning what is already stored. A production table may
--   hold values from an older version of the form, and failing the migration
--   over historical rows would block the fix for new ones. Section 3 checks
--   what is actually in there; section 4 promotes the constraints once it comes
--   back clean.
--
-- ARRAY COLUMNS
--   `<@` reads as "is contained by". desired_modules <@ ARRAY[...] passes when
--   every element of the array is a member of the allowed set, and an empty
--   array passes trivially, which is what an unanswered question stores.
-- =============================================================================


-- 1. Refresh the comments so the documented set matches the enforced one ------

COMMENT ON COLUMN inquiries.company_type IS 'forwarder | 3pl | trucking | inhouse | courier | other';
COMMENT ON COLUMN inquiries.shipment_volume IS '<100 | 100-500 | 500-1000 | 1000+';
COMMENT ON COLUMN inquiries.biggest_pain IS 'rfq | tracking | pod | warehouse | billing | margin';
COMMENT ON COLUMN inquiries.status IS 'Inquiry Masuk | Draft Kuesioner | Kuesioner Selesai | Meeting Scheduled';
COMMENT ON COLUMN questionnaires.operation_scope IS 'domestic | international | both, or empty while the questionnaire is still a draft';
COMMENT ON COLUMN questionnaires.desired_modules IS 'Subset of: commercial, ops, tracking, finance, warehouse, procurement, hris, analytics. Ids are stable; renaming one orphans every answer already recorded against it.';
COMMENT ON COLUMN questionnaires.roles_involved IS 'Subset of: sales, ops, finance, warehouse, driver, hr, management';


-- 2. Add the constraints ------------------------------------------------------

ALTER TABLE inquiries DROP CONSTRAINT IF EXISTS inquiries_company_type_allowed;
ALTER TABLE inquiries ADD CONSTRAINT inquiries_company_type_allowed
    CHECK (company_type IN ('forwarder', '3pl', 'trucking', 'inhouse', 'courier', 'other')) NOT VALID;

ALTER TABLE inquiries DROP CONSTRAINT IF EXISTS inquiries_shipment_volume_allowed;
ALTER TABLE inquiries ADD CONSTRAINT inquiries_shipment_volume_allowed
    CHECK (shipment_volume IN ('<100', '100-500', '500-1000', '1000+')) NOT VALID;

ALTER TABLE inquiries DROP CONSTRAINT IF EXISTS inquiries_biggest_pain_allowed;
ALTER TABLE inquiries ADD CONSTRAINT inquiries_biggest_pain_allowed
    CHECK (biggest_pain IN ('rfq', 'tracking', 'pod', 'warehouse', 'billing', 'margin')) NOT VALID;

ALTER TABLE inquiries DROP CONSTRAINT IF EXISTS inquiries_status_allowed;
ALTER TABLE inquiries ADD CONSTRAINT inquiries_status_allowed
    CHECK (status IN ('Inquiry Masuk', 'Draft Kuesioner', 'Kuesioner Selesai', 'Meeting Scheduled')) NOT VALID;

ALTER TABLE inquiries DROP CONSTRAINT IF EXISTS inquiries_lang_allowed;
ALTER TABLE inquiries ADD CONSTRAINT inquiries_lang_allowed
    CHECK (lang IS NULL OR lang IN ('id', 'en')) NOT VALID;

-- Empty string is permitted: a draft questionnaire saves before this question
-- has been answered.
ALTER TABLE questionnaires DROP CONSTRAINT IF EXISTS questionnaires_operation_scope_allowed;
ALTER TABLE questionnaires ADD CONSTRAINT questionnaires_operation_scope_allowed
    CHECK (operation_scope IS NULL OR operation_scope IN ('', 'domestic', 'international', 'both')) NOT VALID;

ALTER TABLE questionnaires DROP CONSTRAINT IF EXISTS questionnaires_desired_modules_allowed;
ALTER TABLE questionnaires ADD CONSTRAINT questionnaires_desired_modules_allowed
    CHECK (desired_modules IS NULL OR desired_modules <@ ARRAY[
        'commercial', 'ops', 'tracking', 'finance', 'warehouse', 'procurement', 'hris', 'analytics'
    ]::text[]) NOT VALID;

ALTER TABLE questionnaires DROP CONSTRAINT IF EXISTS questionnaires_roles_involved_allowed;
ALTER TABLE questionnaires ADD CONSTRAINT questionnaires_roles_involved_allowed
    CHECK (roles_involved IS NULL OR roles_involved <@ ARRAY[
        'sales', 'ops', 'finance', 'warehouse', 'driver', 'hr', 'management'
    ]::text[]) NOT VALID;

ALTER TABLE questionnaires DROP CONSTRAINT IF EXISTS questionnaires_current_step_range;
ALTER TABLE questionnaires ADD CONSTRAINT questionnaires_current_step_range
    CHECK (current_step IS NULL OR current_step BETWEEN 1 AND 4) NOT VALID;

-- service_types and cargo_types are deliberately left unconstrained. Both store
-- human-readable labels rather than ids, and the label text is likelier to be
-- reworded than the option set is to change, so a constraint there would break
-- on copy edits without catching a real defect.


-- 3. Inspect what is already stored -------------------------------------------
-- Every row returned is a value some earlier version of the form wrote and the
-- current one no longer offers. Expect none on a young database.

SELECT 'inquiries.company_type' AS column_name, company_type AS value, count(*) AS rows
FROM inquiries WHERE company_type NOT IN ('forwarder', '3pl', 'trucking', 'inhouse', 'courier', 'other')
GROUP BY company_type
UNION ALL
SELECT 'inquiries.biggest_pain', biggest_pain, count(*)
FROM inquiries WHERE biggest_pain NOT IN ('rfq', 'tracking', 'pod', 'warehouse', 'billing', 'margin')
GROUP BY biggest_pain
UNION ALL
SELECT 'inquiries.shipment_volume', shipment_volume, count(*)
FROM inquiries WHERE shipment_volume NOT IN ('<100', '100-500', '500-1000', '1000+')
GROUP BY shipment_volume
UNION ALL
SELECT 'questionnaires.desired_modules', m, count(*)
FROM questionnaires, unnest(coalesce(desired_modules, '{}')) AS m
WHERE m <> ALL (ARRAY['commercial', 'ops', 'tracking', 'finance', 'warehouse', 'procurement', 'hris', 'analytics'])
GROUP BY m
UNION ALL
SELECT 'questionnaires.roles_involved', r, count(*)
FROM questionnaires, unnest(coalesce(roles_involved, '{}')) AS r
WHERE r <> ALL (ARRAY['sales', 'ops', 'finance', 'warehouse', 'driver', 'hr', 'management'])
GROUP BY r;


-- 4. Promote the constraints once section 3 returns nothing -------------------
-- Until this runs the constraints guard new writes only. Running it verifies
-- the existing rows too, after which Postgres treats them as fully enforced.
--
-- ALTER TABLE inquiries      VALIDATE CONSTRAINT inquiries_company_type_allowed;
-- ALTER TABLE inquiries      VALIDATE CONSTRAINT inquiries_shipment_volume_allowed;
-- ALTER TABLE inquiries      VALIDATE CONSTRAINT inquiries_biggest_pain_allowed;
-- ALTER TABLE inquiries      VALIDATE CONSTRAINT inquiries_status_allowed;
-- ALTER TABLE inquiries      VALIDATE CONSTRAINT inquiries_lang_allowed;
-- ALTER TABLE questionnaires VALIDATE CONSTRAINT questionnaires_operation_scope_allowed;
-- ALTER TABLE questionnaires VALIDATE CONSTRAINT questionnaires_desired_modules_allowed;
-- ALTER TABLE questionnaires VALIDATE CONSTRAINT questionnaires_roles_involved_allowed;
-- ALTER TABLE questionnaires VALIDATE CONSTRAINT questionnaires_current_step_range;
