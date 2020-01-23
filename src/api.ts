import { SDK } from '@directus/sdk-js';

const path = window.location.pathname;
const parts = path.split('/');
const adminIndex = parts.indexOf('admin');
export const apiRootPath = parts.slice(0, adminIndex).join('/') + '/';

export default new SDK({
	mode: 'cookie',
	url: apiRootPath
});
