import { GLOBAL_NAMESPACE } from './Constants';

window[GLOBAL_NAMESPACE] = (window[GLOBAL_NAMESPACE] || {});
const ns = window[GLOBAL_NAMESPACE];

export default ns;
