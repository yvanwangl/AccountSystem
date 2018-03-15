/**
 * Created by wyf on 2017/1/18.
 */
import {httpServer, defaultOptions} from '../../system.config';

const PAGE_SIZE = 10;
const HTTP_SERVER = httpServer;
const DEFAULT_OPTIONS = defaultOptions;

const formItemLayout = {
	labelCol: {
		span: 4
	},
	wrapperCol: {
		span: 16
	}
};


export default {
    PAGE_SIZE,
	HTTP_SERVER,
	DEFAULT_OPTIONS,
	formItemLayout
};