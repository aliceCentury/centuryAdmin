import React, {PropTypes} from 'react'
import styles from './UpLoad.scss'
import {Editor, EditorState, RichUtils} from '../../utils/draft-js'
import textDefault from '../../public/image/default@2x.png'
import textCenter from '../../public/image/center@2x.png'
import textIndent from '../../public/image/Indent@2x.png'
import EditorDraggableHOC from './EditorDraggableHOC'
import _ from 'underscore'

const UpLoad = React.createClass({
	PropTypes: {
		handleMouseDown: PropTypes.func,
		handleMouseMove: PropTypes.func,
		handleMouseUp: PropTypes.func,
		resetDragState: PropTypes.func,
		baseDragTranslationY: PropTypes.number,
		dragTranslationY: PropTypes.number,
		defaultData: PropTypes.Object,
		handleSetBg: PropTypes.func,
	},

	getInitialState: function(){
		const {
			imgURL,
			textStyle,
			textValue,
			title
		} = this.props.defaultData

		return {
			showControl:false,
			imgURL: imgURL || '',
			textStyle: textStyle || 'defaultStyle',
			textValue: textValue || '',
			textFocus: !textValue,
			defaultTitle: title,  
		}
	},

	// Handler
	getRawData(){
		return _.extend({
			title: this.refs.title.value
		}, _.pick(this.state, 'imgURL', 'textStyle', 'textValue'))
	},
	handleShowImg:function(e){
		var windowURL = window.URL || window.webkitURL;
		var imgURL = windowURL.createObjectURL(this.refs.upLoadImg.files[0]);
		this.setState({
			imgURL:imgURL
		})
	},
	handleChangeStyle:function(newStyle){
		this.setState({
			textStyle: newStyle,
		})
	},
	handleFocus:function(){
		this.setState({
			textFocus:true
		})
	},
	handleBlur:function(e){
		if(e.target.value.toString().length>0){
			this.setState({
				textFocus:false
			})
		}
	},
	handleChangeText:function(e){
		this.setState({
			textValue:e.target.value
		})
	},
	handleDelete:function(e){
		e.preventDefault()
		e.stopPropagation()
		this.props.handleDelete(this.props.blockKey);
	},

	render: function(){
		return (
			<div className={styles.root} 
				onFocus={this.props.activateTusoCard} 
				onBlur={this.props.inactivateTusoCard}
				onMouseEnter={()=>{this.setState({showControl: true})}} 
				onMouseLeave={()=>{this.props.resetDragState();this.setState({showControl: false, draggable: false})}}
				onMouseDown={this.props.handleMouseDown}
				onMouseMove={this.props.handleMouseMove}
				onMouseUp={this.props.handleMouseUp}
				style={{
					top: this.props.dragTranslationY+this.props.baseDragTranslationY,
				}}
			>
				<div className='upLoadImg'>
					<input type='file' ref="upLoadImg" onChange={this.handleShowImg} className={this.state.imgURL?'upLoadInput':''}/>
					{!this.state.imgURL?<div className='addBt'><b></b><b></b></div>:null}
					{!this.state.imgURL?<p>上传图片</p>:null}
					<div className={this.state.imgURL?'loadImgShow':'loadImgShow loadImgHide'} style={{background:'url('+this.state.imgURL+') center'}}>
						<a>重新上传</a>
						<a onClick={()=>{this.props.handleSetBg(this.props.defaultData.imgURL)}}>设为背景</a>
						<div></div>
					</div>
				</div>
				<div className='upLoadText'>
					<div className='title'>
						<input type='text' ref='title' placeholder='输入随记标题' maxLength='5' defaultValue={this.state.defaultTitle}/>
					</div>
					<div className='content'>
						<p style={this.state.textFocus?{display:'none'}:{display:'block'}} className={this.state.textStyle}>{this.state.textValue}</p>
						<textarea maxLength='80' defaultValue={this.state.textValue} style={this.state.textFocus?{opacity:'1'}:{opacity:'0'}} ref='textarea' placeholder='输入随记内容' onChange={this.handleChangeText} onFocus={this.handleFocus} onBlur={this.handleBlur}></textarea>
					</div>
					<div className='textControl'>
						<i className="icon iconfont" onClick={this.handleChangeStyle.bind(this, 'defaultStyle')}>&#xe605;</i>
						<i className="icon iconfont" onClick={this.handleChangeStyle.bind(this, 'centerStyle')}>&#xe603;</i>
						<i className="icon iconfont" onClick={this.handleChangeStyle.bind(this, 'firstDown')}>&#xe60c;</i>
					</div>
				</div>
				<div className={this.state.showControl?'boxControl':'boxControlHide'}>
					<button>移动</button>
					<button onClick={this.handleDelete}>删除</button>
				</div>
			</div>
		)
	},
})

export default EditorDraggableHOC(UpLoad)