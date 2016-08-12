import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {push} from 'redux-router'
import {Menu, Breadcrumb, Icon} from 'antd';
import styles from "./MenuComponent.less"

const SubMenu = Menu.SubMenu;

class MyComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            collapse: true
        }

    }

    handleClick(e) {
      this.props.menuDate.map((items, index) => {
        items.childrenMenu.map((childrenItems, childrenIndex) => {
          if(childrenItems.id==e.key){
            this.props.goLink(childrenItems,e.keyPath);
          }

        })
      })
    }
handleOpen(e){
  this.props.handleOpen(e.openKeys);
}
    render() {
        return (
            <div className={styles.root}>
                <div className="ant-layout-aside">
                    <aside className="ant-layout-sider">
                      <div className="coverTop">{"21世纪管理系统"}</div>

                        <Menu mode="inline" theme="dark" onClick={this.handleClick.bind(this)} onOpen={this.handleOpen.bind(this)} selectedKeys={[this.props.defaultSelectedKeys]} defaultOpenKeys={this.props.defaultOpenKeys}>
                            {this.props.menuDate.map((items, index) => {
                                return (
                                    <SubMenu key={items.id} title={< span > <Icon type={items.icon}/>
                                        {items.name} < /span>}>
                                        {items.childrenMenu.map((childrenItems, childrenIndex) => {
                                            return (
                                                <Menu.Item key={childrenItems.id}><Icon type={childrenItems.icon}/>{childrenItems.name}</Menu.Item>
                                            )
                                        })}
                                    </SubMenu>
                                )
                            })}
                        </Menu>
                    </aside>

                </div>

            </div>
        )
    }

}



export default MyComponent

//<CardDiary photo={this.state.photo}  handlePhotoChange={this.handlePhotoChange.bind(this)} diaryStyle={this.state.diaryStyle} changeStyle={this.changeStyle.bind(this)}></CardDiary>
