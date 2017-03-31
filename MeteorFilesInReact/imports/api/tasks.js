import { FilesCollection } from 'meteor/ostrio:files';

if (Meteor.isServer) {
  let Dropbox = Npm.require('dropbox');
  let Request = Npm.require('request');
  let fs = Npm.require('fs');
  let bound = Meteor.bindEnvironment(function(callback) {
    return callback();
  });
  /*let client = new Dropbox.Client({
    key: 'zps0ocit35dtvg3',
    secret: 'p1l15w1q88m2g6l',
    token: '_ZY56B9rb5AAAAAAAAAACcnQiI6es1DOAF7kulIZMdLq76_ADGQK2mfe4fEaFyS_'
  });*/
}

const isImageMime = (mimeType) => mimeType.indexOf('image') === 0;

export const UserFiles = new FilesCollection({
  collectionName: 'userFiles',
  allowClientCode: true,
  throttle: false,
  debug: true,
  downloadRoute: '/files/',
  storagePath: 'assets/',
  onAfterUpload(file) {
    console.log("onAfterUpload ->", file)
    const self = this;
    const { Magic, MAGIC_MIME_TYPE } = require('mmmagic');
    const magic = new Magic(MAGIC_MIME_TYPE);
    magic.detectFile(file.path, Meteor.bindEnvironment((err, mimetype) => {
      if (err || !~file.type.indexOf('image')) {
        // is not a real image
        console.log('onAfterUpload, not an image: ', file.path);
        // console.log('deleted', file.path);
        // self.remove(file._id);
      }
    }));
  }
});

UserFiles.collection.attachSchema(new SimpleSchema(UserFiles.schema));


Meteor.methods({
  'removeFile'(id){
    UserFiles.remove({_id: id})
  },
  'renameFileName'(id, fileName){
  	// console.log("------", fileName, id)
  	UserFiles.update({_id: id}, {$set: {name: fileName}})
  },
  'incDownload'(id){
    UserFiles.update({_id: id}, {$inc: {'meta.downloads': 1}});
  }
});