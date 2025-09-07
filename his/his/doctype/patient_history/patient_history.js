// Copyright (c) 2023, Rasiin Tech and contributors
// For license information, please see license.txt

frappe.ui.form.on('Patient History', {
	view_as_chart:function(frm){
		$("#vitals").html(`<div id="vitalSignsChart"> <img src = "/files/F2.large(2).png" /></canvas>`)
		// alert("Test")
		// setup_chart()
		
	},
	add_new_progress:function(frm){
		frappe.new_doc("Progress Note", { "patient": frm.doc.patient})
	},
	add_new_note:function(frm){
		frappe.new_doc("Notes", { "patient": frm.doc.patient})
	},
	add_new_blood: function(frm){
		frappe.new_doc("BLOOD TRANSFUSION OBSERVATION CHART", { "patient": frm.doc.patient})
	}
	,
	add_history: function(frm){
		frappe.new_doc("History Taken", { "patient": frm.doc.patient})
	}
	,
	refresh: function(frm) {
		frm.add_custom_button(__("Open History"), function(){
		    if(frm.doc.patient){
				frappe.call({
					method: "his.api.p_history.get_history", //dotted path to server method
					args : {"patient" : frm.doc.patient},
					//  args : {"load_a" : currdate , to_date : to_date},
					callback: function(r) {
					
						var x = window.open();
						x.document.open().write(r.message);
						
						
				
					}})
				}
		
			//perform desired action such as routing to new form or fetching etc.
		  })


		if (frappe.user_roles.includes('Cashier')) {
			frm.add_custom_button(__("Refer"), function(){
				refer(frm);
			
				//perform desired action such as routing to new form or fetching etc.
			  })
			frm.add_custom_button(__("Transfer"), function(){
				transfer_patient_dialog(frm);
			
				//perform desired action such as routing to new form or fetching etc.
			  })
			  
			  frm.add_custom_button(__("Transfer"), function(){
				transfer_patient_dialog(frm);
			
				//perform desired action such as routing to new form or fetching etc.
			  })
			// btn.addClass('btn-danger');
			var btn = frm.add_custom_button('Discharge', () => {
				frappe.new_doc("Discharge Summery", { "patient": frm.doc.patient, "ref_practitioner": frm.doc.ref_practitioner, "doctor_plan": frm.doc.name })
				//             frappe.confirm(`<strong>${frappe.session.user_fullname}</strong> Are you sure you want to Discharge patient : <strong>${frm.doc.patient_name}</strong>?`,
				//                     () => {
				//             frappe.call({
				//             method: "his.api.discharge.patient_clearance", //dotted path to server method
				//             args: {
				//                     "patient" : frm.doc.patient,
				//                     "practitioner" : frm.doc.ref_practitioner,
				//                     "inpatient_record": frm.doc.inpatient_record
				//                     },
				//                     callback: function(r) {

				//                             frappe.utils.play_sound("submit")
				//                                 frappe.show_alert({
				//                                     message:__('Patient '+ frm.doc.patient+" Discharge Order Successfully!!"),
				//                                     indicator:'green',
				//                                 }, 5);
				//                     }
				// });
				//             },)
			})
			btn.addClass('btn-danger');
		} 


		if (frappe.user_roles.includes('Doctor')) {
			frm.add_custom_button(__("Ready To Surgery"), function(){
				frappe.new_doc("Surgery Preparation", { "patient": frm.doc.patient, "consultant": frm.doc.ref_practitioner, })
			
				//perform desired action such as routing to new form or fetching etc.
			  })
			  frm.add_custom_button(__("Transfer"), function(){
				transfer_patient_dialog(frm);
			
				//perform desired action such as routing to new form or fetching etc.
			  })

			  frm.add_custom_button(__("Refer"), function(){
				refer(frm);
			
				//perform desired action such as routing to new form or fetching etc.
			  })

			var btn = frm.add_custom_button('Discharge', () => {
				frappe.new_doc("Discharge Summery", { "patient": frm.doc.patient, "ref_practitioner": frm.doc.ref_practitioner, "doctor_plan": frm.doc.name })
			
			})
			btn.addClass('btn-danger');
		} 

		if (frappe.user_roles.includes('Doctor')) {
			var btn1 = frm.add_custom_button('Order', () => {
				frappe.new_doc("Inpatient Order", { "patient": frm.doc.patient, "practitioner": frm.doc.ref_practitioner, "doctor_plan": frm.doc.name })
		
			})
	
		} 
		if (frappe.user_roles.includes('NICU')) {
			var btn1 = frm.add_custom_button('NICU', () => {
				frappe.new_doc("NICU", { "patient": frm.doc.patient})
		
			})
			btn1.addClass('btn-primary');
		} 
		if (frappe.user_roles.includes('Nurse')) {
			var btn3 = frm.add_custom_button('Vital Sign', () => {
				frappe.new_doc("Vital Signs", { "patient": frm.doc.patient })
		
			})
			btn3.addClass('btn-primary');
		
			var btn2 = frm.add_custom_button('Medication', () => {
				frappe.new_doc("Inpatient Medication", { "patient": frm.doc.patient, "practitioner": frm.doc.ref_practitioner, "doctor_plan": frm.doc.name })
		
			})
			btn2.addClass('btn-danger');
			var btn = frm.add_custom_button('Discharge', () => {
				frappe.new_doc("Discharge Summery", { "patient": frm.doc.patient, "ref_practitioner": frm.doc.ref_practitioner, "doctor_plan": frm.doc.name })
			
			})
			btn.addClass('btn-danger');
			var btn4 = frm.add_custom_button('fluid chart', () => {
				frappe.new_doc("fluid chart monitoring", { "patient": frm.doc.patient, "practitioner": frm.doc.ref_practitioner, "doctor_plan": frm.doc.name })
		
			})
			btn4.addClass('btn-danger');
			var btn5 = frm.add_custom_button('Diabetic chart', () => {
				frappe.new_doc("Diabetic Chart", { "patient": frm.doc.patient, "practitioner": frm.doc.ref_practitioner, "doctor_plan": frm.doc.name })
		
			})
			btn5.addClass('btn-danger');

		} 


		
		  
	
		// frm.set_df_property('view_as_chart', 'css_class', 'align-right');
		
			$('.indicator-pill').hide()
		// $('.standard-actions').hide()
		// frm.disable_save();

	
		
		get_history(frm.doc.patient , "vitals")

		var tabs = $('.form-tabs');
		var parentElement = $('.parent');

// Get all child elements of the parent
		var childElements = tabs.children();

		// Loop through each child element and attach click event handler
		childElements.each(function() {
		var childElement = $(this);
		var tab = childElement[0].innerText.replace(/ /g, '_').toLowerCase()
		if(tab == "prescription"){
			tab = "med"
		}
		// Attach click event handler to the current child element
		childElement.click(function() {
			get_history(frm.doc.patient , tab)
			// Code to execute when the current child element is clicked
			// ...
		});
		});

		// $('#patient-history-vitals_tab-tab').on('click', function() {
        //     // Get the clicked tab name
        //     var tabName = $(this).attr('data-fieldname');
		// 	alert("")
            
        //     // Handle tab click event
      
        // });
	
		// var htmlContent = "<div id = 'vitals' >Test </div>";

        // Set the HTML content to a field in the form
        // frm.set_value('vitals', htmlContent);
		// setupdata_table("PID-00265")

	},
	patient:function(frm){
		get_history(frm.doc.patient , "vitals")

		// alert("")
	},
	
});

