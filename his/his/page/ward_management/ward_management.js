
frappe.pages['ward-management'].on_page_load = function(wrapper) {
	new WardManagement(wrapper)
}


WardManagement = Class.extend(
	{
		init:function(wrapper){
			this.page = frappe.ui.make_app_page({
				parent : wrapper,
				title: "Ward Management",
				single_column : true
			});
			$('.page-head').hide()
			this.make()
			
			// this.make_grouping_btn()
			// this.grouping_cols()
		},
		make:function(){
			let me = this
   		
			$(frappe.render_template("ward_management", me)).appendTo(me.page.main)
			let room_list = ``
			let ul_nav = $('#nav_ul').empty()
			let room_sel =''
			let room = ''
			frappe.db.get_list('Healthcare Service Unit Type',
			 {
				fields: ['name','patient'],
				filters: {
					type: "IPD",
					disabled: 0
				},
				limit:1000
			}).then(records => {
				records.forEach( (element  , index)=> {
					if(index == 0){
						room = element.name
					}
					room_list +=  `
					<li>
					<span class="bed_icon__"><i class="fa fa-bed"></i></span>
					<a   class = "room_selec" id = "${element.name}">${element.name}</a>
				  </li>
					`
				})
				$(room_list).appendTo(nav_ul)
				get_beds(room)
				
				room_sel = $(".room_selec")
				room_sel.click( e => {
					let room_name = e.target.id
					get_beds(room_name)
					// get_patient(room_name)
					// 
					// alert()
					// console.log("this is ",e.target.id)
	
				
				
	
					
				})

			})
			
			
			




		
		}
	})

	
	// function get_patient(room_name){
	// 	frappe.db.get_list('Inpatient Record', {
	// 		fields: ['patient_name', 'bed'],
	// 		filters: {
	// 			room: room_name,
				
	// 		}
	// 	}).then(records => {
	// 		// console.log(records);
	// 		let bed = ``
	// 		let sts_bg_class= "card_one_occupied"
	// 		btn=``
	// 		records.forEach(element => {
	// 			if(element.occupancy_status === "Occupied"){
	// 				sts_bg_class = "card_one_occupied"
	// 				btn = ''
	// 			}
	// 			else if(element.occupancy_status === "Vacant"){
	// 				sts_bg_class = "card_one_vocant"
	// 				btn =''
	// 			}

	// 			else{
	// 				sts_bg_class = "card_one_cleaning"
	// 			}
	// 			if(element.occupancy_status === "In Cleaning"){
	// 				// alert(element.name)
	// 					// sts_bg_class = "card_one_vocant_single"
	// 					btn = `<button class="btn btn-warning mb-3" style="color:white" onclick = "ready('${element.name}')"> Ready </button>`
	// 				}
	// 			bed += `
	// 			<div class="${sts_bg_class}">
	// 			<div class="bed_icon">
	// 			  <span><i class="fa fa-bed"></i></span>
	// 			</div>
	// 			<span class="bed_tex">${element.occupancy_status}</span>
	// 			<span class="bed_tex">${element.patient_name}</span>
	// 			<span class="bed_tex">${element.bed}</span>
				
		
	// 			${btn}
	// 		  </div>
	// 			`

	// 		});
	// 		// console.log(bed)
	// 		let beds = `
			
	// 		<div class="room1 mobile">
	// 		<h1>${room_name}</h1>
	// 		<div class="my_main_cards">
			
	  
			 
	// 		${bed}
			
	  
	// 		</div>
	// 	  </div>
	// 		`
			
	// 		// Append beds to rooms section
	// 		$('#room').empty()
	// 		$(beds).appendTo('#room')

	// 	})

	// }
	function get_beds(room_name){
		frappe.db.get_list('Healthcare Service Unit', {
			fields: ['name', 'occupancy_status','patient'],
			filters: {
				service_unit_type: room_name,
				disabled: 0
			},
			limit: 1000
		}).then(records => {
			// console.log(records);
			let bed = ``
			let sts_bg_class= "card_one_occupied"
			btn=``

			
			records.forEach(element => {
				if(element.occupancy_status === "Occupied"){
					
					

		
							sts_bg_class = "card_one_occupied"
					btn = ''

			

				
					// get_patient(room_name)
					
				
				}
				else if(element.occupancy_status === "Vacant"){
					sts_bg_class = "card_one_vocant"
					btn =''
				}

				else{
					sts_bg_class = "card_one_cleaning"
				}
				if(element.occupancy_status === "In Cleaning"){
					// alert(element.name)
						// sts_bg_class = "card_one_vocant_single"
						btn = `<button class="btn btn-warning mb-3" style="color:white" onclick = "ready('${element.name}')"> Ready </button>`
					}

				bed += `
				<div class="${sts_bg_class}">
				<div class="bed_icon">
				  <span><i class="fa fa-bed"></i></span>
				</div>
				
				<span class="bed_tex">${element.name}</span>
				<span class="bed_tex">${element.occupancy_status}</span>
				<span class="bed_tex">${element.patient || ""}</span>
				${btn}
			  </div>
				`
			});
			// console.log(bed)
			let beds = `
			
			<div class="room1 mobile">
			<h1>${room_name}</h1>
			<div class="my_main_cards">
			
	  
			 
			${bed}
			
	  
			</div>
		  </div>
			`
			
			// Append beds to rooms section
			$('#room').empty()
			$(beds).appendTo('#room')

		})

	}
	function ready(bed){
		           frappe.call({
                    method: "his.api.ward_management.ready", //dotted path to server method
                    args: {
                        "bed" : bed      
                    },
                    callback: function(r) {
                  // frappe.msgprint(r)
             			    frappe.utils.play_sound("submit")
                            frappe.show_alert({
                                message:__('Bed: '+bed+ " Vacanted Successfully!!"),
                                indicator:'green',
                                
                            }, 5);
                            location.reload();
                        
                    }
        });
	}
