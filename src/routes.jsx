import React from 'react'
import {Route, IndexRoute} from 'react-router'
import {ReduxRouter} from 'redux-router'
import {AppContainer} from './containers/AppContainer'
import {ContentManage} from './containers/contentManage'
import AllTuso from './containers/contentManage/AllTuso'
import MyTuso from './containers/contentManage/MyTuso'
import AddTuso from './containers/contentManage/AddTuso'
import LoginContainer from './containers/LoginContainer'
import MaJia from './containers/contentManage/MaJia'
import Ordinary from './containers/contentManage/Ordinary'
import DraftBox from './containers/contentManage/DraftBox'
import ResearchActivities from './containers/contentManage/ResearchActivities'
import ResearchResult from './containers/contentManage/ResearchResult'

const routes = <ReduxRouter>
	<Route path="/">
		<IndexRoute></IndexRoute>
		<Route path="contentManage">
			<IndexRoute component={AppContainer(ContentManage(MyTuso))}></IndexRoute>
			<Route path="tuso">
				<IndexRoute component={AppContainer(ContentManage(MyTuso))}></IndexRoute>
				<Route path="all" component={AppContainer(ContentManage(AllTuso))}></Route>
				<Route path="my" component={AppContainer(ContentManage(MyTuso))}></Route>
				<Route path="add" component={AppContainer(ContentManage(AddTuso))}></Route>
			</Route>
			<Route path="user">
				<IndexRoute component={AppContainer(ContentManage(MyTuso))}></IndexRoute>
				<Route path="majia" component={AppContainer(ContentManage(MaJia))}></Route>
				<Route path="ordinary" component={AppContainer(ContentManage(Ordinary))}></Route>
				<Route path="draftBox" component={AppContainer(ContentManage(DraftBox))}></Route>
				</Route>
				<Route path="research">
					<IndexRoute component={AppContainer(ContentManage(ResearchActivities))}></IndexRoute>
					<Route path="activity" component={AppContainer(ContentManage(ResearchActivities))}></Route>
					<Route path="result" component={AppContainer(ContentManage(ResearchResult))}></Route>
					</Route>
		</Route>
	</Route>
	<Route path="/login" component={LoginContainer}></Route>
</ReduxRouter>

export default routes