function setup_chart(){

// Sample vital signs data
const vitalSignsData = [
	{ datetime: '8:00:00', temperature: 98.6, heartRate: 80, bloodPressure: '120' },
	{ datetime: '12:00:00', temperature: 70.1, heartRate: 82, bloodPressure: '150' },
	{ datetime: '16:00:00', temperature: 97.9, heartRate: 78, bloodPressure: '160' },
	// Add more data entries as needed
  ];
  
  // Function to generate a random color
  function getRandomColor() {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
  }
  
  // Extract datetimes and vital signs data
  const datetimes = vitalSignsData.map((data) => new Date(data.datetime));
  const vitalSigns = Object.keys(vitalSignsData[0]).filter((key) => key !== 'datetime');
  
  // Create datasets for each vital sign
  const datasets = vitalSigns.map((sign) => ({
	label: sign,
	data: vitalSignsData.map((data) => data[sign]),
	borderColor: getRandomColor(),
	fill: false,
  }));
  
  // Create a new Chart instance
  const ctx = document.getElementById('vitalSignsChart').getContext('2d');
  const chart = new Chart(ctx, {
	type: 'line',
	data: {
	  labels: datetimes,
	  datasets: datasets,
	},
	options: {
	  responsive: true,
	  scales: {
		x: {
		  type: 'time',
		  time: {
			tooltipFormat: 'YYYY-MM-DD HH:mm:ss',
			unit: 'minute',
			displayFormats: {
			  minute: 'YYYY-MM-DD HH:mm',
			},
		  },
		  title: {
			display: true,
			text: 'Date and Time',
		  },
		},
	  },
	},
  });
  
  
  
  
}


