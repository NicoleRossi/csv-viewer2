import React, { Component } from 'react';

class FilterDropDown extends Component {
  constructor(props) {
    super(props);
    this.selectOnChange = this.selectOnChange.bind(this);
  }

  selectOnChange(evt) {
    this.props.onSelectUpdate(evt.target.value);
  }

  render() {
    let options = [
      <option value={'All'} key={0}>{'All'}</option>
    ];

    if(this.props.data) {
      const totalItems = this.props.data.length
      for(let i = 0; i < totalItems; i++) {
        const item = this.props.data[i];
        options.push(<option value={item} key={i + 1}>{item}</option>);
      }
    }

    return (
      <label>
        {this.props.label}
        <select onChange={this.selectOnChange}>
          {options}
        </select>
      </label>
    );
  }
}

export default FilterDropDown;
