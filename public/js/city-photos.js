var CityPhotos = React.createClass({

	getInitialState: function() {
		return {
			photos : [] 
		};
	},

	componentDidMount: function() {
		$.get('http://thecatapi.com/api/images/get?format=html&results_per_page=20', function( data ) {
			
			console.log(data);
			this.setState({
				photo : data
			});

		}.bind( this ));
	},

	render: function() {

		var photoList = this.state.photos.map(function( photo ) {
			return (
				<div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
					<div className="thumbnail">
						{ photo }
						<div className="caption">
							<h3>Title</h3>
							<p>
								Ini kucing unyu
							</p>
							<p>
								<a href="#" className="btn btn-primary">Action</a>
								<a href="#" className="btn btn-default">Action</a>
							</p>
						</div>
					</div>
				</div>
			);
		});

		return (
			<div className="row">{ photoList }</div>
		);
	}

});

React.render( <CityPhotos />, document.getElementById('city-photos') );