function getRandomColor() {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
  }

function get_history(patient ,tab) {
	// alert(tab)
	
	let tbldata = []
	let lab_data = []
	
	frappe.call({
        method: "his.dashboard_and_history.p_history.get_p_histy", //dotted path to server method
        args : {"patient" : patient},
        callback: function(r) {
           let columns =  r.message[0][tab]
		   let data = r.message[1][tab]
			console.log(data)
		   if(tab == "labs"){
			// alert()
			data.forEach(element => {
				frappe.db.get_doc("Lab Result" , element.name).then( r => {
					if(r.template == "CBC"){
						lab_data.push({"date": r.date , "practitioner": r.practitioner, "test": "CBC"})
 
					}
					
					r.normal_test_items.forEach(result => {

						lab_data.push({"date": r.date , "practitioner": r.practitioner, "test": result.test ,"lab_test_name":result.lab_test_name , "lab_test_event" : result.lab_test_event , "result_value" : result.result_value, "normal_range" : result.normal_range})
 
					})
				})
				
			});
			setTimeout(() => {
			
				columns = [{title : "Date" , field : "date"},{title : "Practitioner" , field : "practitioner"},{title : "Test" , field : "test"} , {title : "Test Name" , field : "lab_test_name"} ,  {title : "Event" , field : "lab_test_event"} , {title : "Result" , field : "result_value"}, {title: "Normal Range", field: "normal_range"}  ]
				setup_datatable(columns , lab_data , "date" , tab)
			   }, 1000);
		   }
		
			else{
			if(columns){
			
				setup_datatable(columns , data , "date", tab)
			}
			else{
				
				setup_datatable([] , [] , "date", tab)

			}
		}
        }})



// 	frappe.call({
// 		method: "his.api.vitals.get_vital", //dotted path to server method
// 		args :{ "patient": patient
// 			},
// 		callback: function(r) {
			
// 			tbldata = r.message
	
   

			
		
// 		 let me = this
// 		//  let fields = frappe.get_meta("Sales Order").fields
// 			let columns = [
// 			// {title:"ID", field:"name"},
// 			// {title:"Patient", field:"customer"},
// 			{title:"Date / Time", field:"modified"},
// 			{title:"Temperature", field:"temperature"},
// 			{title:"Pulse", field:"pulse"},
// 			{title:"BP", field:"bp"},
// 			{title:"Respiration", field:"respiratory_rate"},
// 			{title:"SpO2", field:"spo"},
// 			{title:"Height", field:"height"},
// 			{title:"Weight", field:"weight"},
// 			{title:"BMI", field:"bmi"},
// 			{title:"Nurse", field:"owner"},
			
// 			// {title:"Action", field:"action", hozAlign:"center" , formatter:"html"},
			
// 		 ]
	


//
// this.table = new Tabulator("#vitals", {
// 			// layout:"fitDataFill",
// 			layout:"fitDataStretch",
// 			//  layout:"fitColumns",
// 			// responsiveLayout:"collapse",
// 			 rowHeight:30, 
// 			//  selectable:true,
// 			//  dataTree:true,
// 			//  dataTreeStartExpanded:true,
// 			 groupStartOpen:false,
// 			 printAsHtml:true,
// 			//  printHeader:`<img src = '/private/files/WhatsApp Image 2022-10-20 at 6.19.02 PM.jpeg'>`,
// 			//  printFooter:"<h2>Example Table Footer<h2>",
// 			 // groupBy:"customer",
// 			 groupHeader:function(value, count, data, group){
// 				 //value - the value all members of this group share
// 				 //count - the number of rows in this group
// 				 //data - an array of all the row data objects in this group
// 				 //group - the group component for the group
// 			
// 				 return value + "<span style=' margin-left:0px;'>(" + count + "   )</span>";
// 			 },
// 			 groupToggleElement:"header",
// 			//  groupBy:groupbyD.length >0 ? groupbyD : "",
// 			 textDirection: frappe.utils.is_rtl() ? "rtl" : "ltr",
	 
// 			 columns: columns,
			 
		
			 
// 			 data: new_data
// 		 });
		 

// 		}
	
// });
}

