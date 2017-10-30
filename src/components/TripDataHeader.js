import React, { Component } from 'react';
import TripData from '../TripData';

class TripDataHeader extends Component {
  getHeight() {
    return this.headerRoot.offsetHeight;
  }

  render() {
    return (
      <thead
        ref={ref => this.headerRoot = ref}
      >
        <tr>
          <th className='trip_id'>{TripData.propId}</th>
          <th className='trip_date'>{TripData.propDate}</th>
          <th className='trip_retailer'>{TripData.propRetailer}</th>
          <th className='item_brand'>{TripData.propBrand}</th>
          <th className='item_price'>{TripData.propPrice}</th>
          <th className='item_quantity'>{TripData.propQuantity}</th>
        </tr>
      </thead>
    );
  }
}

export default TripDataHeader;
