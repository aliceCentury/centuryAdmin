import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import _ from 'underscore'
import MenuComponent from '../../components/Common/MenuComponent'
import {push} from 'redux-router'
export function ContentManage(Component){
class MyComponent extends React.Component {
    constructor(props) {
        super(props)
        this.props.menuDate.map((items, index) => {
          items.childrenMenu.map((childrenItems, childrenIndex) => {
            if(window.location.hash.indexOf(childrenItems.link)>-1){
              localStorage.path= JSON.stringify(childrenItems);
            }

          })
        })
        if(!localStorage.defaultOpen){
          localStorage.defaultOpen=JSON.stringify(["1","4"]);
        }

        this.state = {
            defaultSelectedKeys:JSON.parse(localStorage.path).id+""||"2",
            selectMenuName:JSON.parse(localStorage.path).name||"21世纪",
            defaultOpen:JSON.parse(localStorage.defaultOpen)||["1","5","8","11"]
        }
    }
    shouldComponentUpdate(nextProps, nextState){
      this.setState({
        faultSelectedKeys: JSON.parse(localStorage.path).id+""||"2",
        selectMenuName:JSON.parse(localStorage.path).name||"21世纪",
        defaultOpen:JSON.parse(localStorage.defaultOpen)||["1","5","8","11"]
  });
      if (_.isEqual(nextProps, this.props) && _.isEqual(nextState, this.state)) return false
      return true
    }
    goLink(data,path){
      this.props.push({pathname:data.link});
    }
    handleOpen(data){
      localStorage.defaultOpen=JSON.stringify(data);
    }
    render() {
          return (
            <div>
                <MenuComponent {...this.props} handleOpen={this.handleOpen.bind(this)} defaultOpenKeys={this.state.defaultOpen}  defaultSelectedKeys={this.state.defaultSelectedKeys} goLink={this.goLink.bind(this)}></MenuComponent>
                <Component {...this.props} selectMenuName={this.state.selectMenuName}></Component>
            </div>
        )
    }
}

function mapStateToProps(state) {

    return {
        "selectedKeys": state.get('route').location.query,
    }
}

function mapDispatchToProps(dispatch) {

    return {
      push: bindActionCreators(push, dispatch),
    }
}
return connect(mapStateToProps, mapDispatchToProps)(MyComponent)
}
