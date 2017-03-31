import {ReactMeteorData} from 'meteor/react-meteor-data';
import React from 'react';
import {Meteor} from 'meteor/meteor';
import IndividualFile from './IndividualFile.jsx';
import {_} from 'meteor/underscore';

import { UserFiles } from '../api/tasks.js';

const App = React.createClass({
	mixins: [ReactMeteorData],
	getInitialState(){
		return {
			uploading: [],
			progress: 0,
			inProgress: false
		}
	},

	/*componentDidUpdate(){
		$('[data-toggle="tooltip"]').tooltip();
	},*/

	componentDidMount(){
		// Initialize tooltip
		$('[data-toggle="tooltip"]').tooltip();
	},

	getMeteorData() {
		var handle = Meteor.subscribe('files');
		return {
			docsReadyYet: handle.ready(),
			docs: UserFiles.find().fetch(), // Collection is UserFiles
		};
	},

	uploadIt(e){
		e.preventDefault();

		let self = this;

		if (e.currentTarget.files && e.currentTarget.files[0]) {
			// We upload only one file, in case
			// there was multiple files selected
			var file = e.currentTarget.files[0];

			if (file) {
				let uploadInstance = UserFiles.insert({
					file: file,
					meta: {
						created_at: new Date(),
						downloads: 0
					},
					streams: 'dynamic',
					chunkSize: 'dynamic',
					allowWebWorkers: true // If you see issues with uploads, change this to false
				}, false);

				self.setState({
					uploading: uploadInstance, // Keep track of this instance to use below
					inProgress: true // Show the progress bar now
				});

				// These are the event functions, don't need most of them, it shows where we are in the process
				uploadInstance.on('start', function () {
					console.log('Starting');
				});

				uploadInstance.on('end', function (error, fileObj) {
					console.log('On end File Object: ', fileObj);
				});

				uploadInstance.on('uploaded', function (error, fileObj) {
					console.log('uploaded: ', fileObj);

					// Remove the filename from the upload box
					self.refs['fileinput'].value = '';

					// Reset our state for the next file
					self.setState({
						uploading: [],
						progress: 0,
						inProgress: false
					});
				});

				uploadInstance.on('error', function (error, fileObj) {
					console.log('Error during upload: ' + error);
				});

				uploadInstance.on('progress', function (progress, fileObj) {
					console.log('Upload Percentage: ' + progress);
					// Update our progress bar
					self.setState({
						progress: progress
					})
				});

				uploadInstance.start(); // Must manually start the upload
			}
		}
	},

	// This is our progress bar, bootstrap styled
	// Remove this function if not needed
	showUploads() {
		// console.log('**********************************', this.state.uploading);

		if (!_.isEmpty(this.state.uploading)) {
			return(
				<div>
				<br />
					{this.state.uploading.file.name}
		
					<div className="progress progress-bar-default">
						<div style={{width: this.state.progress + '%'}} aria-valuemax="100" aria-valuemin="0" aria-valuenow={this.state.progress || 0} role="progressbar" className="progress-bar">
							<span className="sr-only">{this.state.progress}% Complete (success)</span>
							<span>{this.state.progress}%</span>
						</div>
					</div>
				</div>
			);
		}
	},

	fileUpload(event){
		event.preventDefault();
		$('#fileinput').click();
	},

	render() {
		if (this.data.docsReadyYet) {
			// console.log("-----", this.data.docs.length)
			return(
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<h1>Upload New File</h1>
							<input type="file" className="invisible" id="fileinput" ref="fileinput" onChange={this.uploadIt} />
							<div data-toggle="tooltip" title="Click to upload file" data-placement="bottom" className="fake-upload" id="fakeUpload" onClick={this.fileUpload} disabled={this.state.inProgress}>
								<i className="fa fa-cloud-upload" id="file-uploading"></i>
								<h4>UPLOAD A FILE</h4>
							</div><br />
							{this.showUploads()}<br />
						</div>
					</div>

					<h1>Uploaded Files List</h1>
					<br />
					{
						this.data.docs.length > 0 ?
							<div className="table-container">
								<table className="table">
									<thead className="thead-inverse">
										<tr>
											<th>Preview</th>
											<th>File Name</th>
											<th>Size (in Kb)</th>
											<th>Views/Downloads</th>
											<th>Upload Date</th>
											<th>Rename</th>
											<th>View/Download</th>
											<th>Delete</th>
										</tr>
									</thead>
									<tbody>
										{
											this.data.docs.map((aFile) =>{
												// let link = UserFiles.findOne({_id: aFile._id}).link();
												// console.log("*********", link)
												return(
													<IndividualFile key={aFile._id} file={aFile} />
												)
											})
										}
									</tbody>
								</table>
							</div>
						:
							<div className="col-md-3 col-md-offset-5"><h5>No Files to Display</h5></div>
					}
				</div>
			);
		}
		else return <div>Loading...</div>
	}
});

export default App;