import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import _ from 'underscore'
import {push} from 'redux-router'
import LoginContainer from '../containers/LoginContainer'
import {logout, restoreFromToken} from '../actions/user'
import Navigation from '../components/Common/Navigation'

export function AppContainer(Component){
	class MyComponent extends React.Component{
		constructor(props) {
			super(props)

		}
		componentWillMount(){
			const {
				user
			} = this.props
			if (user.get('token') && user.get('uuid')) {
				this.props.restoreFromToken(user.get('token'), user.get('uuid'))
			}
		}

		getMenu(key){
			//  向后台请求二级菜单
			// let pathTemp=this.props.query;
			// pathTemp["defaultNavigationKey"]=key;
			// this.props.push({
			// 	    pathname:"/contentManage/diary/my",
      //         query: pathTemp,
      //       })
			// this.setState({defaultNavigationKey:key})

		}
		handleLogOut(){
			this.props.logout()
		}
		render() {

			if(this.props.user.get('token')){
				return (
					<div>
						<Navigation {...this.props} handleLogOut={this.handleLogOut.bind(this)}></Navigation>

					   <Component {...this.props}></Component>
					</div>
				)
			}else{
				return <LoginContainer></LoginContainer>
			}
		}
	}

	function mapStateToProps(state) {

		return {
			user: state.getIn(["user"]),
		  "menuDate": [{
					"id": 1,
					"name": "活动管理",
					"icon": "desktop",
					"childrenMenu": [{
						"id": 2,
						"name": "微信活动",
						"icon": "book",
						"link": "contentManage/avtivity/weChat"
					}, {
						"id": 3,
						"name": "网页活动",
						"icon": "calendar",
						// "link": "/contentManage/tuso/all"
					}, {
						"id": 4,
						"name": "地推活动",
						"icon": "calendar",
						// "link": "/contentManage/tuso/all"
					}]

				},{
						"id": 5,
						"name": "房源管理",
						"icon": "desktop",
						"childrenMenu": [{
							"id": 6,
							"name": "房源信息",
							"icon": "book",
							// "link": "contentManage/avtivity/weChat"
						},{
							"id": 7,
							"name": "客户通讯录",
							"icon": "book",
							// "link": "contentManage/avtivity/weChat"
						}]

					},{
							"id": 8,
							"name": "员工管理",
							"icon": "desktop",
							"childrenMenu": [{
								"id": 9,
								"name": "员工信息",
								"icon": "book",
								// "link": "contentManage/avtivity/weChat"
							},{
								"id": 10,
								"name": "工资表",
								"icon": "book",
								// "link": "contentManage/avtivity/weChat"
							}]

						},{
								"id": 11,
								"name": "员工交流",
								"icon": "desktop",
								"childrenMenu": [{
									"id": 12,
									"name": "通讯录",
									"icon": "book",
									// "link": "contentManage/avtivity/weChat"
								},{
									"id": 13,
									"name": "工作心得",
									"icon": "book",
									// "link": "contentManage/avtivity/weChat"
								}]

							}

			]


		}
	}

	function mapDispatchToProps(dispatch) {
		return {
			push: bindActionCreators(push, dispatch),
			logout: bindActionCreators(logout, dispatch),
			restoreFromToken: bindActionCreators(restoreFromToken, dispatch),
		}
	}

	return connect(mapStateToProps, mapDispatchToProps)(MyComponent)
}
