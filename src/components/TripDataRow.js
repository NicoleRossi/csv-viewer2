import React, { Component } from 'react';

class TripDataRow extends Component {
  constructor(props) {
    super(props);
    this.state = {data: this.props.datum};
  }

  render() {
    const tripData = this.state.data;
    return (
      <tr>
        <td className='trip_id'>{tripData.getId()}</td>
        <td className='trip_date'>{tripData.getDateStr()}</td>
        <td className='trip_retailer'>{tripData.getRetailer()}</td>
        <td className='item_brand'>{tripData.getBrand()}</td>
        <td className='item_price'>{tripData.getPriceStr()}</td>
        <td className='item_quantity'>{tripData.getQuantity() || '\u00a0'}</td> 
      </tr>
    ); // \u00a0 === &nbsp;
  }
}

export default TripDataRow;
