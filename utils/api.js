'use strict';
var HOST_URI = 'https://api.500px.com/v1/';

var PHOTOS = 'photos';

var CKEY = 'pd67OURWTmXMy6X1E3DL5jmr9aBAZ9VLjZp4jLvz';

function _getPhotos(){
  return HOST_URI + PHOTOS;
}

function _getConsumerKey(){
  return CKEY;
}

module.exports = {
  getPhotos: _getPhotos,
  getConsumerKey: _getConsumerKey
};