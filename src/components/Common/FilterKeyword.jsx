import React from 'react'
import {push} from 'redux-router'
import {Input, Button} from 'antd';
import SearchInput from "./SearchInput"
const InputGroup = Input.Group;

/**
 * 过滤关键字组件
 * 对需要过滤的数据根据搜索框的内容进行过滤
 * 调用组件时需要的属性：
 * handleFilter:function 接受新的数据
 * data:[]需要过滤的数据
 * field:[]需要过滤的字段（必须为data中的key）
 */
class MyComponent extends React.Component {
    constructor(props) {
        super(props)
    }
/**
 * [搜索时对数据进行过滤]
 * @param  {[string]} value [搜索框的值]
 * @return {[formatData]}       [过滤后的值返回到父组件的handleFilter函数中]
 */
    handleSearch(value) {
        let dataTemp = [];
        this.props.data.map((dataItems, dataIndex) => {
            this.props.field.map((fieldItems, fieldIndex) => {
                let hasData = false;
                if ((dataItems[fieldItems] + '').indexOf(value) != -1) {
                    dataTemp.map((items, index) => {
                        if (items.id == dataItems.id) {
                            hasData = true;
                        }
                    })
                    if (!hasData) {
                        dataTemp.push(dataItems)
                    }
                }
            })
        })
        this.props.handleFilter(dataTemp, value);
    }

    render() {
        return (
            <span >
                <SearchInput placeholder="输入关键字进行搜索" onSearch={this.handleSearch.bind(this)} style={{ width: 200}}/>
            </span>
        )
    }

}

export default MyComponent
