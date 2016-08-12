import React from 'react'
import styles from "./AddDiary.less"

const AddDiary = React.createClass({
    getInitialState:function(){
        return {
            upLoadImg:'',
            textAlign:'left',//设置文字的格式
            content:'',//保存输入的值
            remain:110,//剩余输入的文字个数
            isView:false
        }
    },
    handleChangeImg:function(e){
        var windowURL = window.URL || window.webkitURL;
        var imgURL = windowURL.createObjectURL(e.target.files[0]);
        this.setState({
            upLoadImg:imgURL
        })
    },
    handleChangeAlign:function(align){
        this.setState({
            textAlign:align
        })
    },
    handleChangeContent:function(e){
        this.setState({
            content:e.target.value,
            remain:110-e.target.value.length
        })
    },
    showView:function(){
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
    render:function(){
        return <div className={styles.root}>
                    <div className='upLoadBox'>
                        <input type='file' onChange={this.handleChangeImg}/>
                        <div className='showUploadImg' style={{background:'url('+this.state.upLoadImg+') transparent center'}}></div>
                        <div className='point' style={this.state.upLoadImg?{display:'none'}:{display:'block'}}>
                            <b>+</b>
                            <p>上传图片</p>
                        </div>
                        <span style={this.state.upLoadImg?{display:'block'}:{display:'none'}}>重新上传</span>
                        <div style={this.state.upLoadImg?{display:'block'}:{display:'none'}} className='bg'></div>
                    </div>
                    <input placeholder='标题' className='title' maxLength={18}/>
                    <div className='content'>
                        <textarea placeholder='随记内容' maxLength={110} onChange={this.handleChangeContent} style={this.state.isView?{opacity:0}:{opacity:1}} onFocus={this.showView} onBlur={this.hideView}></textarea>
                        <p className={this.state.textAlign} style={this.state.isView?{visibility:'visible'}:{visibility:'hidden'}}>{this.state.content}</p>
                        <span>剩余{this.state.remain}字</span>
                    </div>

                    <div className='control'>
                        <i className="icon iconfont" onClick={this.handleChangeAlign.bind(null,'left')}>&#xe605;</i>
                        <i className="icon iconfont" onClick={this.handleChangeAlign.bind(null,'center')}>&#xe603;</i>
                        <i className="icon iconfont" onClick={this.handleChangeAlign.bind(null,'firstDown')}>&#xe60c;</i>
                    </div>
               </div>
    }
})


export default AddDiary
