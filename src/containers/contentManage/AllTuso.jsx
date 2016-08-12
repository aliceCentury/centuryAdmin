import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import _ from 'underscore'
import {Table,Icon,Button,DatePicker,Modal,Tabs} from 'antd';
import styles from "./AllTuso.less"
import moment from 'moment'
import SearchInput from '../../components/Common/SearchInput'
import ViewTuso from '../../components/contentManage/ViewTuso'
import {fetchAllTuso,likeTuso,fetchTuso,dislikeTuso} from '../../actions/tuso'

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
          addVisible: false, //新增随记弹出框状态
          viewVisible: false, //查看随记弹出框状态
          viewStatus: false, //查看的随记是否需要翻转
          essayist: "", //数据需要改动，模态框的动态数据
          upLoadTusoList:[],//我的图说已上传的图片的列表
          startValue:null,//日期开始
          endValue:null,//日期结束
          searchToday:false,//查询今天数据
          pageSize:10,//每页显示的记录条数
          current:1,//所在的页码
          allCount:this.props.allCount//数据总条数
        }
    }
   componentDidMount() {
    this.props.fetchAllTuso((this.state.current-1)*this.state.pageSize, this.state.current*this.state.pageSize);
   }
   componentWillReceiveProps(nextProps) {
    this.setState({
      data:nextProps.data.toJS(),
      dateformat:nextProps.data.toJS(),
      searchOleData:nextProps.data.toJS(),
      allCount:nextProps.allCount
    })
    if(this.state.essayist.uuid){
      nextProps.data.map((items, index) => {
        if(items.uuid==this.state.essayist.uuid){
          this.setState({
            "essayist":{
              "modalViewImages":items.images,
              "user":items.user,
              "starred_count":items.starred_count,
              "timestamp":items.timestamp,
              "uuid":items.uuid
            }
          })
        }
      })
    }
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
    /*
     预览模态框显示
     */
    handleCancel(e) {
        this.setState({addVisible: false});
    }
    showViewModal(data, modalView) { //显示查看随记弹出框
        this.setState({
            viewVisible: true,
            viewStatus: data,
            "essayist":{
              "modalViewImages":modalView.images,
              "user":modalView.user,
              "starred_count":modalView.starred_count,
              "timestamp":modalView.timestamp,
              "uuid":modalView.uuid
            }
        });
    }
    handleViewOk() { //查看随记弹出框确定点击事件
        this.setState({viewVisible: false});
    }
    handleViewCancel(e) {
        this.setState({viewVisible: false});
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
//点赞
starred(){
  let that=this;
likeTuso(this.state.essayist.uuid,this.props.user.get('token'),function(uuid){
  that.props.fetchTuso(uuid,that.props.user.get('token'))
});
}
// 取消点赞
cancelPraise() {
  let that=this;
  dislikeTuso(this.state.essayist.uuid,this.props.user.get('token'),function(uuid){
  that.props.fetchTuso(uuid,that.props.user.get('token'))
});

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
                    img.src = text[0].display_image.display_url;
                    if (img.width <= img.height*1.6) {
                        imgWidth = {
                            width: "100%"
                        }
                    } else {
                        imgWidth = {
                            height: "100%"
                        }
                    }
                    return <a className="coverBox" onClick={this.showViewModal.bind(this, true, record)}><img src={text[0].display_image.display_url} style={imgWidth}/></a>
                }
            }, {
                title: '照片数量',
                dataIndex: 'photo_count',
                key: 'photo_count',
                width: '10%',
                sorter: (a, b) => a.photo_count - b.photo_count
            },{
                title: '点赞数量',
                dataIndex: 'starred_count',
                key: 'starred_count',
                width: '10%',
                sorter: (a, b) => a.starred_count - b.starred_count
            }, {
                title: '发布时间',
                dataIndex: 'timestamp',
                key: 'timestamp',
                width: '13%',
                sorter: (a, b) => (Date.parse(a.timestamp) - Date.parse(b.timestamp)) / 3600 / 1000,
                render: (text) => <span>
                        {moment(text).format('YYYY-MM-DD hh:mm:ss')}</span>
            }, {
                title: '发布人ID',
                dataIndex: 'user',
                key: 'user',
                width: '10%',
                render: (text) => <span>{text.id}</span>
            }, {
                title: '发布人昵称',
                dataIndex: 'user.nickname',
                key: 'user.nickname',
                width: '13%',
                render: (text) => <span>{text}</span>
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
                                  <span className="searchBox"><Button type="primary" onClick={this.handleSerchToday.bind(this)}>{this.state.searchToday?"查询所有":"查询今天"}</Button></span>
                                </div>
                                <div className="ant-layout-container">
                                    <Table onChange={this.handleChangePage.bind(this)}
                                      columns={columns}
                                      dataSource={this.state.dateformat}
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
                <Modal
                  wrapClassName="vertical-center-modal viewEssay"
                  visible={this.state.viewVisible}
                  onOk={this.handleViewOk.bind(this)}
                  footer={[]}
                  onCancel={this.handleViewCancel.bind(this)}>
                 <ViewTuso
                   allTuso
                   starred={this.starred.bind(this)}
                   cancelPraise={this.cancelPraise.bind(this)}
                   viewStatus={this.state.viewStatus}
                   essayist={this.state.essayist}
                   handleViewCancel={this.handleViewCancel.bind(this)}></ViewTuso>
               </Modal>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        data:state.getIn(["tuso"]).get("all"),
        allCount:state.getIn(["tuso"]).get("allCount"),
  }
}

function mapDispatchToProps(dispatch) {
    return {
      fetchAllTuso: bindActionCreators(fetchAllTuso, dispatch),
      // likeTuso:bindActionCreators(likeTuso, dispatch),
      fetchTuso:bindActionCreators(fetchTuso, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)
