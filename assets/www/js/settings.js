function initSettings(){
	
	$('#devisesListSettings').append('<li data-role="list-divider" role="heading" data-theme="d">Couples devises MAD</div>');
	
	var crossHeader = false;
	var maxID = (hasCross)?30:16;
	
	$.each(allDevises, function(index, value) {
		
		if(Number(value.id)<=maxID){
			
			if(Number(value.id)>16 && !crossHeader){
				$('#devisesListSettings').append('<li data-role="list-divider" role="heading" data-theme="d">Couples devises internationaux</div>');
				crossHeader = true;
			}
			
			var selected = '';
			for(var i=0; i<mesDevises.length; i++){
				if(Number(mesDevises[i].id)==Number(value.id)){
					selected = 'checked="checked"';
					break;
				}
			}
			var line = '<li style="padding-left:5px;"><input type="checkbox" name="ch_'+index+'" id="ch_'+index+'" value="'+value.id+'" '+selected+' /><label for="ch_'+index+'">'+value.libelle+'</label></li>';
	    	$('#devisesListSettings').append(line);
		}
    });
	
	/*
	$('li').removeClass('ui-corner-bottom');
    $('ul')
        .addClass('ui-corner-top')
        .removeClass('ui-corner-all')
        .sortable({
            'containment': 'parent',
            'opacity': 0.6,
            update: function(event, ui) {
                alert("dropped");
            }
        });
    */
	
	$('#devisesListSettings').listview('refresh');
}


function exitSettings(){	
	$.mobile.changePage("home.html", {transition: 'flip'});
}

function saveSettings(){	
	/**/
	$.mobile.loading("show");
	var inputs = document.getElementsByTagName("input");
	var deviseIDs = [];
	for(var i=0; i<inputs.length; i++){
		var input = inputs[i];
		if(input.type=='checkbox' && input.checked && input.name.indexOf('ch_')!=-1){
			deviseIDs[deviseIDs.length] = Number(input.value);
		}
	}
	$.post(dataApiUrl+"/client/preference/update", {devisesId:deviseIDs+'',userId:currentUser.id}, "json")
	.done( function(res) { 
		if(res.statut==1) {
			mesDevises = res.mesdevises;
            $.mobile.loading("hide");
            $.mobile.changePage("home.html", {transition: 'flip'});
            
        } else {
        	navigator.notification.alert(res.message, function() {});
        }
	} )
    .fail( function(xhr, textStatus, errorThrown) {
    	showServiceFailMsg();
    });
    
	//---
	//$.mobile.changePage("home.html", {transition: 'flip'});
	//---
}