import React from 'react'
import styles from "./ViewTuso.less"
import moment from 'moment'
import ViewDiary from "./ViewDiary"

let rotateIndex = 0;//翻转次数
const ViewTuso = React.createClass({
    getInitialState:function(){
        return null
    },
    handleBodyClick: function() {
        this.props.handleViewCancel()
    },
    handleStopCancle: function(e) {
        e.stopPropagation();
    },
    imgDeal: function(url) {
        let img = new Image()
        img.src = url;
        if (img.width < img.height * 1.6) {
            return {width: "100%"}
        } else {
            return {height: "100%"}
        }
    },
    starred:function(){
      if(this.props.allTuso){
        this.props.starred();
      }
    },
    cancelPraise:function(){
        this.props.cancelPraise();
    },
    render: function() {
        return (
            <div className={styles.root} onClick={this.handleBodyClick}>
              <div className="bgBox" onClick={this.handleStopCancle}>
                  <div className="blur" style={{
                      backgroundImage: 'url('+this.props.essayist.modalViewImages[0].display_image.display_url+')'
                  }}>
                  <div className="photoWall">
                  {
                    this.props.essayist.modalViewImages.map((items, index) => {
                      return(
                     <div className="cardList" key={index}>
                       <ViewDiary viewStatus note={items.note} essayist={items.display_image.display_url}></ViewDiary>
                     </div>
                    )
                    })
                  }
                  </div>
                  </div>
                   <header>
                     <img src="http://ngs-children.oss-cn-shanghai.aliyuncs.com/data/photo_1.jpg"/>
                      <p>{this.props.essayist.user.nickname}</p>
                      <date>{moment(this.props.essayist.timestamp).format('MM月DD日')}</date>
                      <span>{this.props.allTuso&&this.props.essayist.user.location
                          ?
                          "|":this.props.essayist.user.location?
                        "|":""}</span>
                      <span>{this.props.allTuso&&this.props.essayist.user.location
                          ?
                          this.props.essayist.user.location.country+this.props.essayist.user.location.city+this.props.essayist.user.location.district
                          :this.props.essayist.user.location?
                          this.props.user.toJS().location.country+this.props.user.toJS().location.city+this.props.user.toJS().location.district
                          :""}</span>
                   </header>
                   <div className="photoWall">
                    {
                      this.props.essayist.modalViewImages.map((items, index) => {
                        return(
                      <div className="cardList" key={index}>
                         <ViewDiary viewStatus note={items.note} essayist={items.display_image.display_url}></ViewDiary>
                       </div>
                      )
                      })
                    }
                  </div>
                  <div className="viewFooter">
                    <a onClick={this.starred}><i className="iconfont icon-good"></i></a>
                    <span>{this.props.essayist.starred_count}人赞了该图说</span>
                    {this.props.allTuso?(<button onClick={this.cancelPraise}>取消</button>):null}
                  </div>
                </div>
            </div>
        )
    }
})

export default ViewTuso
