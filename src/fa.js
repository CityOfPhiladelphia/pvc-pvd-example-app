
import * as faComps from '@philly/vue-comps/src/fa.js';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserSecret } from '@fortawesome/pro-solid-svg-icons/faUserSecret';
import { faMapMarkerAlt } from '@fortawesome/pro-solid-svg-icons/faMapMarkerAlt';
library.add(faUserSecret, faMapMarkerAlt);

export default library;
