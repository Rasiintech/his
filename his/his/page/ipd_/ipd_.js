frappe.pages['ipd-'].on_page_load = function(wrapper) {
	new IPD(wrapper)
}

IPD = Class.extend(
	{
		init:function(wrapper){
			this.page = frappe.ui.make_app_page({
				parent : wrapper,
				title: "Inpatient",
				single_column : true
			});
			this.groupbyD = []
			this.currDate =  frappe.datetime.get_today()
			this.make()
			this.setupdata_table()
			this.make_grouping_btn()
			let myf = this
			frappe.realtime.on('inp_update', (data) => {
				// alert("in realtime")
				myf.setupdata_table()
					})
			// this.grouping_cols()
		},
		make:function(){

		
			let me = this
   		
			$(frappe.render_template(frappe.dashbard_page.body, me)).appendTo(me.page.main)




		
		},

		setupdata_table : function(gr_ref){
			let currdate = this.currDate
		let tbldata = []
		frappe.db.get_list('Inpatient Record', {
			fields: ['patient','patient_name', 'room' , 'bed' , 'admitted_datetime' , 'type', 'primary_practitioner' ,'admission_practitioner', 'inpatient_status'],
			filters: {
				status: 'Admitted'
			},
			limit : 1000
		}).then(r => {
	
			tbldata = r

		 let me = this

		 	columns = [
			// {title:"ID", field:"name"},
			// {title:"Patient", field:"customer"},
			{title:"No", field:"id", formatter:"rownum"},
			{title:"PID", field:"patient" ,  headerFilter:"input"},
			{title:"Patient Name", field:"patient_name" ,  headerFilter:"input"},
			{title:"Date", field:"admitted_datetime" ,  headerFilter:"input"},
			{title:"Duration", field:"duration" ,  headerFilter:"input" , formatter:durationformatter},
			{
				title: "Doctor Name",
				field: "doctor_name",
				headerFilter: "input",
				formatter: function(cell, formatterParams, onRendered){
					// Display 'primary_practitioner' or fallback to 'admission_practitioner'
					let data = cell.getData();
					return data.primary_practitioner ? data.primary_practitioner : data.admission_practitioner;
				}
			},
			{title:"Type", field:"type" ,  headerFilter:"input",},
			{title:"Room", field:"room" ,  headerFilter:"input",},
			{title:"Bed", field:"bed" ,  headerFilter:"input",},
			{title:"Status", field:"inpatient_status" ,  headerFilter:"input",},
			{title:"Diagnose", field:"diagnose" ,  headerFilter:"input",},
			

			// {title:"Action", field:"action", hozAlign:"center" , formatter:"html"},
			
		 ]

		let list_btns = frappe.listview_settings[`Sales Invoice`]
		// tbldata = tbldata[0]['action'] = "Button"
		let new_data = []
		// if(list_btns)
		// console.log(tbldata)
		tbldata.forEach(row => {

			let btnhml = ''

			row['action'] = btnhml
			row['duration']  = row.admitted_datetime
			new_data.push(row)
		})
		// console.log(columns)
this.table = new Tabulator("#admited", {
			// layout:"fitDataFill",
			layout:"fitDataStretch",
			//  layout:"fitColumns",
			// responsiveLayout:"collapse",
			 rowHeight:30, 
			 groupStartOpen:false,
			 printAsHtml:true,
			 printFooter:"<h2>Example Table Footer<h2>",
			 // groupBy:"customer",
			 groupHeader:function(value, count, data, group){

				 return value + "<span style=' margin-left:0px;'>(" + count + "   )</span>";
			 },
			 groupToggleElement:"header",
			//  groupBy:groupbyD.length >0 ? groupbyD : "",
			 textDirection: frappe.utils.is_rtl() ? "rtl" : "ltr",
	 
			 columns: columns,
			 

			 
			 data: new_data
		 });

		let row = this
		this.table.on("rowClick", function(e ,rows){
		   let target = e.target.nodeName
			console.log(rows._row.data.primary_practitioner || rows._row.data.admission_practitioner)
			frappe.new_doc("Patient History" , {patient: rows._row.data.patient, ref_practitioner: rows._row.data.primary_practitioner || rows._row.data.admission_practitioner})
		  });
		
	
});
		},


		make_grouping_btn:function(){
			let listitmes = ''
			
			let me = this
			let columns = [
				
			
		 ]
				columns.forEach(field => {
					// console.log(field)
					// if(field.docfield.fieldtype !== "Currency"){
						listitmes += `
 
						<li>
						<input type="checkbox" class="form-check-input groupcheck ml-2"  value = '${field.field}' >
						<label class="form-check-label" for="exampleCheck1">${field.title}</label>
						
					</li>	
						
						`
	
					// }
				
	  
				
			})
			$('.page-heade')
				$(`<div class="mt-2 sort-selector">
				
	
	
	
				
				${listitmes}
			</ul>
				</div>`).appendTo('.page-head')
			
			// this.group_by_control = new frappe.ui.GroupBy(this);
		
		},

		grouping_cols:function(){
		
			let me = this
			$('.groupcheck').change(function() {
				// alert ("The element with id " + this.value + " changed.");
				let value = this.value
				if(this.checked) {
				groupbyD.push(this.value)
				}
				else{
					groupbyD = groupbyD.filter(function(e) { return e !== value })
				}
				me.setupdata_table(true);
				// setup_datatable()
				
			});
	
		   
		},

 make_sales_invoice : function(source_name) {
	alert("ok ok")
	frappe.model.open_mapped_doc({
		method: "his.api.make_invoice.make_sales_invoice",
		source_name: source_name
	})
},


 make_credit_invoice : function(source_name) {
	frappe.model.open_mapped_doc({
		method: "his.api.make_invoice.make_credit_invoice",
		source_name: source_name
	})
}
	}

	
)
let Admited = `

<div class="container">
<div class="row">

<div id="admited" style = "min-width : 100%"></div>

</div>


<!-- endrow 2--- >
</div>


`
frappe.dashbard_page = {
	body : Admited
}


formatter = function(cell, formatterParams, onRendered){
			return frappe.datetime.prettyDate(cell.getValue() , 1)
		}



credit_sales = function(source_name){
	frappe.db.get_doc("Sales Order" , source_name)
	.then(r => {
		console.log(r)
		frappe.db.get_value("Customer" , r.customer , "allow_credit")
		.then(cu => {
			if(!cu.message.allow_credit){
				frappe.throw(__('Bukaan looma ogala dayn'))
			}
			else{

				frappe.call({
					method: "erpnext.accounts.utils.get_balance_on",
					args: {
						company: frappe.defaults.get_user_default("Company"),
						party_type: "Customer",
						party: r.customer,
						date: get_today(),
					},
					callback: function(balance) {
						// alert(r.customer)
						frappe.db.get_doc("Customer" , r.customer)
						.then(customer => {
							
							if(balance.message >= customer.credit_limits[0].credit_limit) {
								// alert(r.message)
							// frm.set_value("patient_balance", r.message)
							frappe.throw(__('Bukaankaan Wuu Dhaafay Xadka daynta loo ogolyahay'))
							}
							else{
								frappe.model.open_mapped_doc({
									method: "his.api.make_invoice.make_credit_invoice",
									source_name: source_name
								})

							}

						})
						
					}
				});


				

			}
		})

	})
	

}
durationformatter = function(cell, formatterParams, onRendered){
	return frappe.datetime.prettyDate(cell.getValue() , 1)
}