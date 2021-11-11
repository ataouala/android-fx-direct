/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        deviceReady_handler();
        console.log('Received Event: ' + id);
    }
};

app.initialize();

  /*
$( document ).ready(function() {
    //$.support.cors = true;
    //document.addEventListener("deviceready", deviceReady, true);
    alert('rrrrrrr');
});
    */


function deviceReady_handler() {
    document.documentElement.style.webkitTouchCallout = "none";
    document.documentElement.style.webkitUserSelect = "none";
    document.addEventListener("backbutton", onBackKeyDown, false);
    $("#loginForm").on("submit",handleLogin);
    checkPreAuth();
}



function onBackKeyDown(){
    if(document.location.toString().indexOf('index.html')==-1){
        disconnect();
    }
    else{
        navigator.app.exitApp();
    }
}




function checkPreAuth() {
    var form = $("#loginForm");
    if(window.localStorage["username"] != undefined && window.localStorage["password"] != undefined && window.localStorage["autoConnect"] != undefined) {
        var autoConnect = Number(window.localStorage["autoConnect"]);
        if(autoConnect==1){
            $("#username", form).val(window.localStorage["username"]);
            $("#password", form).val(window.localStorage["password"]);
            handleLogin();
        }
        else if(window.localStorage["username"] != undefined){
            $("#username", form).val(window.localStorage["username"]);
        }
    }
}



function handleLogin() {
    var form = $("#loginForm");
    //disable the button so we can't resubmit while we wait
    $("#submitButton",form).attr("disabled","disabled");
    var u = $("#username", form).val();
    var p = $("#password", form).val();
    //$.mobile.changePage("home.html", {type: "post", transition: 'slidefade'});

    //console.log("click");
    if(u != '' && p!= '') {
        $.mobile.loading("show");

        $.post(dataApiUrl+"/client/login", {username:u,password:p}, "json")
            .done( function(res) {
                if(res.statut==1) {
                    //store
                    window.localStorage["username"] = u;
                    window.localStorage["password"] = p;
                    window.localStorage["autoConnect"] = 1;
                    mesDevises = res.mesdevises;
                    hasCross = res.hasCross;
                    allDevises = res.alldevises;
                    currentUser = res.user;
                    client = res.client;

                    $.each(mesDevises, function(index, value) {
                        calculDeviseValues(value);
                    });


                    $.mobile.changePage("home.html", {type: "post", transition: 'slidefade'});

                } else {
                    navigator.notification.alert(res.statut, function() {});
                }
                $.mobile.loading("hide");
                $("#submitButton").removeAttr("disabled");
            } )
            .fail( function(xhr, textStatus, errorThrown) {
                console.log("AUTH ERROR : ", JSON.stringify(xhr), JSON.stringify(textStatus), JSON.stringify(errorThrown));
                //console.log(xhr);
                //console.log(textStatus);
                //console.log(errorThrown);
                //console.log(JSON.stringify(xhr));
                //console.log(JSON.stringify(textStatus));
                //console.log(JSON.stringify(errorThrown));
                showServiceFailMsg();
            });




    }
    else {
        navigator.notification.alert("Vous devez entrer un login/mot de passe valide", function() {});
        $("#submitButton").removeAttr("disabled");
    }
    return false;
}





//function showServiceFailMsg(xhr, textStatus, errorThrown) {
function showServiceFailMsg() {
    navigator.notification.alert('Serveur inaccessible, veuillez verifier votre connexion internet', function() {});
    //navigator.notification.alert(" - "+textStatus+" \n - "+errorThrown+" \n - "+xhr.responseText+" \n - "+xhr.statusText+" \n - "+xhr.status+" \n - "+xhr.readyState, function() {});
    //navigator.notification.alert(" - "+JSON.stringify(err), function() {});
    $.mobile.loading("hide");
    $("#submitButton").removeAttr("disabled");
}




function calculDeviseValues(result){
    try{
        //alert(JSON.stringify(result) + " \n " + JSON.stringify(client));
        result.prixAchatReal = result.prixAchat;
        result.prixVenteReal = result.prixVente;
        // !!!!
        if(client.groupe.libelle==GROUP_CLIENT_LIBELLE){
            result.decote = result.decoteClient;
            result.surcote = result.surcoteClient;
        }

        //alert(result.libelle+" - "+result.prixAchat+" - "+result.prixVente+" - "+result.decote+" - "+result.surcote+" - "+client.remiseAchat+" - "+client.remiseVente);

        if(Number(result.id)<=16){
            result.prixAchat = result.prixAchatReal * (1.0 - result.decote / 1000.0) * (1 - client.remiseAchat / 1000.0) ;
            result.prixVente = result.prixVenteReal * (1.0 + result.surcote / 1000.0) * (1 + client.remiseVente / 1000.0) ;
        }
        if(Number(result.id)>16){
            result.prixAchat = result.prixAchatReal * (1.0 - result.decote / 1000.0) * (1 - client.remiseAchatCross / 1000.0) ;
            result.prixVente = result.prixVenteReal * (1.0 + result.surcote / 1000.0) * (1 + client.remiseVenteCross / 1000.0) ;
        }
        //calulTerme(result);
    }
    catch(err){
        //alert(JSON.stringify(err));
    }
}

