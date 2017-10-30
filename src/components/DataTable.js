import React, { Component } from 'react';
import TripDataRow from './TripDataRow.js';
import TripDataHeader from './TripDataHeader';

class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {data: this.props.data};
    this.uuidGroup = new Set();
  }

  quickUuid() {
    const now = new Date().getTime();
    let uuid = Math.round(now * Math.random());

    while (this.uuidGroup.has(uuid)) {
      uuid = Math.round(now * Math.random());
    }
    this.uuidGroup.add(uuid);

    return uuid;
  }

  getTableHeaderHeight() {
    return this.tableHeader.getHeight();
  }

  getTableFooterHeight() {
    return this.tableFooter.offsetHeight;
  }

  getMinCellHeight() {
    return this.getTableFooterHeight();
  }

  render() {
    let tableRows = null;
    let totalDollars = 0;
    let totalItems = 0;
    tableRows = this.props.data.map((datum, index, arr) => {
      totalItems += datum.getQuantity();
      totalDollars += datum.getPrice();
      return <TripDataRow datum={datum} key={this.quickUuid()}/>;
    });   

    return (
      <table
        ref={ref => this.tableRoot = ref}
      >
        <TripDataHeader
          ref={ref => this.tableHeader = ref}
        />
        <tfoot
          ref={ref => this.tableFooter = ref}
        >
          <tr>
            <td className='trip_id'></td>
            <td className='trip_date'></td>
            <td className='trip_retailer'></td>
            <td className='item_brand'>Totals:</td>
            <td className='item_price'>{`$${totalDollars}`}</td>
            <td className='item_quantity'>{totalItems}</td>
          </tr>
        </tfoot>
        <tbody>{tableRows}</tbody>
      </table>
    );
  }
}

export default DataTable;
