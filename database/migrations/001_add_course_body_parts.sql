-- =============================================================
-- Migration 001: Add body_parts column to courses table
-- Idempotent: safe to re-run on existing databases
-- Target: MySQL 8.0+
-- =============================================================

DELIMITER $$

DROP PROCEDURE IF EXISTS `migrate_add_course_body_parts`$$

CREATE PROCEDURE `migrate_add_course_body_parts`()
BEGIN
  DECLARE db_name VARCHAR(128) DEFAULT DATABASE();

  IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = db_name
      AND TABLE_NAME   = 'courses'
      AND COLUMN_NAME  = 'body_parts'
  ) THEN
    ALTER TABLE `courses`
      ADD COLUMN `body_parts` JSON NULL
      COMMENT '训练部位标签，值为 chest|back|legs|shoulders|arms|core|cardio|fullbody|glutes 的数组';
    SELECT 'migration applied: added courses.body_parts' AS result;
  ELSE
    SELECT 'migration skipped: courses.body_parts already exists' AS result;
  END IF;
END$$

DELIMITER ;

CALL `migrate_add_course_body_parts`();

DROP PROCEDURE IF EXISTS `migrate_add_course_body_parts`;
