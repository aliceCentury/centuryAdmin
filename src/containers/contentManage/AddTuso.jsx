import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import _ from 'underscore'
import update from 'react/lib/update'
import {push} from 'redux-router'
import {
    Table,
    Icon,
    Button,
    DatePicker,
    Modal,
    Tabs,
    Popconfirm,
    message
} from 'antd';
import styles from "./AddTuso.less"
import moment from 'moment'
import SearchInput from '../../components/Common/SearchInput'
import AddTusoItem from '../../components/contentManage/AddTusoItem'
// import AddEssayist from '../../components/contentManage/AddEssayist'
import ViewTuso from '../../components/contentManage/ViewTuso'
import {fetchUserTuso,deleteTuso} from '../../actions/tuso'
import {uploadImageList} from '../../actions/image.js'
import { ALIGN_LEFT,ALIGN_CENTER,ALIGN_RIGHT } from '../../actions/handnote.js'
import {createTuso} from '../../actions/tuso.js'

const RangePicker = DatePicker.RangePicker;
const TabPane = Tabs.TabPane;

function createTusoCardId(arr){
    let ran = Math.floor(Math.random()*100)*arr.length;
    arr.map((item)=>{
        if(ran==item.id){
            createTusoCardId(arr)
        }
    })
    return ran
}

let ModalSuccess = '';//存储上传成功对话框，用于删除！

class MyComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [], // 这里配置默认勾选列
            loading: false,
            data: this.props.data.toJS(),
            dateformat: this.props.data, //搜索mormat后的数据
            searchValue: "",
            addVisible: false, //新增随记弹出框状态
            viewVisible: false, //查看随记弹出框状态
            viewStatus: false, //查看的随记是否需要翻转
            essayist: "", //数据需要改动，模态框的动态数据
            upLoadTusoList:[],//我的图说已上传的图片的列表
            tusoCardList:[{
                id:Math.floor(Math.random()*100),
                url:'',
                title:'',
                content:'',
                textAlign:''
            }]
        }

    }
    componentDidMount(){
    this.props.fetchUserTuso(this.props.user.get('uuid'),this.props.user.get('token'));

    }

    componentWillReceiveProps(nextProps){

      this.setState({data:nextProps.data.toJS(),dateformat:nextProps.data.toJS(),selectedRowKeys: [], loading: false})

    }
    start() {
        this.setState({loading: true});
        // 模拟 ajax 请求，完成后清空
        // setTimeout(() => {
        //     this.setState({selectedRowKeys: [], loading: false});
        // }, 1000);
        let selectKeyTemps=[];
        this.state.selectedRowKeys.map((items, index) => {
          selectKeyTemps.push(this.state.dateformat.get(items).uuid);
        })
        this.props.deleteTuso(selectKeyTemps,JSON.parse(localStorage.user).token);
        this.setState({selectedRowKeys: [], loading: false});
    }
    onSelectChange(selectedRowKeys) {
        // console.log( 'selectedRowKeys changed: ', selectedRowKeys);
        // console.log(selectedRowKeys);

        this.setState({selectedRowKeys});
    }
    onDateChange(value, dateString) {
        let dataTemp = [];
        {
            if (value[0] == null && value[1] == null) {
                dataTemp = this.props.data
            } else {
                this.state.data.map((items, index) => {

                    if (Date.parse(value[0]) < Date.parse(items.date) && Date.parse(items.date) < Date.parse(value[1])) {
                        dataTemp.push(items);
                    }

                })
            }
        }
        this.setState({data: dataTemp, dateformat: dataTemp})

    }
    handleModify(record) {
        alert("修改");
    }
    handleDelete(record) {
        alert("删除");
    }
    handleSerch(value) {
        let dataTemp = [];
        {
            if (value == "") {
                dataTemp = this.state.dateformat
            } else {
                this.state.data.map((items, index) => {
                    if (items.title.indexOf(value) != -1) {
                        dataTemp.push(items);
                    }

                })
            }
        }
        this.setState({data: dataTemp, searchValue: value})
    }
    imgDeal(url) {
        let img = new Image()
        img.src = url;
        if (img.width <= img.height) {
            return {width: "100%"}
        } else {
            return {height: "100%"}
        }

    }
    showModal(data) { //显示新增随记弹出框
        // console.log(data);
        this.setState({addVisible: true});
    }
    handleOk() { //新增随记弹出框确定点击事件
        if(this.state.upLoadTusoList.length!=0){//检测是否有图片，至少一张才可以保存
            this.setState({addVisible: false});
            uploadImageList(this.state.upLoadTusoList,this.props.user.toJS().token);
        }else{
            alert('请上传至少一张图片!');
        }
    }
    handleCancel(e) {
        this.setState({addVisible: false});
    }
    showViewModal(data, modalView) { //显示查看随记弹出框
        // console.log(modalView);
        this.setState({
            viewVisible: true,
            viewStatus: data,
            "essayist": {
                imgUrl: modalView.url,
                title: modalView.title,
                content: modalView.title
            }
        });
    }
    handleViewOk() { //查看随记弹出框确定点击事件
        this.setState({viewVisible: false});
    }
    handleViewCancel(e) {
        this.setState({viewVisible: false});
    }
    handleDeleteConfirm(recod) {
      let selectKeyTemps=[];
      selectKeyTemps.push(recod.uuid);
      this.props.deleteTuso(selectKeyTemps,JSON.parse(localStorage.user).token);
      message.success('删除成功');
    }
    handleDeleteCancel() {
        // message.error('点击了取消');
    }
    handleSerchToday(){
       alert("search today");
    }
    changeUpLoadTusoList(arr){//更新上传的图片列表
        this.setState({
            upLoadTusoList:arr
        })
    }
    handleAddTuso(){
        if(this.state.tusoCardList.length<9){
            this.setState({
                tusoCardList:this.state.tusoCardList.concat({
                    id:createTusoCardId(this.state.tusoCardList),
                    url:'',
                    title:'',
                    content:'',
                    textAlign:''
                })
            })
        }
    }
    handleDeleteTuso(id){
        let tusoCardList = this.state.tusoCardList;
        if(tusoCardList.length>1){
            tusoCardList.map((item,index)=>{
                if(item.id == id){
                    tusoCardList.splice(index,1);
                }
            })
        }
        this.setState({
            tusoCardList
        })
    }
    moveCard(dragIndex, hoverIndex) {
      const { tusoCardList } = this.state;
      const dragCard = tusoCardList[dragIndex];

      this.setState(update(this.state, {
        tusoCardList: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard]
          ]
        }
      }))
    }
    handleChangeCardContent(id,url,title,content,textAlign){
        let tusoCardList = this.state.tusoCardList;
        tusoCardList.map((item,index)=>{
            if(item.id == id){
                item.url = url;
                item.title = title;
                item.content = content;
                item.textAlign = textAlign;
            }
        })
        this.setState({
            tusoCardList
        })
    }
    handleSave(){
        let tusoCardList = this.state.tusoCardList;
        let saveArr = [];
        let imageList = [];
        let canSave = true;
        let token = this.props.user.toJS().token;
        tusoCardList.map((item,index)=>{
            if(item.url==''){
                message.error('请上传图片!');
                canSave = false;
            }
            if(item.title==''&&item.content!=''){
                message.error('随记必须有标题!');
                canSave = false;
            }
            let textAlign = '';
            switch(item.textAlign){
                case 'left':
                    textAlign = ALIGN_LEFT;
                    break;
                case 'center':
                    textAlign = ALIGN_CENTER;
                    break;
                case 'firstDown':
                    textAlign = ALIGN_RIGHT;
                    break;
            }
            saveArr.push({
                image:item.url,
                handnote:{
                    title:item.title,
                    content:item.content,
                    textAlign
                }
            })
            imageList.push(item.url)
        })

        if(canSave){
            uploadImageList(imageList,token).then((uuid)=>{
                uuid.map((item,index)=>{
                    saveArr[index].image = item.uuid
                })
                saveArr.map((items,i)=>{
                    if(items.handnote.title==''){
                        delete saveArr[i].handnote
                    }
                })
                this.props.createTuso(saveArr,this.props.user.toJS().token).then((data)=>{
                    if(data.type == "CREATE_TOSU_SUCCESS"){
                        ModalSuccess = Modal.success({
                            title: '你的图说已经成功发布',
                            content:(
                              <div>
                                <Button type="primary" onClick={this.viewTuso.bind(this)}>查看图说</Button>
                                <Button type="primary" onClick={this.continueAdd.bind(this)}>继续发布新图说</Button>
                              </div>
                            ),
                            className:'createSuccess',
                            visible:false,
                        });
                    }
                })
            })
        }
    }
    continueAdd(){
        ModalSuccess.destroy();
        this.setState({
            tusoCardList:[{
                id:Math.floor(Math.random()*100),
                url:'',
                title:'',
                content:'',
                textAlign:''
            }]
        })
    }
    viewTuso(){
        ModalSuccess.destroy();
        this.props.push("/contentManage/tuso/my");
    }
    render() {
        const {loading, selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange.bind(this)
        };
        const hasSelected = selectedRowKeys.length > 0;

        // 发布时间  图说数量  操作（查看｜修改｜删除）
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
                    img.src = text;
                    if (img.width <= img.height) {
                        imgWidth = {
                            width: "100%"
                        }
                    } else {
                        imgWidth = {
                            height: "100%"
                        }
                    }
                    return <a onClick={this.showViewModal.bind(this, true, record)} className="coverBox"><img src={text[0].display_image.display_url} style={imgWidth}/></a>
                }

            }, {
                title: '照片数量',
                dataIndex: 'photo_count',
                key: 'photo_count',
                width: '20%',
                sorter: (a, b) => a.photoNum - b.photoNum,
                render: (text) => <span>{text}</span>
            },{
                title: '点赞数量',
                dataIndex: 'starred_count',
                key: 'starred_count',
                width: '20%',
                sorter: (a, b) => a.likeNum - b.likeNum,
                render: (text) => <span>{text}</span>
            }, {
                title: '发布时间',
                dataIndex: 'timestamp',
                key: 'timestamp',
                width: '20%',
                sorter: (a, b) => (Date.parse(a.date) - Date.parse(b.date)) / 3600 / 1000,
                render: (text) => <span>
                        {moment(text).format('YY-MM-DD h:mm:ss')}</span>
            }, {
                title: '操作',
                key: 'operation',
                width: '12%',
                render: (text, record) => (
                    <span>
                        <a onClick={this.showViewModal.bind(this, true, record)}>查看</a>

                        <span className="ant-divider"></span>
                        <Popconfirm title="确定要删除这个任务吗？" onConfirm={this.handleDeleteConfirm.bind(this,record)} onCancel={this.handleDeleteCancel.bind(this)}>
                            <a href="#">删除</a>
                        </Popconfirm>

                    </span>
                )
            }
        ];
        return (

            <div className={styles.root}>
                <div className="ant-layout-main">
                    <div className="tab">
                        <div className='controlBt'>
                            <Button type="primary" onClick={this.handleAddTuso.bind(this)} disabled={this.state.tusoCardList.length<9?false:true}>增加图片或随机</Button>
                            <Button type="primary" onClick={this.handleSave.bind(this)}>发布</Button>
                        </div>
                        <Tabs type="card">
                            <TabPane tab={this.props.selectMenuName} key="1">

                                <div className="ant-layout-container">
                                    <AddTusoItem tusoCardList={this.state.tusoCardList} handleDeleteTuso={this.handleDeleteTuso.bind(this)} moveCard={this.moveCard.bind(this)} handleChangeCardContent={this.handleChangeCardContent.bind(this)}></AddTusoItem>
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
    // 图说UUID  评论数量  点赞数量  照片数量  发布时间
    return {
        "essayist": {
            imgUrl: 'http://ngs-children.oss-cn-shanghai.aliyuncs.com/data/photo_1.jpg',
            title: '阿斯顿卡拉胶开了哈',
            content: '啊对方厉害的空间啊哈发的撒卡就好啊是快递发货ask 家好 '
        },
        data:state.getIn(["tuso"]).get("mine"),
        user: state.getIn(["user"])
    }
}

function mapDispatchToProps(dispatch) {
    return {
        push: bindActionCreators(push, dispatch),
        fetchUserTuso: bindActionCreators(fetchUserTuso, dispatch),
        deleteTuso: bindActionCreators(deleteTuso, dispatch),
        createTuso: bindActionCreators(createTuso, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)
