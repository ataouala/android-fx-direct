//var pushApiUrl = 'http://192.168.1.17:8080/atmosphere';
//var dataApiUrl = 'http://192.168.1.17:8080/api';

var pushApiUrl = 'https://www.bmcefxdirect.com/mobile/atmosphere';
var dataApiUrl = 'https://www.bmcefxdirect.com/mobile/api';


var upColor = '#5ca725';
var downColor = '#c42424';


var currentUser;
var client;
var mesDevises;
var hasCross;
var allDevises;
var mesDevisesMap;


var GROUP_CLIENT_LIBELLE = "Clients";


var _mesDevises = [{"id":"1","prixAchat":"4.799414745715597","prixVente":"6.454742583976008","libelle":"EUR\/MAD","actif":true},{"id":"2","prixAchat":"5.591001237041848","prixVente":"8.041975838674231","libelle":"USD\/MAD","actif":true},{"id":"3","prixAchat":"3.5853530156535074","prixVente":"5.235137678890419","libelle":"GBP\/MAD","actif":true},{"id":"4","prixAchat":"836.2910657657569","prixVente":"828.0175590966508","libelle":"JPY\/MAD","actif":true},{"id":"5","prixAchat":"0.0648558588528842","prixVente":"2.141082319768402","libelle":"CHF\/MAD","actif":true},{"id":"6","prixAchat":"5.500623367863325","prixVente":"7.776352908876519","libelle":"CAD\/MAD","actif":true},{"id":"7","prixAchat":"440.35652552112276","prixVente":"200.0737053867176","libelle":"DKK\/MAD","actif":true},{"id":"8","prixAchat":"72.65639531621012","prixVente":"877.2221200419649","libelle":"NOK\/MAD","actif":true},{"id":"9","prixAchat":"399.0547537329225","prixVente":"284.9130567394744","libelle":"SEK\/MAD","actif":true},{"id":"10","prixAchat":"9.466424492399803","prixVente":"5.946226281360628","libelle":"SAR\/MAD","actif":true},{"id":"17","prixAchat":"6.2957750147881635","prixVente":"3.523856488661913","libelle":"EUR\/USD","actif":true},{"id":"22","prixAchat":"8.519990061585023","prixVente":"9.81927989413164","libelle":"EUR\/DKK","actif":true}];
var _allDevises = [{"id":1,"libelle":"EUR\/MAD","coursReference":11.103},{"id":2,"libelle":"USD\/MAD","coursReference":8.65675},{"id":3,"libelle":"GBP\/MAD","coursReference":13.876},{"id":4,"libelle":"JPY\/MAD","coursReference":11.095},{"id":5,"libelle":"CHF\/MAD","coursReference":9.17175},{"id":6,"libelle":"CAD\/MAD","coursReference":8.86015},{"id":7,"libelle":"DKK\/MAD","coursReference":148.695},{"id":8,"libelle":"NOK\/MAD","coursReference":150.54},{"id":9,"libelle":"SEK\/MAD","coursReference":131.8},{"id":10,"libelle":"SAR\/MAD","coursReference":2.3084},{"id":11,"libelle":"KWD\/MAD","coursReference":30.785},{"id":12,"libelle":"AED\/MAD","coursReference":2.3334},{"id":13,"libelle":"TND\/MAD","coursReference":5.85},{"id":14,"libelle":"DZD\/MAD","coursReference":1.13},{"id":15,"libelle":"LYD\/MAD","coursReference":6.68},{"id":16,"libelle":"MRO\/MAD","coursReference":2.99},{"id":17,"libelle":"EUR\/USD","coursReference":0.0},{"id":18,"libelle":"EUR\/GBP","coursReference":0.84},{"id":19,"libelle":"EUR\/JPY","coursReference":120.56},{"id":20,"libelle":"EUR\/CHF","coursReference":1.22},{"id":21,"libelle":"EUR\/CAD","coursReference":1.3},{"id":22,"libelle":"EUR\/DKK","coursReference":7.46},{"id":23,"libelle":"EUR\/SEK","coursReference":8.37},{"id":24,"libelle":"EUR\/NOK","coursReference":7.48},{"id":25,"libelle":"USD\/JPY","coursReference":94.04},{"id":26,"libelle":"GBP\/USD","coursReference":1.52}];