function setup_datatable(columns , data , group , tabid){
	// console.log(data)

	// alert(tabid)
	let groupBy = []
	if(group){
		groupBy.push(group)
	}

	this.table = new Tabulator(`#${tabid}`, {
		// layout:"fitDataFill",
		layout:"fitDataFill",
		//  layout:"fitColumns",
		// responsiveLayout:"collapse",
		 rowHeight:30, 
		 placeholder:"No Data Available",
		//  selectable:true,
		//  dataTree:true,
		//  dataTreeStartExpanded:true,
		 groupStartOpen:false,
		 printAsHtml:true,
		//  printHeader:`<img src = '/private/files/WhatsApp Image 2022-10-20 at 6.19.02 PM.jpeg'>`,
		 printFooter:"<h2>Example Table Footer<h2>",
		 groupBy:groupBy,
		 groupHeader:function(value, count, data, group){
			 //value - the value all members of this group share
			 //count - the number of rows in this group
			 //data - an array of all the row data objects in this group
			 //group - the group component for the group
		
			 return value + "<span style=' margin-left:0px;'>(" + count + "   )</span>";
		 },
		 groupToggleElement:"header",
		//  groupBy:groupbyD.length >0 ? groupbyD : "",
		//  textDirection: frappe.utils.is_rtl() ? "rtl" : "ltr",
 
		 columns: columns,
		 
		 // [
		 // 	{formatter:"rowSelection", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, cellClick:function(e, cell){
		 // 		cell.getRow().toggleSelect();
		 // 	  }},
		 // 	{
		 // 		title:"Name", field:"name", width:200,
		 // 	},
		 // 	{title:"Group", field:"item_group", width:200},
		 // ],
		 // [
		 // {title:"Name", field:"name" , formatter:"link" , formatterParams:{
		 // 	labelField:"name",
		 // 	urlPrefix:`/app/${doct}/`,
			 
		 // }},
		 // {title:"Customer", field:"customer" },
		 // {title:"Total", field:"net_total" , bottomCalc:"sum",},
	 
		 // ],
		 
		 data: data
	 });
}

