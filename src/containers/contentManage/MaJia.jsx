import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import _ from 'underscore'
import {
    Table,
    Icon,
    Button,
    DatePicker,
    Modal,
    Tabs,
    Popconfirm,
    message,
    Switch,
    InputNumber,

} from 'antd';
import styles from "./MaJia.less"
import moment from 'moment'
import TusoForm from '../../components/contentManage/TusoForm'
import ViewTuso from '../../components/contentManage/ViewTuso'
import {fetchUserTuso,deleteTuso,createTuso} from '../../actions/tuso'
import {uploadImageList} from '../../actions/image.js'
import FilterKeyword from '../../components/Common/FilterKeyword'
import EditTag from '../../components/contentManage/EditTag'
import {createPuppet,deletePuppet,resetPassword} from '../../actions/puppet'

const RangePicker = DatePicker.RangePicker;
const TabPane = Tabs.TabPane;
class MyComponent extends React.Component {
  constructor(props) {
      super(props)

      this.state = {
          selectedRowKeys: [], // 这里配置默认勾选列
          data:[],
          dateformat: [], //搜索mormat后的数据
          searchOleData:[],
          searchValue: "",
          viewVisible: false, //查看随记弹出框状态
          essayist: "", //数据需要改动，模态框的动态数据
          upLoadTusoList:[],//我的图说已上传的图片的列表
          startValue:null,//日期开始
          endValue:null,//日期结束
          searchToday:false,//查询今天数据
          tagTemp:"",//标签数据
          inputValue:"",
          pageSize:5,
          current:1,
          addNum:1//批量添加数据的条数
      }

  }
  componentDidMount(){
  }
  componentWillReceiveProps(nextProps){
    //配个ant勾选所以得key字段
   nextProps.data.map((items, index) => {
     items.key=index;
   })
    this.setState({data:nextProps.data.toJS(),dateformat:nextProps.data.toJS(),searchOleData:nextProps.data.toJS(),selectedRowKeys: [], loading: false})

  }
  /**
   * [batch delete]
   */
  start(deleteMap) {
     let selectKeyTemps=[];
      this.state.selectedRows.map((items, index) => {
        selectKeyTemps.push(items.id);
      })
      if(deleteMap){
        this.props.deletePuppet(selectKeyTemps,this.props.user.get('token'));

      }
      else{
        console.log(selectKeyTemps,this.state.inputValue);
      }
    }
  /**
   * [onSelectChange 勾选行时触发]
   * @param  {[int]} selectedRowKeys [和data的key对应]
   * @param  {[object]} selectedRows    [key对应的行object]
   */
  onSelectChange(selectedRowKeys,selectedRows) {
      this.setState({selectedRowKeys,selectedRows});
  }

