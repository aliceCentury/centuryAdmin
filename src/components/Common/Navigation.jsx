import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {push} from 'redux-router'
import {Menu, Breadcrumb, Icon, Dropdown} from 'antd';
import styles from "./Navigation.less"
const SubMenu = Menu.SubMenu;
let menuIndex = 0;
class MyComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {}

    handleClick(e) {
        // this.props.getMenu(e.key);
    }
    handleLogOut() {
        this.props.handleLogOut()
    }
    render() {

        return (
            <div className={styles.root}>
                <div className="ant-layout-topaside">
                    <div className="ant-layout-header">
                        <div className="ant-layout-wrapper">
                            <Menu theme="white" mode="horizontal"
                              onClick={this.handleClick.bind(this)} defaultSelectedKeys={['0']}
                              style={{lineHeight: '54px'}}>
                                {this.props.navigationDate.map((items, index) => {
                                    return (
                                        <Menu.Item key={index}>{items.name}</Menu.Item>
                                    )
                                })}
                            </Menu>
                            <span className="userName">
                                {this.props.user.get("nickname")},welcome back! <a onClick={this.handleLogOut.bind(this)}>退出登录</a></span>


                        </div>
                    </div>

                </div>

            </div>
        )
    }

}

export default MyComponent

//<CardDiary photo={this.state.photo}  handlePhotoChange={this.handlePhotoChange.bind(this)} diaryStyle={this.state.diaryStyle} changeStyle={this.changeStyle.bind(this)}></CardDiary>
