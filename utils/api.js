'use strict';
var HOST_URI = 'https://api.500px.com/v1/';

var PHOTOS = 'photos';
var SEARCH = '/search';
var USERS = '/users';
var SHOW_ID = '/show?id=';
var GALLERIES = '/galleries';


var CKEY = 'pd67OURWTmXMy6X1E3DL5jmr9aBAZ9VLjZp4jLvz';


function _getPhotos(){
  return HOST_URI + PHOTOS;
}

function _getPhoto(id){
  return HOST_URI + PHOTOS + '/' + id;
}

function _getConsumerKey(){
  return CKEY;
}

function _getSearch(){
  return HOST_URI + PHOTOS + SEARCH;
}

function _showUser(id){
  return HOST_URI + USERS + SHOW_ID + id;
}

function _getUserPhotos(id){
  return HOST_URI;
}



module.exports = {
  getPhotos: _getPhotos,
  getConsumerKey: _getConsumerKey,
  getPhoto: _getPhoto,
  getSearch: _getSearch,
  showUser: _showUser,
  getUserPhotos: _getUserPhotos
};