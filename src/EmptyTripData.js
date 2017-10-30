class EmptyTripData {
  getId () {
    return '';
  }

  getDate() {
    return new Date();
  }

  getCurrency() {
    return '\u00a0'; // \u00a0 === &nbsp;
  }

  getPrice() {
    return 0;
  }

  getBrand() {
    return '\u00a0'; // \u00a0 === &nbsp;
  }

  getRetailer() {
    return '\u00a0'; // \u00a0 === &nbsp;
  }

  getQuantity() {
    return 0;
  }

  getUserId() {
    return '\u00a0'; // \u00a0 === &nbsp;
  }

  getPriceStr() {
    return '\u00a0'; // \u00a0 === &nbsp;
  }

  getDateStr() {
    return '\u00a0'; // \u00a0 === &nbsp;
  }
}

export default EmptyTripData;
