function logoutCustomer() {
  this.session.customerID = undefined;
  this.locals.customer = undefined;
}

export default logoutCustomer;
