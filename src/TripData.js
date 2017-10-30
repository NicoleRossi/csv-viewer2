class TripData {
  constructor(config) {
    this.setId(config[TripData.propId]);
    this.setDate(config[TripData.propDate]);
    this.setRetailer(config[TripData.propRetailer]);
    this.setBrand(config[TripData.propBrand]);
    this.setUserId(config[TripData.propUserId]);
    this.setPrice(config[TripData.propPrice]);
    this.setQuantity(config[TripData.propQuantity]);
  }

  setId(idStr) {
    this.id = parseInt(idStr, 10);
  }

  setDate(dateStr) {
    const dateTokens = dateStr.split('/');
    this.date = new Date(parseInt(dateTokens[2], 10), 
      parseInt(dateTokens[0], 10) - 1, parseInt(dateTokens[1], 10));
  }

  setCurrency(c) {
    this.currency = c;
  }

  setPrice(pStr) {
    this.setCurrency(pStr.charAt(0));
    this.price = parseInt(pStr.substring(1), 10);
  }

  setBrand(b) {
    this.brand = b;
  }

  setRetailer(r) {
    this.retailer = r;
  }

  setQuantity(q) {
    this.quantity = parseInt(q, 10);
  }

  setUserId(idStr) {
    this.userId = parseInt(idStr, 10);
  }

  getId () {
    return this.id;
  }

  getDate() {
    return this.date;
  }

  getCurrency() {
    return this.currency;
  }

  getPrice() {
    return this.price;
  }

  getBrand() {
    return this.brand;
  }

  getRetailer() {
    return this.retailer;
  }

  getQuantity() {
    return this.quantity;
  }

  getUserId() {
    return this.userId;
  }

  getPriceStr() {
    return `${this.currency}${this.price}`;
  }

  getDateStr() {
    return `${this.date.getMonth() + 1}/${this.date.getDate()}/\
      ${this.date.getFullYear()}`;
  }

  prependZero(num) {
    if (num < 10) {
      return `0${num}`;
    }
    return `${num}`;
  }

  matchesProps(retailer, brand) {
    const retailerMatch = retailer === 'All' || this.getRetailer() === retailer;
    const brandMatch = brand === 'All' || this.getBrand() === brand;
    return retailerMatch && brandMatch;
  }
}

TripData.propId = 'Trip ID';
TripData.propDate = 'Date';
TripData.propRetailer = 'Retailer';
TripData.propBrand = 'Parent Brand';
TripData.propUserId = 'User ID';
TripData.propPrice = 'Item Dollars';
TripData.propQuantity = 'Item Units';

export default TripData;
