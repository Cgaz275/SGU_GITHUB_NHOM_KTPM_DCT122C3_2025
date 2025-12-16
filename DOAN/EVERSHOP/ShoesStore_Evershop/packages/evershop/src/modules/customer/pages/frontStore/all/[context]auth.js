import { select } from '@evershop/postgres-query-builder';
import { pool } from '../../../../../lib/postgres/connection.js';
import { buildUrl } from '../../../../../lib/router/buildUrl.js';

export default async (request, response, next) => {
  const { customerID } = request.session;
  if (!customerID) {
    delete request.locals.customer;
    next();
  } else {
    const customer = await select()
      .from('customer')
      .where('customer_id', '=', customerID)
      .and('status', '=', 1)
      .load(pool);

    if (!customer) {
      request.logoutCustomer((error) => {
        if (error) {
          next(error);
        } else {
          response.redirect(buildUrl('homepage'));
        }
      });
    } else {
      delete customer.password;
      request.locals.customer = customer;
      next();
    }
  }
};
