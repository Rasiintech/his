import frappe
import pymysql

def get_conn():
    cfg = frappe.local.conf.get("legacy_smartfinancial") or {}
    missing = [k for k in ("host", "user", "password", "database") if not cfg.get(k)]
    if missing:
        frappe.throw(f"Missing legacy_smartfinancial config keys: {', '.join(missing)}")

    return pymysql.connect(
        host=cfg["host"],
        user=cfg["user"],
        password=cfg["password"],
        database=cfg["database"],
        port=int(cfg.get("port", 3306)),
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True,
    )

def fetch_patient_labs(patient_number: str, limit: int = 500):
    patient_number = (patient_number or "").strip()
    if not patient_number:
        return []

    sql = """
    SELECT
    R.DatePerformed,
    R.ProcedureID,
    R.ParameterID,
    R.LabTestResults,
    R.Reference,
    H.PatientNumber,
    H.PatientStatus,
    D.DoctorName
    FROM labrequestheader H
    JOIN labresultdetail R
    ON H.LabRequestNumber = R.LabRequestNumber
    JOIN doctorinformation D
    ON D.DoctorID = H.DoctorID
    WHERE
    H.PatientNumber = %s
    AND R.LabTestResults IS NOT NULL
    ORDER BY R.DatePerformed DESC
    LIMIT %s;

    """

    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, (patient_number, int(limit)))
            return cur.fetchall()
    finally:
        conn.close()

def fetch_patient_meta(patient_number: str):
    patient_number = (patient_number or "").strip()
    if not patient_number:
        return {}

    sql = """
    SELECT
        CompanyID,
        DepartmentID,
        CustomerID,
        CustomerName,
        CustomerAddress1,
        CustomerAddress2,
        CustomerAddress3,
        CustomerCity,
        CustomerCountry,
        CustomerPhone,
        CustomerEmail,
        CustomerWebPage,
        PatientCellPhone,
        PatientNumber,
        PatientName,
        Age,
        BirthDate,
        Gender,
        Height,
        BloodGroup
    FROM CustomerInformation
    WHERE PatientNumber = %s
    LIMIT 1;
    """

    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, (patient_number,))
            return cur.fetchone() or {}
    finally:
        conn.close()
