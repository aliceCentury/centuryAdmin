import React from 'react'
import styles from "./EditTag.less"
import { Input ,Button} from 'antd';

const ViewTuso = React.createClass({
    getInitialState:function(){
        return {
          value:this.props.tagTemp.id,
        }
    },
    handleBodyClick: function() {
        this.props.handleViewCancel()
    },
    handleStopCancle: function(e) {
        e.stopPropagation();
    },
    handleInputChange: function(e) {
  this.setState({
    value: e.target.value,
  });
},
handleButtonClick:function(){
  this.props.editTagOK(this.state.value)
  this.props.handleViewCancel();
},
    render: function() {
        return (
            <div className={styles.root} onClick={this.handleBodyClick}>
              <div className="bgBox" onClick={this.handleStopCancle}>
                <h3>标记标签</h3>
                <p>请输入标签，多个以逗号“，”隔开</p>
               <Input value={this.state.value}  onChange={this.handleInputChange} placeholder="标记标签" />
               <div className="butBar">
                  <Button type="primary" onClick={this.handleButtonClick}>确定</Button>
                  <Button onClick={this.handleBodyClick}>取消</Button>
               </div>
                </div>

            </div>
        )
    }
})

export default ViewTuso
