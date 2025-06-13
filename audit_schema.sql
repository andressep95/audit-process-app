-- Audit Management System Database Schema
-- Clean schema ready for flexible backend configuration

CREATE TABLE audit_headers (
    id SERIAL PRIMARY KEY,
    country VARCHAR(100),
    store_name VARCHAR(200),
    store_manager VARCHAR(150),
    auditor_name VARCHAR(150),
    audit_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    general_observations TEXT
);

CREATE TABLE audit_modules (
    id SERIAL PRIMARY KEY,
    module_name VARCHAR(100),
    compliance_percentage INTEGER,
    overall_rating VARCHAR(50),
    audit_header_id INTEGER,
    FOREIGN KEY (audit_header_id) REFERENCES audit_headers(id) ON DELETE CASCADE
);

CREATE TABLE audit_tasks (
    id SERIAL PRIMARY KEY,
    task_code CHAR(1),
    procedure_description TEXT,
    compliance_percentage INTEGER,
    task_rating VARCHAR(50),
    is_completed BOOLEAN DEFAULT FALSE,
    audit_module_id INTEGER,
    FOREIGN KEY (audit_module_id) REFERENCES audit_modules(id) ON DELETE CASCADE
);

CREATE TABLE audit_subtasks (
    id SERIAL PRIMARY KEY,
    requirement_code INTEGER,
    procedure_description TEXT,
    risk_level VARCHAR(50),
    audited_samples INTEGER,
    errors_found INTEGER,
    error_percentage INTEGER,
    compliance_percentage INTEGER,
    is_completed BOOLEAN DEFAULT FALSE,
    audit_task_id INTEGER,
    FOREIGN KEY (audit_task_id) REFERENCES audit_tasks(id) ON DELETE CASCADE
);

CREATE TABLE audit_observations (
    id SERIAL PRIMARY KEY,
    observation_text TEXT,
    image_url VARCHAR(500),
    audit_subtask_id INTEGER,
    FOREIGN KEY (audit_subtask_id) REFERENCES audit_subtasks(id) ON DELETE CASCADE
);

-- Optional: Indexes for better performance
CREATE INDEX idx_audit_headers_date ON audit_headers(audit_date);
CREATE INDEX idx_audit_headers_country_store ON audit_headers(country, store_name);
CREATE INDEX idx_audit_modules_header ON audit_modules(audit_header_id);
CREATE INDEX idx_audit_tasks_module ON audit_tasks(audit_module_id);
CREATE INDEX idx_audit_subtasks_task ON audit_subtasks(audit_task_id);
CREATE INDEX idx_audit_observations_subtask ON audit_observations(audit_subtask_id);