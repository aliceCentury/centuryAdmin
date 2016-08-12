import React from 'react'
import {Route, IndexRoute} from 'react-router'
import {ReduxRouter} from 'redux-router'
import {AppContainer} from './containers/AppContainer'
import {ContentManage} from './containers/contentManage'
import WeChat from './containers/contentManage/activity/WeChat'

import LoginContainer from './containers/LoginContainer'

const routes = <ReduxRouter>
	<Route path="/">
		<IndexRoute></IndexRoute>
		<Route path="contentManage">
			<IndexRoute component={AppContainer(ContentManage(WeChat))}></IndexRoute>
			<Route path="avtivity">
				<IndexRoute component={AppContainer(ContentManage(WeChat))}></IndexRoute>
				<Route path="weChat" component={AppContainer(ContentManage(WeChat))}></Route>

			</Route>
		</Route>
	</Route>
	<Route path="/login" component={LoginContainer}></Route>
</ReduxRouter>

export default routes
