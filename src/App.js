import React, { Component } from 'react';
import GetRequest from './GetRequest.js';
import TripData from './TripData.js';
import EmptyTripData from './EmptyTripData.js';
import DataTable from './components/DataTable.js';
import FilterDropDown from './components/FilterDropDown.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.request = 
      new GetRequest('https://s3.amazonaws.com/isc-isc/trips_gdrive.csv');
    this.parseTrips = this.parseTrips.bind(this);
    this.initializeDataTable = this.initializeDataTable.bind(this);
    this.updateBrand = this.updateBrand.bind(this);
    this.updateRetailer = this.updateRetailer.bind(this);
    this.updateTripsToDisplay = this.updateTripsToDisplay.bind(this);
    this.updateScrollPos = this.updateScrollPos.bind(this);
    this.handleError = this.handleError.bind(this);

    this.state = {
      scrollPos: -1,
      tripsToDisplay: [],
      trips: [],
      selectedRetailer: 'All',
      selectedBrand: 'All',
      rendering: false,
      batchSize: 0,
      minIndex: 0,
      maxIndex: 0,
    };
  }

  componentDidMount() {
    const {
      request,
      parseTrips,
      sortTrips,
      initializeDataTable,
      handleError,
    } = this;

    request.init()
      .then(parseTrips)
      .then(sortTrips)
      .then(initializeDataTable)
      .catch(handleError);
  }

  componentDidUpdate() {
    const {
      verticalScrollBar,
    } = this;

    const {
      scrollPos,
    } = this.state;

    verticalScrollBar.valueAsNumber = scrollPos;
  }

  parseTrips(csvStr) {
    const rows = csvStr.split('\n');
    // - 1 because the .csv first row is header names
    const totalRows = rows.length - 1; 
    const tableHeaders = rows[0].split(',');
    
    const allBrands = new Set();
    const allRetailers = new Set();
    const allTrips = new Array(totalRows);
    const tripConfig = {};

    return new Promise((resolve, reject) => {
      (function parseNextTransaction(idx) {
        return new Promise((resolve2, reject2) => {
          const cells = rows[idx].split(',');

          tableHeaders.map((header, jdx, allHeaders) => {
            if (cells[jdx]) {
              tripConfig[allHeaders[jdx]] = cells[jdx];
            } else {
              reject2(`Missing field ${allHeaders[jdx]} on row #${idx}`);
            }
          });

          // idx - 1 because the .csv first row is header names
          allTrips[idx - 1] = new TripData(tripConfig); 
          allBrands.add(allTrips[idx - 1].getBrand());
          allRetailers.add(allTrips[idx - 1].getRetailer());
          resolve2();
        }).then(() => {
          if (idx < totalRows) {
            parseNextTransaction(idx + 1);
          } else {
            resolve({
              trips: allTrips,
              brands: allBrands,
              retailers: allRetailers
            });
          }
        });
      })(1);
    });
  }

  sortTrips(dataObj) {
    return new Promise((resolve) => {
      dataObj.trips.sort((tripDataA, tripDataB) => {
        const retailerA = tripDataA.getRetailer();
        const retailerB = tripDataB.getRetailer();

        const brandA = tripDataA.getBrand();
        const brandB = tripDataB.getBrand();

        if (retailerA > retailerB) {
          return 1;
        } else if (retailerB > retailerA) {
          return -1;
        } else if (brandA > brandB) {
          return 1;
        } else if (brandB > brandA) {
          return -1;
        } else {
          return 0;
        }
      });
      resolve(dataObj);
    });
  }

  initializeDataTable(dataObj) {
    const {
      dataTableContainer,
      verticalScrollBarContainer,
      filtersContainer,
      dataTable,
      jsSetToSortedArray,
    } = this;

    const {
      scrollPos,
    } = this.state;

    const headerHeight = dataTable.getTableHeaderHeight();
    const footerHeight = dataTable.getTableFooterHeight();
    const verticalScrollBarWidth = verticalScrollBarContainer.offsetWidth;
    const verticalScrollBarHeight = verticalScrollBarContainer.offsetHeight;
    const filtersHeight = filtersContainer.offsetHeight;
    
    dataTableContainer.style.width = `${window.innerWidth - verticalScrollBarHeight}px`;
    dataTableContainer.style.height = `${window.innerHeight - filtersHeight}px`;
    verticalScrollBarContainer.style.width = `${window.innerHeight -
      filtersContainer.offsetHeight}px`;
    verticalScrollBarContainer.style.left = `${window.innerWidth - 
      (verticalScrollBarContainer.offsetWidth +
        verticalScrollBarContainer.offsetHeight) / 2}px`;

    console.log('verticalScrollBarContainer.offsetWidth = ' + verticalScrollBarContainer.offsetWidth);
    const availibleVerticalSpace = verticalScrollBarContainer.offsetWidth -
      (headerHeight + footerHeight); // + filtersContainer.offsetHeight);
    console.log('App.js --> initializeDataTable: availibleVerticalSpace = ' + availibleVerticalSpace);
    const batchSize = Math.floor(availibleVerticalSpace / footerHeight);
    console.log('App.js --> initializeDataTable: footerHeight = ' + footerHeight);
    console.log('App.js --> initializeDataTable: batchSize = ' + batchSize);
    
    const allRetailers = jsSetToSortedArray(dataObj.retailers);
    const allBrands = jsSetToSortedArray(dataObj.brands);
    const initialSubset = dataObj.trips.slice(scrollPos, scrollPos + batchSize);

    const totalTrips = dataObj.trips.length;
    const maxIndex = Math.ceil(totalTrips / batchSize) * batchSize;
    console.log('App.js --> initializeDataTable: maxIndex = ' + maxIndex);

    this.setState({
      offset: maxIndex - totalTrips,
      maxIndex: maxIndex,
      minIndex: 0, 
      batchSize: batchSize,
      trips: dataObj.trips,
      scrollPos: maxIndex,
      brands: allBrands,
      retailers: allRetailers,
      tripsToDisplay: dataObj.trips,
    });
  }

  jsSetToSortedArray(targetSet) {
    const arr = [];
    
    targetSet.forEach((value) => {
      arr.push(value);
    });
    
    arr.sort(function(strA, strB) {
      if (strA > strB) {
        return 1;
      } else if (strA < strB) {
        return -1;
      } else {
        return 0;
      }
    });

    return arr;
  }

  updateRetailer(newRetailer) {
    const {
      updateTripsToDisplay,
    } = this;

    const {
      selectedBrand,
      trips,
    } = this.state;

    return new Promise((resolve) => {
      const filteredTrips = trips.filter((trip, index, allTrips) => {
        return trip.matchesProps(newRetailer, selectedBrand);
      });
      resolve(filteredTrips);
    }).then((filteredTrips) => {
      updateTripsToDisplay(filteredTrips, selectedBrand, newRetailer);
    });
  }

  updateBrand(newBrand) {
    const {
      updateTripsToDisplay,
    } = this;

    const {
      selectedRetailer,
      trips,
    } = this.state;

    return new Promise((resolve) => {
      const filteredTrips = trips.filter((trip, index, allTrips) => {
        return trip.matchesProps(selectedRetailer, newBrand);
      });
      resolve(filteredTrips);
    }).then((filteredTrips) => {
      updateTripsToDisplay(filteredTrips, newBrand, selectedRetailer);
    });
  }

  updateTripsToDisplay(filteredTrips, newBrand, newRetailer) {
    const {
      batchSize,
    } = this.state;
    
    const totalTrips = filteredTrips.length;
    const maxIndex = Math.ceil(totalTrips / batchSize) * batchSize;

    this.setState({
      offset: maxIndex - totalTrips,
      maxIndex: maxIndex,
      minIndex: 0,
      selectedBrand: newBrand,
      selectedRetailer: newRetailer,
      tripsToDisplay: filteredTrips,
      scrollPos: maxIndex,
    });
  }

  updateScrollPos() {
    const {
      verticalScrollBar,
    } = this;

    this.setState({
      scrollPos: verticalScrollBar.valueAsNumber,
    });
  }

  handleError(error) {
    console.error('App --> handleError: ' + error);
  }

  render() {
    const {
      updateScrollPos,
      updateRetailer,
      updateBrand,
    } = this;

    const {
      brands,
      retailers,
      scrollPos,
      batchSize,
      tripsToDisplay,
      maxIndex,
      minIndex,
      offset,
    } = this.state;

    const totalTrips = tripsToDisplay.length;
    const step = batchSize;

    const startIndex = totalTrips - (scrollPos - offset);
    const displayingSubset = tripsToDisplay.slice(startIndex, 
      startIndex + batchSize);

    while(displayingSubset.length < batchSize) {
      displayingSubset.push(new EmptyTripData());
    }
    
    return (
      <div
        className='app_container'
        ref={ref => this.appContainer = ref}
      >
        <div
          className='vertical_scroll_container'
          ref={ref => this.verticalScrollBarContainer = ref}
        > 
          <input
            className='vertical_scroll'
            type='range'
            min={minIndex + batchSize}
            max={maxIndex}
            step={step}
            ref={ref => this.verticalScrollBar = ref}
            onInput={updateScrollPos}
            onChange={updateScrollPos}
          />
        </div>
        <div
          className='filters_container'
          ref={ref => this.filtersContainer = ref}
        >
          <FilterDropDown
            label={'Retailer: '}
            data={retailers}
            onSelectUpdate={updateRetailer}
          />
          <FilterDropDown
            label={'Parent Brand: '}
            data={brands}
            onSelectUpdate={updateBrand}
          />
        </div>
        <div
          className='table_container'
          ref={ref => this.dataTableContainer = ref}
        >
          <DataTable
            data={displayingSubset}
            ref={ref => this.dataTable = ref}
          />
        </div>
      </div>
    );
  }
}

export default App;
