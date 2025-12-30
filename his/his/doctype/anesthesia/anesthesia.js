frappe.ui.form.on('Anesthesia', {
	refresh(frm) {
		if (!frm.is_new()) {
			frm.add_custom_button(__('Print Consent Form'), () => {

				 {
					// Create new consent form with prefilled values
					frappe.new_doc('Consent Surgery Form', {
						patient: frm.doc.patient,
						surgery_type: frm.doc.procedure_template,
						practitioner: frm.doc.practitioner,
						surgery_preparation: frm.doc.name
					});
				}

			});
		}
	}
});
