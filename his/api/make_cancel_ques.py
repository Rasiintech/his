# from erpnext.stock.get_item_details import get_pos_profile
# import  frappe

# @frappe.whitelist()
# def make_cancel(**args):
# 	que= frappe.get_doc("Que", args.get("que"))
# 	if que.owner == frappe.session.user:
# 		frappe.db.set_value('Que', args.get("que"), 'status', 'Canceled')
# 		s= frappe.get_doc("Sales Invoice",args.get("sales_invoice"))
		
# 		so = args.get("sales_order")
# 		if so:
# 			sales_order =  frappe.get_doc("Sales Order",args.get("sales_order"))
# 			sales_order.cancel()
# 		# f= frappe.get_doc("Fee Validity",args.get("fee"))
# 		# f.cancel()
# 		if s:
# 			s.cancel()
# 	else:
# 		frappe.throw("You are not the owner of this que")






from erpnext.stock.get_item_details import get_pos_profile
import  frappe
from erpnext.stock.get_item_details import get_pos_profile
from his.api.make_invoice import make_sales_invoice_direct
from his.api.make_invoice import make_credit_invoice

@frappe.whitelist()
def make_cancel(**args):
    frappe.db.set_value('Que', args.get("que"), 'status', 'Canceled')
    s= frappe.get_doc("Sales Invoice",args.get("sales_invoice"))
    
    so = args.get("sales_order")
    if so:
        sales_order =  frappe.get_doc("Sales Order",args.get("sales_order"))
        sales_order.cancel()
    # f= frappe.get_doc("Fee Validity",args.get("fee"))
    # f.cancel()
    if s:
        s.flags.ignore_permissions = True
        s.cancel()
  
@frappe.whitelist()
def make_refer_que(**args):
    company = frappe.defaults.get_user_default("company")
    pos_profile = get_pos_profile(company)
    mode_of_payment = frappe.db.get_value('POS Payment Method', {"parent": pos_profile.name},  'mode_of_payment')
    default_account = frappe.db.get_value('Mode of Payment Account', {"parent": mode_of_payment},  'default_account')
    # mode_of_payment = "Cash"
    items = []
    # empty_items = ""
    # for item in self.items:

    
    que= frappe.get_doc("Que",args.get("que"))
    doctor_amount= args.get("amount")
    patient= args.get("patient")
    discount= args.get("discount")
    paid_amount= args.get("paid_amount")
    practitioner= args.get("practitioner")
    # items.append({
    #         "item_code" : "OPD Consultation",
    #         "rate" : float(doctor_amount),
    #         "qty" : 1,
    #         "medical_department": "Ticket",
    #     })
    # sales_doc = frappe.get_doc({
    #         "doctype" : "Sales Invoice",
    #         "patient": patient,
    #         "posting_date" : que.date,
    #         "customer": frappe.db.get_value("Patient", patient ,"customer"),
    #         "company":que.company,
    #         "cost_center": que.cost_center,
    #         "so_type": "Cashiers",
    #         "is_pos": 1,
    #         "source_order" : "OPD",
    #         "ref_practitioner" : practitioner,
    #         "items" : items,
    #         "discount_amount" : float(discount),
    #         "payments" : [{
	# 				"mode_of_payment" : mode_of_payment,
	# 				"amount" :paid_amount
	# 			}]
        
    #     })
    # # frappe.errprint(mode_of_payment)
    # frappe.errprint("Sales Invoice Preview Before Insert:")
    # frappe.errprint(f"Customer: {sales_doc.customer}")
    # frappe.errprint(f"Company: {sales_doc.company}")
    # frappe.errprint(f"Patient: {sales_doc.patient}")
    # frappe.errprint(f"Posting Date: {sales_doc.posting_date}")
    # frappe.errprint(f"Discount Amount: {sales_doc.discount_amount}")
    # frappe.errprint(f"Payments: {sales_doc.payments}")

    # # 🔍 Print items (looped safely)
    # for i, item in enumerate(sales_doc.items, 1):
    #     frappe.errprint(f"Item {i}: {item.item_code} | Qty: {item.qty} | Rate: {item.rate}")
    # sales_doc.insert()
    # sales_doc.submit()
    que_name = frappe.get_doc({
            'doctype': 'Que',
            'patient': patient,
            "practitioner": practitioner,
            "discount": float(discount),
            "que_type" : "New Patient", 
            "paid_amount" : float(paid_amount), 
            # "sales_invoice": sales_doc.name

            })
    que_name.insert(ignore_permissions = True)
    return que_name.name
    
    

    






	




