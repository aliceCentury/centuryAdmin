import React from 'react'
import styles from "./AddTuso.less"
var DragSource = require('react-dnd').DragSource
var DropTarget = require('react-dnd').DropTarget
var flow = require('lodash/flow')
import { Icon } from 'antd'

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
}

const ItemTypes = {
  CARD: 'card'
}

const cardTarget = {
  hover:function(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    props.moveCard(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  }
}

function count(str,i){//返回要截取的标题的位置,i表示限制的字节数
    let strArr = str.split('');
    let transStr = '',
        subLength = 0;
    strArr.map((item,index)=>{
        if(transStr.replace(/[^\x00-\xff]/g, "**").length<i){
            transStr += item;
            subLength = index+1;
        }
    })
    return subLength
}

function cursorPost(e,str){//返回光标所在的行
    let account = '',
        elPost = 0;
    str.map((item,index)=>{
        if(index==0){
            if(0<=e&&e<=item.length){
                elPost = 0;
            }
        }else{
            if(account.length+index-1<e&&e<=account.length+item.length+index){
                elPost = index;
            }
        }
        account += item;
    })
    return elPost
}

const AddTuso = React.createClass({
    getInitialState:function(){
        return {
            upLoadImg:'',//上传的图片路径，用于显示
            textAlign:'left',//设置文字的格式
            content:'',//保存输入的值
            remain:110,//剩余输入的文字个数
            isView:false,//判断是否显示文字格式，textarea无法显示首字下垂
            title:'',//保存输入标题
            file:'',//上传图片
            isChineseInput:false,//判断是否是中文输入
            remainRow:5,//剩余行数
            showRemainRow:false,//判断是否显示剩余行数
            saveContent:'',//保存输入的值
        }
    },
    handleChangeImg:function(e){
        var windowURL = window.URL || window.webkitURL;
        var imgURL = windowURL.createObjectURL(e.target.files[0]);
        this.setState({
            upLoadImg:imgURL,
            file:e.target.files[0]
        })
        this.props.handleChangeCardContent(this.props.id,e.target.files[0],this.state.title,this.state.content,this.state.textAlign);
    },
    handleChangeAlign:function(align){
        this.setState({
            textAlign:align
        })
        this.props.handleChangeCardContent(this.props.id,this.state.file,this.state.title,this.state.content,align);
    },
    handleChangeContent:function(e){
        
        this.setState({
            content:e.target.value,
            remain:110-e.target.value.length+e.target.value.split('\n').length-1
        })
        if(this.state.title==''){
            this.refs.title.className = 'title errTitle';
        }else{
            this.props.handleChangeCardContent(this.props.id,this.state.file,this.state.title,e.target.value,this.state.textAlign);
        }
    },
    showView:function(e){//显示输入完成的展示p标签
        this.setState({
            isView:false
        })
    },
    hideView:function(e){
        if(e.target.value!=''){
            this.setState({
                isView:true
            })
        }
    },
    handleChangeTitle:function(e){
        let str = e.target.value;
        if(!this.state.isChineseInput){//输入的时候不截断，停止输入开始截断
            str = str.substring(0,count(str,36));
        }
        this.setState({
            title:str
        })
        this.props.handleChangeCardContent(this.props.id,this.state.file,e.target.value,this.state.content,this.state.textAlign);
    },
    compositionstart:function(){//判断输入的时候是否需要截断
        this.setState({
            isChineseInput:true
        })
    },
    compositionend:function(){
        this.setState({
            isChineseInput:false
        })
    },
    handleKeyDown:function(e){
        let showPartHeight = this.refs.showPart.clientHeight-12;
        if(e.keyCode==13&&showPartHeight==120){
            e.preventDefault();
        }
        if(showPartHeight==120&&!this.state.isChineseInput){
            this.setState({
                saveContent:e.target.value
            })
        }
        if(e.keyCode==13&&showPartHeight==120){
            e.preventDefault();
        }
        if(e.keyCode==13){
            this.setState({
                showRemainRow:true
            })
        }else{
            this.setState({
                showRemainRow:false
            })
        }
    },
    handleKeyUp:function(e){
        let showPartHeight = this.refs.showPart.clientHeight-12;
        if(showPartHeight>120&&!this.state.isChineseInput){
            this.setState({
                content:this.state.saveContent
            })
        }
        this.setState({
            remainRow:6-showPartHeight/20
        })
    },
    render:function(){
        const {connectDragSource,connectDropTarget} = this.props;
        const content = this.state.content.split('\n');
        return connectDragSource(connectDropTarget(
                <div className={`item ${styles.root}`}>
                    <div className='delete' style={this.props.tusoCardList.length>1?{display:'block'}:{display:'none'}} onClick={this.props.handleDeleteTuso.bind(null,this.props.id)}><Icon type="cross-circle-o" /></div>
                    <div className='upLoadBox'>
                        <input type='file' onChange={this.handleChangeImg} accept='image/jpeg,image/png,image/jpg'/>
                        <div className='showUploadImg' style={{background:'url('+this.state.upLoadImg+') transparent center'}}></div>
                        <div className='point' style={this.state.upLoadImg?{display:'none'}:{display:'block'}}>
                            <b>+</b>
                            <p>上传图片</p>
                        </div>
                        <span style={this.state.upLoadImg?{display:'block'}:{display:'none'}}>重新上传</span>
                        <div style={this.state.upLoadImg?{display:'block'}:{display:'none'}} className='bg'></div>
                    </div>
                    <input placeholder='标题' ref='title' className='title' value={this.state.title} onChange={this.handleChangeTitle} onCompositionStart={this.compositionstart} onCompositionEnd={this.compositionend}/>
                    <div className='content'>
                        <textarea rows="2" placeholder='随记内容' value={this.state.content} maxLength={110+(content.length-1)*2} onChange={this.handleChangeContent} style={this.state.isView?{opacity:0}:{opacity:1}} onFocus={this.showView} onBlur={this.hideView} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} onCompositionStart={this.compositionstart} onCompositionEnd={this.compositionend}></textarea>
                        <p ref='showPart' className={this.state.textAlign} style={this.state.isView?{visibility:'visible'}:{visibility:'hidden'}}>{
                            content.map((item,index)=>{
                                if(content.length==1&&content[0]==''){

                                }else{
                                    return (<b key={index}>{item}<br/></b>)
                                }
                            })
                        }</p>
                        <span>{this.state.showRemainRow?'剩余'+this.state.remainRow+'行':'剩余'+this.state.remain+'字'}</span>
                    </div>

                    <div className='control'>
                        <i className="icon iconfont" onClick={this.handleChangeAlign.bind(null,'left')}>&#xe605;</i>
                        <i className="icon iconfont" onClick={this.handleChangeAlign.bind(null,'center')}>&#xe603;</i>
                        <i className="icon iconfont" onClick={this.handleChangeAlign.bind(null,'firstDown')}>&#xe60c;</i>
                    </div>
               </div>
        ))
    }
})


module.exports = flow(
  DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })),
  DropTarget(ItemTypes.CARD, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  }))
)(AddTuso)
