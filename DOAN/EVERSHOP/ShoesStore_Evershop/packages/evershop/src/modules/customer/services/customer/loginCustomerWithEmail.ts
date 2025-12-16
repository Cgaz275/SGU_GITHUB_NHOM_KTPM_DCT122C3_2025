import { select } from '@evershop/postgres-query-builder';
import { translate } from '../../../../lib/locale/translate/translate.js';
import { pool } from '../../../../lib/postgres/connection.js';
import { comparePassword } from '../../../../lib/util/passwordHelper.js';

async function loginCustomerWithEmail(email: string, password: string) {
  const customerEmail = email.replace(/%/g, '\\%');
  const customer = await select()
    .from('customer')
    .where('email', 'ILIKE', customerEmail)
    .and('status', '=', 1)
    .load(pool);
  const result = comparePassword(password, customer ? customer.password : '');
  if (!customer || !result) {
    throw new Error(translate('Invalid email or password'));
  }
  if (this.session) {
    this.session.customerID = customer.customer_id;
  }
  delete customer.password;
  this.locals.customer = customer;
}

export default loginCustomerWithEmail;
