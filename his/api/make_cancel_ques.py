from erpnext.stock.get_item_details import get_pos_profile
import  frappe

@frappe.whitelist()
def make_cancel(**args):
	que= frappe.get_doc("Que", args.get("que"))
	if que.owner == frappe.session.user:
		frappe.db.set_value('Que', args.get("que"), 'status', 'Canceled')
		s= frappe.get_doc("Sales Invoice",args.get("sales_invoice"))
		
		so = args.get("sales_order")
		if so:
			sales_order =  frappe.get_doc("Sales Order",args.get("sales_order"))
			sales_order.cancel()
		# f= frappe.get_doc("Fee Validity",args.get("fee"))
		# f.cancel()
		if s:
			s.cancel()
	else:
		frappe.throw("You are not the owner of this que")


	




