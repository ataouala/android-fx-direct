	var subtopics = [];
	var isConnected = false;


	$(document).bind("pagechange",function(e,data){
	    if(document.location.toString().indexOf('home.html')!=-1 && mesDevises){
            renderDevisesGrid();
	    	webSocketAgent.connect();
	    }
	    else if(document.location.toString().indexOf('settings.html')!=-1 && allDevises){
	    	webSocketAgent.disconnect();
	    	initSettings();
	    }
	    else if(document.location.toString().indexOf('home.html')==-1 && isConnected){
	    	webSocketAgent.disconnect();
	    }
	});


function renderDevisesGrid(){
    var i=0;
    var cellCount = parseInt(($(window).width()/160).toString());
    if(cellCount<2)
        cellCount = 2;
    else if(cellCount>5)
        cellCount = 5;
    var gridClass = 'ui-grid-a';
    if(cellCount==3){
        gridClass = 'ui-grid-b';
    }
    else if(cellCount==4){
        gridClass = 'ui-grid-c';
    }
    else if(cellCount==5){
        gridClass = 'ui-grid-d';
    }
    //alert(cellCount+'--'+gridClass);
    var cellNumber = 0;
    var cellTypeTab = ['a','b','c','d','e'];
    
    mesDevisesMap = {};
    var deviseGrid = '<div class="'+gridClass+'" align="center">';
    
    subtopics = [];
    $.each(mesDevises, function(index, value) {
           
           cellNumber++;
           
           mesDevisesMap[value.libelle.replace("/","")] = value;

           var prixAchat = (!isNaN(value.prixAchat+''))? Number(value.prixAchat).toFixed(4) : "0.0000";
           var prixAchat1 = prixAchat.substring(0, prixAchat.length-2);
           var prixAchat2 = prixAchat.substring(prixAchat.length-2, prixAchat.length);
           
           var prixVente = (!isNaN(value.prixVente+''))? Number(value.prixVente).toFixed(4) : "0.0000";
           var prixVente1 = prixVente.substring(0, prixVente.length-2);
           var prixVente2 = prixVente.substring(prixVente.length-2, prixVente.length);
           
           var idDivAchat = value.libelle.replace("/","")+"_achat";
           var idDivVente = value.libelle.replace("/","")+"_vente";
           
           //alert(idDivAchat);
           
           var colorAchat = (value.colorAchat)?value.colorAchat:upColor;
           var colorVente = (value.colorVente)?value.colorVente:upColor;
           
           //var cell = '<div class="ui-block-' + ((index%2==0)?'a':'b') + '" align="center" style="padding:2px;">';
           var cell = '<div class="ui-block-' + cellTypeTab[cellNumber-1] + '" align="center" style="padding:2px;">';
           
           cell += '<table cellpadding="0" cellspacing="2" style="border:1px solid #eaeaea;border-radius:6px;" width="100%">';	//#F7F7F7
           cell += '<tr><td colspan="2" align="center" style="padding:0px;margin:0px"><b><small>'+value.libelle+'</small></b></td></tr>';
           cell += '<tr align="center">';
           
           var roundCellStyle = 'background-color:#e6eff6;padding-left:4px;padding-right:4px;padding-top:20px;padding-bottom:20px;border-radius:6px;';
           
           //if(index==0 || (index%cellCount==0))
           
           cell += '<td style="padding:0px;margin:0px" width="50%"><div style="'+roundCellStyle+'">';
           cell += '<table cellpadding="0" cellspacing="0"><tr valign="middle"><td valign="bottom"><b><small><div style="padding-bottom:2px;" id="'+idDivVente+'_1">'+prixVente1+'</div></small></b></td>';
           cell += '<td valign="bottom"><b><big><div id="'+idDivVente+'_2" style="color:'+colorVente+';">'+prixVente2+'</div></big></b></td></tr></table></div></td>';
           
           cell += '<td style="padding:0px;margin:0px" width="50%"><div style="'+roundCellStyle+'">';
           cell += '<table cellpadding="0" cellspacing="0"><tr valign="middle"><td valign="bottom"><b><small><div style="padding-bottom:2px;" id="'+idDivAchat+'_1">'+prixAchat1+'</div></small></b></td>';
           cell += '<td valign="bottom"><b><big><div id="'+idDivAchat+'_2" style="color:'+colorAchat+';">'+prixAchat2+'</div></big></b></td></tr></table></div></td>';
           
           cell += '</tr>';
           cell += '<tr align="center"><td style="padding:0px;margin:0px;color:#c9c9c9;"><small>vente</small></td><td style="padding:0px;margin:0px;color:#c9c9c9;"><small>achat</small></td></tr>';
           cell += '</table>';
           
           cell += '</div>';
           
           deviseGrid += cell;
           subtopics[i] = value.id+"";
           i++;
           if(cellNumber==cellCount)
           cellNumber = 0;
           });
    deviseGrid += '</div>';
    document.getElementById('devisesList').innerHTML = deviseGrid;
}





	var webSocketAgent = {
			socket: null,
			'connect': function() {
				//alert(subtopics);
				var request = {
						url: pushApiUrl,
						logLevel : 'info',
						transport: 'websocket', /* websocket, jsonp, long-polling, polling, streaming */
						fallbackTransport: 'jsonp',
						attachHeadersAsQueryString: true,
						headers: {'subtopics': subtopics}
						//headers: {'subtopics': ['EURMAD']}
				};
				request.onOpen = function(response) {
					console.log('Connected to realtime endpoint using ' + response.transport);
				};
				request.onReconnect = function(response) {
					console.log('Reconnecting to realtime endpoint');
				};
				request.onClose = function(response) {
					console.log('Disconnected from realtime endpoint');
				};
                request.onClientTimeout = function(request){
                    console.log('Realtime endpoint: ClientTimeout!!');
                    webSocketAgent.connect();
                };
				request.onMessage = function (response) {
					/**/
					var data = response.responseBody;
					//alert(data);
					
					if (data && data.length > 0) {
						//alert(' DATA --- '+data);
						var dataTab = data.split('PUSHMSG');
						for(var i=0; i<data.length; i++){
							
							var _data = dataTab[i];
							//alert(JSON.stringify(dataTab));
							if (_data && _data.length > 0 && _data.indexOf('{')!=-1) {
								
								try{
									var result = JSON.parse(_data);
									//alert(_data);
									//alert(result.tauxDataObject.rateAsk1['1M']);
									
				                    var idDivAchat1 = result.libelle+"_achat_1";
				                    var idDivAchat2 = result.libelle+"_achat_2";
				    	    		var idDivVente1 = result.libelle+"_vente_1";
				    	    		var idDivVente2 = result.libelle+"_vente_2";

                                    var oldAchat = 0;
                                    var oldVente = 0;
				    	    		try{
                                        oldAchat = Number(document.getElementById(idDivAchat1).innerText+document.getElementById(idDivAchat2).innerText);
                                        oldVente = Number(document.getElementById(idDivVente1).innerText+document.getElementById(idDivVente2).innerText);
                                    }
                                    catch(err){
                                        //alert(JSON.stringify(err));
                                    }

                                    calculDeviseValues(result);
                                     /*
                                    try{

                                    }
                                    catch(err){
                                        alert(JSON.stringify(err));
                                    }
                                       */
                                    //var achat = Number(result.prixAchat).toFixed(4);
				    	    		var achat = numeral(result.prixAchat).format('0.000000');
				    	    		var achat1 = achat.substring(0, achat.length-4);
				            		var achat2 = achat.substring(achat.length-4, achat.length-2);
				            		
				            		
				    	    		//var vente = Number(result.prixVente).toFixed(4);
				            		var vente = numeral(result.prixVente).format('0.000000');
				    	    		var vente1 = vente.substring(0, vente.length-4);
				            		var vente2 = vente.substring(vente.length-4, vente.length-2);
				    	    		
				    	    		var colorAchat = (achat>=oldAchat)?upColor:downColor;
				    	    		var colorVente = (vente>=oldVente)?upColor:downColor;
				    	    		
				    	    		var achatDiv1 = document.getElementById(idDivAchat1);
                                    if(achatDiv1 && achatDiv1!=null){
                                        achatDiv1.innerText = achat1;
                                        var achatDiv2 = document.getElementById(idDivAchat2);
                                        achatDiv2.style.color = colorAchat;
                                        achatDiv2.innerText = achat2;
                                    }
				    	    		
                                    var venteDiv1 = document.getElementById(idDivVente1);
				    	    		if(venteDiv1 && venteDiv1!=null){
                                        venteDiv1.innerText = vente1;
                                        var venteDiv2 = document.getElementById(idDivVente2);
                                        venteDiv2.style.color = colorVente;
                                        venteDiv2.innerText = vente2;
                                    }
				    	    		
				    	    		try{
										mesDevisesMap[result.libelle].prixAchat = result.prixAchat;
										mesDevisesMap[result.libelle].prixVente = result.prixVente;
										mesDevisesMap[result.libelle].colorAchat = colorAchat;
										mesDevisesMap[result.libelle].colorVente = colorVente;
										mesDevisesMap[result.libelle].prixAchatReal = result.prixAchatReal;
										mesDevisesMap[result.libelle].prixVenteReal = result.prixVenteReal;
										mesDevisesMap[result.libelle].decote = result.decote;
										mesDevisesMap[result.libelle].surcote = result.surcote;
										mesDevisesMap[result.libelle].decoteMin = result.decoteMin;
										mesDevisesMap[result.libelle].decoteMax = result.decoteMax;
										mesDevisesMap[result.libelle].surcoteMin = result.surcoteMin;
										mesDevisesMap[result.libelle].surcoteMax = result.surcoteMax;
										
									}
									catch(err){
										//alert(JSON.stringify(err));
										//alert(err+' --- '+_data);
									}
								}
								catch(err){
									//alert(JSON.stringify(err)+'\n'+_data);
									//alert(err+' --- '+_data);
									//alert(err+' --- '+data);
								}
			                    
							}
							
						}
					}
				};
				this.socket = $.atmosphere.subscribe(request);
				isConnected = true;
			},
			'disconnect': function() {
				$.atmosphere.unsubscribe();
				this.socket = null;
				isConnected = false;
			}
	};
	
	
	
function gotoSettings(){	
	$.mobile.changePage("settings.html", {transition: 'flip'});
}	
	
function disconnect() {
    navigator.notification.confirm(
        'Voulez-vous vraiment vous deconnecter?',  // message
        disconnectConfirm,              // callback to invoke with index of button pressed
        'Deconnexion',            // title
        ['Oui','Annuler']          // buttonLabels
    );
}

function disconnectConfirm(button) {
    if(button==1){
    	webSocketAgent.disconnect();
    	window.localStorage["autoConnect"] = 0;
    	$.mobile.changePage("index.html", {transition: 'slidefade'});
    };
}

//$( window ).on( "orientationchange", function( event ) {
$( window ).on( "resize", function( event ) {
				//alert('reee');
               if(document.location.toString().indexOf('home.html')!=-1 && mesDevises){
                    //webSocketAgent.disconnect();
                    renderDevisesGrid();
                    //webSocketAgent.connect();
               }
});