let transfer_patient_dialog = function(frm) {
	let inp_record = frappe.db.get_value("Inpatient Record" , {"patient" : frm.doc.patient , "status": "Admitted"},"name")
	inp_record.then( inp  => {
		frappe.db.get_doc("Inpatient Record" , inp.message.name)
		.then( ip => {
			
			let dialog = new frappe.ui.Dialog({

				title: 'Transfer Patient',
				width: 100,
				fields: [
					{fieldtype: 'Link', label: 'Leave From', fieldname: 'leave_from', options: 'Healthcare Service Unit', reqd: 1, read_only:1},
					{fieldtype: 'Link', label: 'Service Unit Type', fieldname: 'service_unit_type', options: 'Healthcare Service Unit Type'},
					{fieldtype: 'Link', label: 'Transfer To', fieldname: 'service_unit', options: 'Healthcare Service Unit', reqd: 1},
					{fieldtype: 'Datetime', label: 'Check In', fieldname: 'check_in', reqd: 1, default: frappe.datetime.now_datetime()}
				],
				primary_action_label: __('Transfer'),
				primary_action : function() {
					let service_unit = null;
					let check_in = dialog.get_value('check_in');
					let leave_from = null;
					
					if(dialog.get_value('leave_from')){
						leave_from = dialog.get_value('leave_from');
					}
					if(dialog.get_value('service_unit')){
						service_unit = dialog.get_value('service_unit');
					}
					if(check_in > frappe.datetime.now_datetime()){
						frappe.msgprint({
							title: __('Not Allowed'),
							message: __('Check-in time cannot be greater than the current time'),
							indicator: 'red'
						});
						return;
					}
					
					frappe.call({
						// doc: frm.doc,
						method: 'his.api.transfer_ip.transfer_ip',
						args:{
							'self' : ip.name,
							'service_unit': service_unit,
							'check_in': check_in,
							'leave_from': leave_from
						},
						callback: function(data) {
				
							frappe.db.get_value("Healthcare Service Unit" , service_unit , ["service_unit_type", 'name'])
							.then( room => {
								
								let ip_room = room.message.service_unit_type
								let bed = room.message.name

								frappe.db.set_value("Inpatient Record" , ip.name , {"bed" : bed ,"room" : ip_room })
								// frappe.db.set_value("Inpatient Record" , ip.name , "room" , ip_room)
								
								// ip.bed = service_unit
								// ip.save()
							})
							// if (!data.exc) {
							// 	frm.reload_doc();
							// }
						},
						freeze: true,
						freeze_message: __('Process Transfer')
					});
					// frm.refresh_fields();
					dialog.hide();
				}
			});
		
			dialog.fields_dict['leave_from'].get_query = function(){
				return {
					query : 'healthcare.healthcare.doctype.inpatient_record.inpatient_record.get_leave_from',
					filters: {docname:frm.doc.name}
				};
			};
			dialog.fields_dict['service_unit_type'].get_query = function(){
				return {
					filters: {
						'inpatient_occupancy': 1,
						'allow_appointments': 0
					}
				};
			};
			dialog.fields_dict['service_unit'].get_query = function(){
				return {
					filters: {
						'is_group': 0,
						'service_unit_type': dialog.get_value('service_unit_type'),
						'occupancy_status' : 'Vacant'
					}
				};
			};
		
			dialog.show();
		
			let not_left_service_unit = null;
			for (let inpatient_occupancy in ip.inpatient_occupancies) {
				if (ip.inpatient_occupancies) {
				
					not_left_service_unit = ip.inpatient_occupancies[inpatient_occupancy].service_unit;
				}
			}
		
			
			dialog.set_values({
				'leave_from': not_left_service_unit
			});

		})
	})
	



	
		

};


let refer = function(frm) {
	let inp_record = frappe.db.get_value("Inpatient Record" , {"patient" : frm.doc.patient , "status": "Admitted"},"name")
	inp_record.then( inp  => {
		frappe.db.get_doc("Inpatient Record" , inp.message.name)
		.then( ip => {
			// console.log(ip.name);
			let d = new frappe.ui.Dialog({
				title: 'Refer Doctor',
				fields: [
					{
						label: 'Consultant',
						fieldname: 'practitioner',
						fieldtype: 'Link',
						options : "Healthcare Practitioner",
						reqd : 1
					}
				
				],
				size: 'small', // small, large, extra-large 
				primary_action_label: 'Submit',
				primary_action(values) {
					d.hide();
					// console.log()
						// let inpatient_rec = frappe.get_doc('Inpatient Record', ip.name)
						// inpatient_rec.ref_practitioner = "Dr Mohamed Dahir Aden"
						// inpatient_rec.save()

						frappe.call({
							method: 'his.his.doctype.patient_history.patient_history.refer',
							args: {
								'inpatient_record': ip.name,
								'practitioner' : values.practitioner
								
								
							},
							callback: function(r) {
								
								console.log(r)
								// if (!r.exc) {
								// 	// code snippet
								// }
							}
						});
						
				}
				 
			});
			
			d.show();
			

		})
		
	})
}