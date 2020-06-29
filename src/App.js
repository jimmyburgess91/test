import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import './marker.css';
import { geolocated } from "react-geolocated";

const Marker = () => <div className="pin"></div>;

class EVChargingMap extends Component {
  static defaultProps = {
    //Default to Berlin
    center: {
      lat: 52.52,
      lng: 13.40
    },
    zoom: 15
  };

  constructor() {
    super();
    this.fetchMarkers = this.fetchMarkers.bind(this);
    this.state = {
      markers: [],
      loading: false
    };
  }

  componentDidMount() {
    if (this.state.loading) { return; }
    this.setState({loading: true});

    let latitude = this.props.center.lat;
    let longitude = this.props.center.lng;
    if (this.props.coords) {
      latitude = this.props.coords.latitude;
      longitude = this.props.coords.longitude;
    }
    this.fetchMarkers({
      center: {
        lat: () => {return latitude;},
        lng: () => {return longitude;}
      }
    });
  }

  fetchMarkers(map) {
    if (this.state.loading) { return; }
    this.setState({loading: true});
    axios.get('https://api.openchargemap.io/v3/poi/?output=json&countrycode=DE&maxresults=10&compact=true&verbose=false&latitude=' + map.center.lat() +  '&longitude=' + map.center.lng() + '&distance=10&distanceunit=KM')
      .then(res => {
        let newMarkers = [];
        res.data.map((location) => newMarkers.push(
          <Marker
            lat={location.AddressInfo.Latitude}
            lng={location.AddressInfo.Longitude}
          />
        ));
        this.setState({markers: newMarkers, loading: false});
        res.data.map((location) => console.log(location));
      })
  }

  render() {
    let loading;
    if (this.state.loading) {
      loading = 'Loading...';
    }
    return (
      <div>
        <h1>{loading}</h1>
        <div style={{ height: '100vh', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyD6T8zNeCCXnR0NhbSplOFvaHG6Jfa6X70' }}
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
            onDrag={this.fetchMarkers}
          >
            {this.state.markers}
          </GoogleMapReact>
        </div>
      </div>
    );
  }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(EVChargingMap);
