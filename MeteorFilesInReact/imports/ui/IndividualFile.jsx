import React from 'react';

import { UserFiles } from '../api/tasks.js';

const IndividualFile = React.createClass({

	propTypes: {
		file: React.PropTypes.object.isRequired
	},

	/*componentDidUpdate(){
		$('[data-toggle="tooltip"]').tooltip();
	},*/

	componentDidMount(){
		// Initialize tooltip
		$('[data-toggle="tooltip"]').tooltip();
	},

	removeFile(event){
		event.preventDefault();
		let fileId =  this.props.file._id;
		swal({
			title: "Are you sure?",
			text: "Do you want to remove this file",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, Delete!",
			cancelButtonText: "No, Cancel!",
			closeOnConfirm: false,
			closeOnCancel: true
		},
		function(isConfirm){
			if (isConfirm) {
				Meteor.call('removeFile', fileId, (err, res) => {
					if(err){
						// console.log(err, " <==")
						swal("Cancelled", "Error while deleting file: "+err.reason, "error");
					}
					else swal("Deleted!", "File has been deleted.", "success");
				})
			}
		});
	},

	renameFile(event){
		event.preventDefault();
		let validName = /[^a-zA-Z0-9 \.:\+()\-_%!&]/gi;
		let prompt    = window.prompt('New file name?', this.props.file.name);

		if (prompt) {
			prompt = prompt.replace(validName, '-');
			prompt.trim();
		}

		if (!_.isEmpty(prompt)) {
			Meteor.call('renameFileName', this.props.file._id, prompt, function (err, res) {
				if (err)
					console.log(err);
			});
		}
	},

	view(){
		Meteor.call('incDownload', this.props.file._id, (err) =>{
			if(err)
				console.log(err)
		})
	},

	render() {
		// console.log("file ->", this.props.file)
		let link = UserFiles.findOne({_id: this.props.file._id}).link();
		// console.log("=====", link)
		// console.log("file name length -", this.props.file.name.length)
		// console.log("isVideo -", this.props.file.isVideo)
		// console.log("isImage -", this.props.file.isImage)
		// console.log("isText -", this.props.file.isText)
		// console.log("isJSON -", this.props.file.isJSON)
		return(
			<tr>
				<td className="preview-circle">
					{
						this.props.file.isAudio ?
							<i className="fa fa-fw fa-music" aria-hidden="true"></i>
						:
							this.props.file.isVideo ?
								<i className="fa fa-video-camera" aria-hidden="true"></i>
						:
							this.props.file.isImage ?
								<img src={link} alt={this.props.file.name} />
						:
							this.props.file.isText ?
								<i className="fa fa-file-text-o" aria-hidden="true"></i>
						:
							this.props.file.isJSON || this.props.file.extension =='json' || this.props.file.extension =='js' ?
								<i className="fa fa-file-code-o" aria-hidden="true"></i>
						:
							this.props.file.extension =='doc' || this.props.file.extension =='docx' ?
								<i className="fa fa-file-word-o" aria-hidden="true"></i>
						:
							this.props.file.extension =='pdf' ?
								<i className="fa fa-file-pdf-o" aria-hidden="true"></i>
						:
							this.props.file.extension =='zip' ?
								<i className="fa fa-file-archive-o" aria-hidden="true"></i>
						:
							this.props.file.extension =='xls' || this.props.file.extension =='xlsx' ?
								<i className="fa fa-file-excel-o" aria-hidden="true"></i>
						:
							<i className="fa fa-file-o" aria-hidden="true"></i>
					}
				</td>

				<td>
					{
						this.props.file.name.length > 10 ?
							<div data-toggle="tooltip" title={this.props.file.name} data-placement="bottom">
								{this.props.file.name.substring(0,10)+'...'}
							</div>
						:
							this.props.file.name
					}
				</td>

				<td>{this.props.file.size * 0.001}</td>

				<td>{this.props.file.meta.downloads}</td>

				<td>{this.props.file.meta.created_at.toString().substring(4,25)}</td>

				<td>
					<button onClick={this.renameFile} data-toggle="tooltip" title="Click to rename file name" data-placement="bottom" className="btn btn-outline btn-primary btn-sm">
						<i className="fa fa-pencil-square-o" aria-hidden="true"></i>
					</button>
				</td>

				<td>
					<a href={link} data-toggle="tooltip" title="Click to view/download file" data-placement="bottom" className="btn btn-outline btn-primary btn-sm" target="_blank" onClick={this.view}>
						<i className="fa fa-eye" aria-hidden="true"></i>
					</a>
				</td>

				<td>
					<button onClick={this.removeFile} data-toggle="tooltip" title="Click to delete file" data-placement="bottom" className="btn btn-outline btn-danger btn-sm">
						<i className="fa fa-trash-o" aria-hidden="true"></i>
					</button>
				</td>
			</tr>
		);
	}
});

export default IndividualFile;