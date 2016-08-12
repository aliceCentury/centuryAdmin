import React from 'react'
import styles from "./ViewDiary.less"


const ViewDiary = React.createClass({
    getInitialState:function(){
        return {
          // 翻转次数
          rotateIndex:0
        }
    },
    handleEnter:function(e){
        e.stopPropagation();
        if(this.props.note){
          this.state.rotateIndex++;
          this.refs.rotate.style.transform = "rotateY(" + this.state.rotateIndex*180 + "deg)";
        }
    },
    componentWillReceiveProps:function(nextProps){
      // 关闭窗口后转角为0
      setTimeout(() => {
        this.setState({"rotateIndex":0})
        this.refs.rotate.style.transform = "rotateY(0deg)";
      }, 100);
   },
    handleBodyClick:function(){
        this.props.handleViewCancel();
    },
    handleStopCancle:function(e){
        e.stopPropagation();
    },
    render:function(){
      return <div className={styles.root} onClick={this.handleBodyClick}>
                    {
                        this.props.viewStatus?(
                            <div className='card' onClick={this.handleEnter}>
                                <div className='cardContent' ref='rotate'>
                                    <div className='front'>
                                        <div className={this.props.note?'cardImg':'cardImgFull'} style={{background:'url('+this.props.essayist+') center'}}></div>
                                        {this.props.note?(<h1>{this.props.note.title}</h1>):null}
                                     </div>
                                    <div className='back'>
                                      {this.props.note?(<h1>{this.props.note.title}</h1>):null}
                                      {this.props.note?( <span className={this.props.note.style=="v1/right"?"textSkin":this.props.note.style=="v1/center"?"textCenter":"textLeft"} >
                                      {this.props.note.content}
                                      </span>):null}
                                    </div>
                                </div>
                            </div>
                        ):(
                            <div className='commonCard' onClick={this.handleStopCancle}>
                                <div className='upLoadBox' style={{background:'url('+this.props.essayist+') center'}}></div>
                                <h1>{this.props.essayist.title}</h1>
                                <p>{this.props.essayist.content}</p>
                            </div>
                        )
                    }</div>
    }
})


export default ViewDiary
