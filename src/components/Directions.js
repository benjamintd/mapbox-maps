import React, { Component } from 'react';
import {connect} from 'react-redux';
import Geocoder from './Geocoder';
import PlaceName from './PlaceName';
import CloseButton from './CloseButton';
import RoutePanel from './RoutePanel';
import ModalityButtons from './ModalityButtons';
import MyLocation from './MyLocation';
import swapDirectionsIcon from '../assets/swapDirections.svg';
import {triggerMapUpdate, setDirectionsLocation, setStateValue} from '../actions/index';

class Directions extends Component {
  render() {
    return (
      <div id='directions'>

        <div className={this.styles.directions}>

          <CloseButton
            large={true}
            color='color-lighten50'
            onClick={() => this.exitDirections()}
          />
          <ModalityButtons
            modality={this.props.modality}
            onSetModality={(modality) => {
              this.props.setModality(modality);
              this.props.setRoute(null);
              this.props.setStateValue('routeStatus', 'idle');
              this.props.triggerMapUpdate();
            }}
          />

          <div id='directionsFromTo' className='flex-parent flex-parent--row flex-parent--center-cross'>

            <div
              className='flex-child absolute left pl12 w42 h-full flex-parent flex-parent--center-cross flex-parent--center-main'
              onClick={() => this.swapDirections()}
            >
              <img src={swapDirectionsIcon} alt='swap directions'/>
            </div>

            <div className='flex-child w-full h-full'>
              <div className={this.styles.row}>
                {
                  this.props.directionsFrom
                  ?
                  <div className={this.styles.placeName}>
                    <PlaceName location={this.props.directionsFrom} colors='light'/>
                  </div>
                  :
                  <Geocoder
                    onSelect={this.setDirectionsLocation('from')}
                    searchString={this.props.directionsFromString}
                    writeSearch={(value) => this.props.writeSearchFrom(value)}
                    resultsClass={'mt48 ' + this.styles.results}
                    inputClass={this.styles.input}
                  />
                }
                <CloseButton
                  onClick={() => this.resetSearch('from')}
                  color='color-lighten50'
                />
              </div>

              <div className={this.styles.row}>
                {
                  this.props.directionsTo
                  ?
                  <div className={this.styles.placeName}>
                    <PlaceName location={this.props.directionsTo} colors='light'/>
                  </div>
                  :
                  <Geocoder
                    onSelect={this.setDirectionsLocation('to')}
                    searchString={this.props.directionsToString}
                    writeSearch={(value) => this.props.writeSearchTo(value)}
                    resultsClass={'mt6 ' + this.styles.results}
                    inputClass={this.styles.input}
                  />
                }
                <CloseButton
                  onClick={() => this.resetSearch('to')}
                  color='color-lighten50'
                />
              </div>

            </div>
          </div>
        </div>

        {
          this.showUserLocation()
          ?
          <MyLocation
            onClick={() => this.setUserLocationDirections()}
            userLocation={this.props.userLocation}
          />
          :
          null
        }

        {
          (this.props.route || this.props.routeStatus !== 'idle')
          ?
          <RoutePanel/>
          :
          null
        }
      </div>
    );
  }

  setDirectionsLocation(kind) {
    return (location) => {
      this.props.setDirectionsLocation(kind, location);
      if (kind === 'to') this.props.writeSearchTo('');
      if (kind === 'from') this.props.writeSearchFrom('');
      this.props.triggerMapUpdate('repan');
    }
  }

  setUserLocationDirections() {
    if (!this.props.directionsFrom) this.props.setDirectionsLocation('from', this.props.userLocation);
    else if (!this.props.directionsTo) this.props.setDirectionsLocation('to', this.props.userLocation);
    this.props.triggerMapUpdate('repan');
  }

  resetSearch(kind) {
    if (kind === 'from') this.props.writeSearchFrom('');
    if (kind === 'to') this.props.writeSearchTo('');
    this.props.setDirectionsLocation(kind, null);
    this.props.setRoute(null);
    this.props.setStateValue('routeStatus', 'idle');
    this.props.setStateValue('searchLocation', null);
    this.props.triggerMapUpdate();
  }

  exitDirections() {
    this.props.setMode('search');
    this.props.setDirectionsLocation('from', null);
    this.props.setDirectionsLocation('to', null);
    this.props.writeSearchFrom('');
    this.props.writeSearchTo('');
    this.props.setRoute(null);
    this.props.setStateValue('routeStatus', 'idle');
    this.props.triggerMapUpdate();
  }

  showUserLocation() {
    return (
      (
        (!this.props.directionsFrom && !this.props.directionsTo)
        || (!this.props.directionsTo && this.props.directionsFrom && this.props.directionsFrom.place_name !== 'My Location')
        || (!this.props.directionsFrom && this.props.directionsTo && this.props.directionsTo.place_name !== 'My Location')
      )
      && (!this.props.directionsFromString)
      && (!this.props.directionsToString)
      && this.props.userLocation
    )
  }

  swapDirections() {
    this.props.setDirectionsLocation('from', this.props.directionsTo);
    this.props.setDirectionsLocation('to', this.props.directionsFrom);
    this.props.setRoute(null);
    this.props.setStateValue('routeStatus', 'idle');
    this.props.triggerMapUpdate('repan');
  }

  get styles() {
    return {
      directions: 'relative my-bg-blue w-full w420-mm shadow-darken25 flex-parent flex-parent--column',
      input: 'input directions-input border--transparent color-white px48 h42 w-full',
      results: 'absolute w-full bg-white shadow-darken5 border-darken10',
      placeName: 'txt-truncate color-white px48 h42 flex-parent flex-parent--row flex-parent--center-cross',
      row: 'flex-child hmin42 w-full w420-mm flex-parent flex-parent--row',
      userLocation: 'relative bg-white h42 flex-parent flex-parent--center-cross pr12 cursor-pointer w-full w420-mm'
    }
  }
}

Directions.propTypes = {
  directionsFromString: React.PropTypes.string,
  directionsFrom: React.PropTypes.object,
  directionsToString: React.PropTypes.string,
  directionsTo: React.PropTypes.object,
  setDirectionsLocation: React.PropTypes.func,
  triggerMapUpdate: React.PropTypes.func,
  setMode: React.PropTypes.func,
  setModality: React.PropTypes.func,
  writeSearchFrom: React.PropTypes.func,
  writeSearchTo: React.PropTypes.func,
  route: React.PropTypes.object,
  routeStatus: React.PropTypes.string,
  setRoute: React.PropTypes.func,
  setStateValue: React.PropTypes.func,
  modality: React.PropTypes.string,
  userLocation: React.PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    directionsFrom: state.directionsFrom,
    directionsTo: state.directionsTo,
    directionsFromString: state.directionsFromString,
    directionsToString: state.directionsToString,
    modality: state.modality,
    userLocation: state.userLocation,
    route: state.route,
    routeStatus: state.routeStatus
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDirectionsLocation: (kind, location) => dispatch(setDirectionsLocation(kind, location)),
    triggerMapUpdate: (repan) => dispatch(triggerMapUpdate(repan)),
    setMode: (mode) => dispatch(setStateValue('mode', mode)),
    setModality: (modality) => dispatch(setStateValue('modality', modality)),
    writeSearchFrom: (value) => dispatch(setStateValue('directionsFromString', value)),
    writeSearchTo: (value) => dispatch(setStateValue('directionsToString', value)),
    setRoute: (route) => dispatch(setStateValue('route', route)),
    setStateValue: (k, v) => dispatch(setStateValue(k, v))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Directions);
