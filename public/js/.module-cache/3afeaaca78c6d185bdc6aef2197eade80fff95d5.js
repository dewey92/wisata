//- List destinasi mau kemana aja
var Destinations = React.createClass({displayName: "Destinations",

	handleClick: function( obj ) {
		this.props.unList( obj );
	},

	render: function() {
		return (
			React.createElement("div", {id: "destinations"}, 
				React.createElement("h3", {className: "text-center"}, "My Destinations"), 
				React.createElement("div", {className: "image-container"}, 
					React.createElement("img", {src: "/images/Malang.jpg", className: "img img-responsive"})
				), 

				 this.props.children, 

				React.createElement("ul", {className: "list-unstyled"}, 
					 this.props.destList.map( function( obj, index ) {
						return (
							React.createElement("li", {key:  obj.props.place.id}, 
								 obj.props.place.name, " -", 
								React.createElement("span", {style:  { color: 'blue', cursor: 'pointer'}, 
									href: "#", title: "delete city", 
									onClick:  this.handleClick.bind( this, obj) }, " ga jadi kesini"
								), 
								React.createElement("p", {className: "hihi"}, "hihi")
							)
						)
					}, this) 
				)
			)
		);
	}
});

// Control search
var Control = React.createClass({displayName: "Control",

	handleSubmit: function( e ) {
		e.preventDefault();

		var value = React.findDOMNode( this.refs.inputCity ).value;
		this.props.handleSubmit( value );
	},

	render: function() {
		return(
			React.createElement("form", {action: "#", method: "get", onSubmit:  this.handleSubmit}, 
				React.createElement("div", {className: "form-group"}, 
					React.createElement("label", {htmlFor: "searchCity", className: "sr-only"}, "Search City"), 
					React.createElement("div", {className: "input-group"}, 
						React.createElement("input", {type: "text", id: "searchCity", className: "form-control", ref: "inputCity", placeholder: "Type city"}), 
						React.createElement("div", {className: "input-group-btn"}, 
							React.createElement("input", {className: "btn btn-danger", type: "submit", value: "Search"})
						)
					)
				)
			)
		);
	}
});

//- Total biaya perjalanan
var Total = React.createClass({displayName: "Total",
	//rendering
	render: function() {
		return (
			React.createElement("div", {id: "total"}, 
				React.createElement("h4", null, "Total ", React.createElement("span", {className: "pull-right"}, "Rp. ", this.props.totalCost, ",-"))
			)
		);
	}
});

// Main app
var App = React.createClass({displayName: "App",

	getInitialState: function () {
		return {
			destList: [],
			totalCost: 0,
		};
	},

	//- pas user nambah destinasi
	addDestination: function( elem ) {

		var dst_tmp = this.state.destList;
		var tc_tmp = this.state.totalCost;

		var price = ( elem.props.place.category == 'Culinary' ) ? 12000 : elem.props.place.day.friday.price;

		dst_tmp.push( elem );

		elem.setState({ selected: ! elem.state.selected });

		this.setState({
			destList: dst_tmp, // Nambahan tujuan wisata
			totalCost: tc_tmp + parseInt( price ) // Kalkulasi biaya total
		});

	},

	//- hapus destinasi
	deleteDestination: function( elem ) {

		//- pop up to ensure user to delete
		//- ## code ##

		// Cari array di destList
		for (var i = 0; i < this.state.destList.length; i++) {

			if ( this.state.destList[i].props.place.id === elem.props.place.id ) {
				index = i;
				break;
			}
		} // end for destList.length

		var price = ( elem.props.place.category == 'Culinary' ) ? 12000 : elem.props.place.day.friday.price;

		// delete arraynya
		this.state.destList.splice( index, 1 );
		this.setState({
			destList  : this.state.destList,
			totalCost : this.state.totalCost - price
		});

		// ubah state buttonnya
		elem.setState({
			selected : ! elem.state.selected 
		});

	},

	componentDidMount: function () {

		// Set toggle
		$('#toggle-dest-list').click( function() {
			$('#map-canvas').toggleClass('open');
			$('#wrap-dest-list').toggleClass('open');
		});

	},

	//- rendering
	render: function() {

		return(
			React.createElement("div", {id: "app"}, 
				React.createElement("div", {id: "control"}, 
					React.createElement("div", {className: "container"}, 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col-md-6 col-md-offset-3"}, 
								React.createElement(Control, null)
							)
						)
					)
				), 
				React.createElement("div", {id: "main-app"}, 
					React.createElement(MapComponent, {
						addList:  this.addDestination, 
						unList:  this.deleteDestination}), 

					React.createElement("aside", {id: "wrap-dest-list", className: "open"}, 
						React.createElement("div", {id: "dest-list"}, 
							React.createElement("div", {className: "container-fluid"}, 
								React.createElement(Destinations, {
									destList:  this.state.destList, 
									unList:  this.deleteDestination}, 

									React.createElement(Total, {totalCost:  this.state.totalCost})

								)
							)
						), 
						React.createElement("div", {id: "toggle-dest-list"}, 
							React.createElement("span", {className: "fa fa-chevron-right"}), 
							React.createElement("span", null, "My Trips")
						)
					)
				)
			)
		)
	}
});

// Inisialiasi
//var model = new DestModel('travel-app');

$(document).ready(function() {

	// Ambil dari URI
	var pathArray = window.location.pathname.split( '/' );
	if( pathArray[2] == '') pathArray[2] = 'Malang';

	$.get( "http://127.0.0.1:3000/place/" + pathArray[2], function( data ) {
		city       = data.city;
		places     = data.places;

		console.log( city );
		React.render(
			React.createElement(App, null),
			document.getElementById('wrap-app')
		);
	});

});