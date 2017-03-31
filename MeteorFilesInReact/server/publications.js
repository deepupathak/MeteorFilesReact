import { UserFiles } from '../imports/api/tasks.js';

Meteor.publish('files', function () {
	return UserFiles.find().cursor;
});

/*Meteor.publish('file', function (id) {
	return fileCollection.find({_id: id}).cursor;
});*/