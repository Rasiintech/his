from healthcare.healthcare.doctype.inpatient_record.inpatient_record import admit_patient
import frappe
import json 
@frappe.whitelist()
def  admit_p(inp_doc, service_unit,patient, type, is_insurance = "", expected_discharge=None):
	ip_doc = frappe.get_doc("Inpatient Record" , inp_doc)
	frappe.db.set_value('Healthcare Service Unit', service_unit, 'patient',patient)
	ip_doc.bed=service_unit
	ip_doc.type=type
	ip_doc.room=frappe.db.get_value("Healthcare Service Unit", service_unit , "service_unit_type")
	ip_doc.inpatient_status = "Admitted"
	ip_doc.save()
	if type=="Maternity":
		frappe.get_doc({
			"doctype": "Meternity Card",
			"patient": ip_doc.patient,
			"practitioner": ip_doc.primary_practitioner or ip_doc.admission_practitioner
		}).insert()

	if is_insurance:
		ip_doc.insurance = is_insurance
		ip_doc.save()
	check_in = frappe.utils.now()
	
	admit_patient(ip_doc , service_unit , check_in , expected_discharge)

	doc_plan = frappe.get_doc({
	"doctype" : "Doctor Plan",
	"patient": ip_doc.patient,
	"ref_practitioner" :ip_doc.primary_practitioner,
	"date": frappe.utils.getdate(),
	"room": frappe.db.get_value("Healthcare Service Unit", service_unit , "service_unit_type"),
	"bed" : service_unit

	

	})
	doc_plan.insert(ignore_permissions=True)
	
	if frappe.db.get_value("Healthcare Service Unit", service_unit , "service_unit_type")=="ICU":
		frappe.get_doc({
			"doctype" : "ICU",
			"patient": ip_doc.patient,
			"practitioner" :ip_doc.primary_practitioner,
			

			

			}).insert(ignore_permissions=True)
	customer=frappe.get_doc("Customer",frappe.db.get_value("Patient",ip_doc.patient,"customer"))
	customer.allow_credit=1
	for row in customer.credit_limits:
		row.credit_limit = 25000
	customer.save()