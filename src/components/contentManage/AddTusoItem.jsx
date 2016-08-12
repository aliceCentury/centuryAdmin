import React from 'react'
import styles from "./AddTusoItem.less"
import AddTuso from './AddTuso'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'



const AddTusoItem = React.createClass({
    getInitialState:function(){
        return null
    },
    
    render: function() {
        return (
            <div className={styles.root}>
                {
                    this.props.tusoCardList.map((card,i)=>{
                        return <AddTuso 
                                type='addTuso' 
                                key={card.id}
                                index={i}
                                id={card.id}
                                moveCard={this.props.moveCard}
                                {...this.props}

                                ></AddTuso>
                    })
                }
            </div>
        )
    }
})


module.exports = DragDropContext(HTML5Backend)(AddTusoItem)