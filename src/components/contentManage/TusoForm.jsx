import React from 'react'
import styles from "./TusoForm.less"
import update from 'react/lib/update'
import { DragDropContext } from 'react-dnd'
import { message } from 'antd';
import HTML5Backend from 'react-dnd-html5-backend'
import Card from './TusoCard'

const TUSO_NUM=9
function randomId(constant,arr){//生成唯一id
  let ram = constant+Math.floor(Math.random()*99+1);
  arr.map((item)=>{
    if(item.id == ram){
      randomId(arr)
    }
  })
  return ram
}

const ViewDiary = React.createClass({
    getInitialState:function(){
        return {
          cardList:[],
          fileList:[]
        }
    },
    handleChange:function(e){
      let windowURL = window.URL || window.webkitURL;
      let imgURL = [];
      let cardArr = this.state.cardList;
      let fileArr = this.state.fileList;
      let files = e.target.files;

      if(files.length >TUSO_NUM -cardArr.length){
        message.error(`您最多还可以上传${TUSO_NUM-cardArr.length}张图片，请重新选择！`);
      }else{
        for(var i=0;i<files.length;i++){
          imgURL.push({
            id:randomId(windowURL.createObjectURL(files[i]),this.state.cardList),//生成唯一id
            url:windowURL.createObjectURL(files[i])
          })
          fileArr.push(files[i])
        }
      }

      cardArr = cardArr.concat(imgURL);
      if(this.state.cardList.length<9){
        this.setState({
          cardList:cardArr,
          fileList:fileArr
        })
      }
      e.target.value = '';
      this.props.changeUpLoadTusoList(fileArr)//传递最新的上传列表，用于保存时验证是否上传图片
    },
    handleDelete:function(id){
      let cardArr = this.state.cardList;
      cardArr.map((item,index)=>{
        if(item.id == id){
          cardArr.splice(index,1);
        }
      })
      this.setState({
        cardList:cardArr
      })
      this.props.changeUpLoadTusoList(cardArr)
    },
    moveCard:function(dragIndex, hoverIndex) {
      const { cardList } = this.state;
      const dragCard = cardList[dragIndex];

      this.setState(update(this.state, {
        cardList: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard]
          ]
        }
      }))
    },
    render: function() {
        const cardList = this.state.cardList;

        return (
            <div className={styles.root}>
                <div className='addBt' style={this.state.cardList.length<9?{display:'block'}:{display:'none'}}>
                  <span>+</span>
                  <input type='file' multiple onChange={this.handleChange} accept='image/jpeg,image/png,image/jpg'/>
                </div>
                {cardList.map((card, i) => {
                  return (
                    <Card key={card.id}
                          index={i}
                          id={card.id}
                          url={card.url}
                          moveCard={this.moveCard}
                          handleDelete={this.handleDelete}/>
                  );
                })}
            </div>
        )
    }
})


module.exports = DragDropContext(HTML5Backend)(ViewDiary)
