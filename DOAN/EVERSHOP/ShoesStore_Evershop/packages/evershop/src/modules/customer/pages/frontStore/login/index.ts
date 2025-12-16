import { translate } from '../../../../../lib/locale/translate/translate.js';
import { buildUrl } from '../../../../../lib/router/buildUrl.js';
import { setPageMetaInfo } from '../../../../cms/services/pageMetaInfo.js';

export default (request, response, next) => {
  if (request.isCustomerLoggedIn()) {
    response.redirect(buildUrl('homepage'));
  } else {
    setPageMetaInfo(request, {
      title: translate('Login'),
      description: translate('Login')
    });
    next();
  }
};
