import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import _ from 'underscore'
import {Table,Icon,Button,DatePicker,Modal,Tabs} from 'antd';
import styles from "./WeChat.less"
import moment from 'moment'
import SearchInput from './../../../components/Common/SearchInput'


const RangePicker = DatePicker.RangePicker;
const TabPane = Tabs.TabPane;
class MyComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          data:[],
          dateformat: [], //搜索mormat后的数据
          searchOleData:[],
          searchValue: "",
          startValue:null,//日期开始
          endValue:null,//日期结束
          searchToday:false,//查询今天数据
          pageSize:10,//每页显示的记录条数
          current:1,//所在的页码
          allCount:this.props.allCount//数据总条数
        }
    }
   componentDidMount() {

       }
   componentWillReceiveProps(nextProps) {
    // this.setState({
    //   data:nextProps.data.toJS(),
    //   dateformat:nextProps.data.toJS(),
    //   searchOleData:nextProps.data.toJS(),
    //   allCount:nextProps.allCount
    // })
    // if(this.state.essayist.uuid){
    //   nextProps.data.map((items, index) => {
    //     if(items.uuid==this.state.essayist.uuid){
    //       this.setState({
    //         "essayist":{
    //           "modalViewImages":items.images,
    //           "user":items.user,
    //           "starred_count":items.starred_count,
    //           "timestamp":items.timestamp,
    //           "uuid":items.uuid
    //         }
    //       })
    //     }
    //   })
    // }
    }
    // 选择日期后重新渲染数据
    onDateChange(value) {
          let dataTemp = [];
          if (value[0] == null && value[1] == null) {
                dataTemp = this.state.data;
                this.setState({startValue: "",endValue:""})
           } else {
              this.setState({startValue: value[0],endValue:value[1]})
                this.state.data.map((items, index) => {
                    if (Date.parse(value[0]) < Date.parse(items.timestamp) && Date.parse(items.timestamp) < Date.parse(value[1])) {
                        dataTemp.push(items);
                    }
                })
          }

        this.setState({dateformat: dataTemp,searchOleData:dataTemp,searchToday:false,current: 1})
    }

    // 查询今天日期对照的记录
handleSerchToday() {
    let todayMorning = new Date();
    let todayEvening = new Date();
    if (this.state.searchToday) {
        todayMorning = null;
        todayEvening = null;
    } else {
        todayMorning.setHours(0, 0, 0);
        todayEvening.setHours(23, 59, 59);
    }
    this.onDateChange([todayMorning, todayEvening])
    this.setState({
        searchToday: !this.state.searchToday,
        current: 1
    })
}
// 点击页数
handleChangePage(data) {
    this.props.fetchAllTuso((data.current - 1) * this.state.pageSize, data.current * this.state.pageSize);
    this.setState({current: data.current})
}
// 每页显示的条数发生变化
handleShowSizeChange(current, pageSize){
  this.setState({pageSize:pageSize})
}



    render() {
      // 列数字段
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                width: '5%',
                sorter: (a, b) => a.id - b.id

            }, {
                title: '封面',
                dataIndex: 'images',
                key: 'images',
                width: '15%',
                render: (text,record) => {
                    let img = new Image();
                    let imgWidth;
                    img.src ="http://aliceblog.oss-cn-hangzhou.aliyuncs.com/img/menu6.png";
                    if (img.width <= img.height*1.6) {
                        imgWidth = {
                            width: "100%"
                        }
                    } else {
                        imgWidth = {
                            height: "100%"
                        }
                    }
                    return <a className="coverBox"><img src="http://aliceblog.oss-cn-hangzhou.aliyuncs.com/img/menu6.png" style={imgWidth}/></a>
                }
            }, {
                dataIndex: '活动名称',
                key: 'name',
                width: '10%'
            },{
                title: '活动链接',
                dataIndex: 'url',
                key: 'url',
                width: '10%',
                sorter: (a, b) => a.starred_count - b.starred_count
            }, {
                title: '开始时间',
                dataIndex: 'timestamp',
                key: 'timestamp',
                width: '13%',
                sorter: (a, b) => (Date.parse(a.timestamp) - Date.parse(b.timestamp)) / 3600 / 1000,
                render: (text) => <span>
                        {"2016-6-6"
                          // moment(text).format('YYYY-MM-DD hh:mm:ss')
                        }</span>
            }, {
                title: '结束时间',
                dataIndex: 'user',
                key: 'user',
                width: '10%',
                render: (text) => <span>{"2017-11-20"}</span>
            }, {
                title: '状态',
                dataIndex: 'user.nickname',
                key: 'user.nickname',
                width: '13%',
                render: (text) => <span>{"进行中"}</span>
            }
        ];
        return (
            <div className={styles.root}>
                <div className="ant-layout-main">
                    <div className="tab">
                        <Tabs type="card">
                            <TabPane tab={this.props.selectMenuName} key="1">
                                <div className="inputBox">
                                  <RangePicker value={[this.state.startValue,this.state.endValue]} showTime format="yyyy/MM/dd HH:mm:ss" onChange={this.onDateChange.bind(this)}/>
                                </div>
                                <div className="ant-layout-container">
                                    <Table onChange={this.handleChangePage.bind(this)}
                                      columns={columns}
                                      dataSource={this.props.data}
                                      pagination={{
                                        pageSize: this.state.pageSize,
                                        total:this.state.allCount,
                                        current:this.state.current,
                                        showSizeChanger:true,
                                        onShowSizeChange:this.handleShowSizeChange.bind(this),
                                        pageSizeOptions:["5","10","15","20","30","40","50"]
                                    }}/>
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        data: [{
  key: '1',
  id:1,
  name:"中秋月饼大比拼",
  url:"www.baidu.com"
}, {
  key: '2',
id:2,
name:"天上掉下中介费",
url:"www.baidu.com"
}, {
  key: '3',
  id:3,
  name:"好友助力领红包",
  url:"www.sina.com"
}],

  }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)
