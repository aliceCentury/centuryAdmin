import React from 'react'
import styles from "./TusoCard.less"
var DragSource = require('react-dnd').DragSource
var DropTarget = require('react-dnd').DropTarget
var flow = require('lodash/flow')

let rotateIndex = 0;//翻转次数

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


const TusoCard = React.createClass({
  render:function(){
    const {connectDragSource,connectDropTarget} = this.props;
    return connectDragSource(connectDropTarget(
      <div className={styles.root} style={{background:'url('+this.props.url+') center'}}>
            <p onClick={this.props.handleDelete.bind(null,this.props.id)}>X</p>
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
)(TusoCard)