  /**
   * 弹出层以及预览内容
   */
  //显示新增马甲号弹出框
  showModal(data) {
     this.setState({"addVisible":true})
  }
  //批量添加弹出框确定点击事件
  handleOk() {
    this.props.createPuppet(this.state.addNum,"pwd",this.props.user.get('token'));
 this.setState({"addVisible":false})
  }
  handleCancel(e) {
      this.setState({addVisible: false});
  }
  //编辑标签弹出框确定点击事件
  handleViewOk() {
      this.setState({viewVisible: false});
  }
  handleViewCancel(e) {
      this.setState({viewVisible: false});
  }
  // 删除单条记录
  handleDeleteConfirm(recod) {
    let selectKeyTemps=[];
    selectKeyTemps.push(recod.id);
    this.props.deletePuppet(selectKeyTemps,this.props.user.get('token'));
    message.success('删除成功');
  }
  handleDeleteCancel() {
  }
  // 状态更改
  handleChangeStatus(record){
    this.state.dateformat.map((items, index) => {
      if(record.id==items.id&&localStorage.getItem('puppetId')!=record.id){
        items.status=true;
        message.info(record.id+'马甲号在线中，您将以这个身份对图说及图说用户进行操作');
      }else{
        items.status=false;
      }
    })
    this.setState({dateformat: this.state.dateformat});
      localStorage.setItem('puppetId',record.id);

  }
  // 分页
handleChangePage(data) {
  // this.props.fetchAllTuso((data.current - 1) * this.state.pageSize, data.current * this.state.pageSize);
  this.setState({current: data.current})

}
handleShowSizeChange(current, pageSize){
this.setState({pageSize:pageSize})
}
onChangeAddNum(value){
  this.setState({"addNum":value})
}
// 标记标签
changeToken(record){
this.setState({viewVisible:true,tagTemp:record})
}
// 标签修改完成
editTagOK(value){
this.setState({inputValue:value})
console.log(this.state.inputValue);
}
render() {
    const {loading, selectedRowKeys} = this.state;
    const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange.bind(this)
    };
    const hasSelected = selectedRowKeys.length > 0;
      const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '10%',
            sorter: (a, b) => a.id - b.id

        },{
            title: '昵称',
            dataIndex: 'nickname',
            width: '20%',
            render: (text,record) =>{
                return <span>{"昵称"}</span>;
            }
        },
        //  {
        //     title: '标签',
        //     dataIndex: 'tag',
        //     width: '10%',
        //     render: (text,record) =>{
        //         return <span>{"标签"}</span>;
        //     }
        // },
        {
            title: '生成时间',
            dataIndex: 'user_create_at',
            width: '30%',
            sorter: (a, b) => (Date.parse(a.user_create_at) - Date.parse(b.user_create_at)) / 3600 / 1000,
            render: (text) =>{
                return <span>{moment(text).format('YYYY-MM-DD hh:mm:ss')}</span>;
            }
        }, {
            title: '状态',
            width: '20%',
            dataIndex: 'status',
            render: (text, record) =>
            {
                return     <Switch defaultChecked={false} checked={record.status} onChange={this.handleChangeStatus.bind(this,record)} />
                ;
            }
        }, {
            title: '操作',
            width: '10%',
            render: (text, record) => (
                <span>

                    <Popconfirm title="确定要删除这个任务吗？" onConfirm={this.handleDeleteConfirm.bind(this,record)} onCancel={this.handleDeleteCancel.bind(this)}>
                        <a href="#">删除</a>
                    </Popconfirm>
                    <span className="ant-divider"></span>
                    <a onClick={this.changeToken.bind(this, record)}>标记标签</a>
                </span>
            )
        }
    ];

    return (
        <div className={styles.root}>

            <div className="ant-layout-main">


                <div className="tab">


                  <div className="deleteBut">
                     <Button icon="plus" type="primary" onClick={this.showModal.bind(this)}>批量生成马甲号</Button>
                      <span className="addTuso">
                              <Popconfirm title="您是否要删除这些选中的马甲号？" onConfirm={this.start.bind(this,true)} onCancel={this.handleDeleteCancel.bind(this)}>
                                <Button icon="cross"  disabled={!hasSelected} loading={loading} type="primary">批量删除</Button>

                              </Popconfirm>
                      </span>
                      <Popconfirm title="您是否要标记这些选中的马甲号？" onConfirm={this.start.bind(this,false)} onCancel={this.handleDeleteCancel.bind(this)}>
                        <Button icon="tag-o"  disabled={!hasSelected} loading={loading} type="primary">批量标记</Button>

                      </Popconfirm>
                  </div>
                    <Tabs type="card">
                        <TabPane tab={this.props.selectMenuName} key="1">


                            <div className="ant-layout-container">
                              <Table rowSelection={rowSelection} onChange={this.handleChangePage.bind(this)} columns={columns} dataSource={this.state.dateformat} pagination={{
                                  pageSize: this.state.pageSize,
                                  current:this.state.current,
                                  showSizeChanger:true,
                                  onShowSizeChange:this.handleShowSizeChange.bind(this),
                                  pageSizeOptions:["5","10","15","20","30","40","50"]
                              }}/>
                            </div>
                        </TabPane>
                    </Tabs>
                    <Modal  title="批量添加马甲号" width="400px" wrapClassName="vertical-center-modal"
                        visible={this.state.addVisible} onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}>
                      <div>请输入所需生成的马甲号数量</div>
                      <br/>
                     <InputNumber style={{width:360}} min={1} max={10} defaultValue={this.state.addNum} onChange={this.onChangeAddNum.bind(this)} />
                    </Modal>
                    <Modal wrapClassName="vertical-center-modal viewEssay" visible={this.state.viewVisible} onOk={this.handleViewOk.bind(this)} footer={[]} onCancel={this.handleViewCancel.bind(this)}>
                        {
                          <EditTag {...this.props} tagTemp={this.state.tagTemp} editTagOK={this.editTagOK.bind(this)} handleViewCancel={this.handleViewCancel.bind(this)}></EditTag>
                        }
                    </Modal>

                </div>
            </div>

        </div>

    )
}
}

function mapStateToProps(state) {
    return {
          data:state.getIn(["puppet"]).get("list"),
    }
}

function mapDispatchToProps(dispatch) {
    return {
      createPuppet:bindActionCreators(createPuppet, dispatch),
        deletePuppet:bindActionCreators(deletePuppet, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)
