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
    Tabs
} from 'antd';
import styles from "./AllDiary.less"
import moment from 'moment'
import SearchInput from '../../components/Common/SearchInput'

import ViewDiary from '../../components/contentManage/ViewDiary'


const RangePicker = DatePicker.RangePicker;
const TabPane = Tabs.TabPane;
class MyComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [], // 这里配置默认勾选列
            loading: false,
            data: this.props.data,
            dateformat: this.props.data,
            searchValue: "",
            viewVisible: false, //查看随记弹出框状态
            viewStatus: false, //查看的随记是否需要翻转
            essayist: this.props.essayist
        }

    }


    start() {
        this.setState({loading: true});
        // 模拟 ajax 请求，完成后清空
        setTimeout(() => {
            this.setState({selectedRowKeys: [], loading: false});
        }, 1000);
    }
    onSelectChange(selectedRowKeys) {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({selectedRowKeys});
    }
    // 选择日期后重新渲染数据
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
    // 图片大小处理
    imgDeal(url) {
        let img = new Image()
        img.src = url;
        if (img.width < img.height * 1.6) {
            return {width: "100%"}
        } else {
            return {height: "100%"}
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
    handleSerchToday(){
       alert("search today");
    }
    render() {
        // console.log(this);

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
                dataIndex: 'url',
                key: 'url',
                width: '15%',
                render: (text) => {
                    let img = new Image();
                    let imgWidth;
                    img.src = text;
                    if (img.width < img.height * 1.5) {
                        imgWidth = {
                            width: "100%"
                        }
                    } else {
                        imgWidth = {
                            height: "100%"
                        }
                    }
                    return <div className="coverBox"><img src={text} style={imgWidth}/></div>
                }

            }, {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                width: '20%',
                sorter: (a, b) => a.title.length - b.id.length,
                render: (text, record) => {
                    if (text.indexOf(this.state.searchValue) >= 0 && this.state.searchValue != "") {
                        return <a onClick={this.showViewModal.bind(this, true, record)}>
                            {text.split(this.state.searchValue)[0]}
                            <span style={{
                                color: "red"
                            }}>{this.state.searchValue}</span>
                            {text.split(this.state.searchValue)[1]}</a>;
                    }
                    return <a onClick={this.showViewModal.bind(this, true, record)}>{text}</a>;
                }

            }, {
                title: '照片数量',
                dataIndex: 'photoNum',
                key: 'photoNum',
                width: '10%',
                sorter: (a, b) => a.photoNum - b.photoNum
            }, {
                title: '评论数量 ',
                dataIndex: 'commentNum',
                key: 'commentNum',
                width: '10%',
                sorter: (a, b) => a.commentNum - b.commentNum
            }, {
                title: '点赞数量',
                dataIndex: 'likeNum',
                key: 'likeNum',
                width: '10%',
                sorter: (a, b) => a.likeNum - b.likeNum
            }, {
                title: '发布时间',
                dataIndex: 'date',
                key: 'date',
                width: '13%',
                sorter: (a, b) => (Date.parse(a.date) - Date.parse(b.date)) / 3600 / 1000,

                render: (text) => <span>
                        {moment(text).format('YY-MM-DD h:mm:ss')}</span>
            }, {
                title: '发布人ID',
                dataIndex: 'releaseId',
                key: 'releaseId',
                width: '10%'
            }, {
                title: '发布人名称',
                dataIndex: 'releaseName',
                key: 'releaseName',
                width: '13%'
            }
        ];
        return (

            <div className={styles.root}>
                <div className="ant-layout-main">
                    <div className="tab">
                        <Tabs type="card">
                            <TabPane tab={this.props.selectMenuName} key="1">

                                <div className="inputBox">
                                    <RangePicker showTime format="yyyy/MM/dd HH:mm:ss" onChange={this.onDateChange.bind(this)}/>
                                    <span className="searchBox"><SearchInput placeholder="搜索图说" onSearch={this.handleSerch.bind(this)} style={{
                width: 200
            }}/></span>
          <Button type="primary" onClick={this.handleSerchToday.bind(this)}>查询今天</Button>
                                </div>

                                <div className="ant-layout-container">
                                    <Table columns={columns} dataSource={this.state.data} pagination={{
                                        pageSize: 10
                                    }}/>
                                </div>

                            </TabPane>

                        </Tabs>
                    </div>

                </div>

                <Modal
    		        	wrapClassName="vertical-center-modal"
    		        	visible={this.state.viewVisible}
    		          	onOk={this.handleViewOk.bind(this)}
    		          	onCancel={this.handleViewCancel.bind(this)}>
    		          <ViewDiary viewStatus={this.state.viewStatus} essayist={this.state.essayist}></ViewDiary>
    		        </Modal>
            </div>

        )
    }
}

function mapStateToProps(state) {
    // 图说UUID  评论数量  点赞数量  照片数量  发布时间
    return {
        "data": [
            {
                key: '1',
                id: 1,
                photoNum: 20,
                commentNum: 220,
                likeNum: 10,
                date: "2016-06-03T15:34:09.238Z",
                url: "http://ngs-children.oss-cn-shanghai.aliyuncs.com/data/photo_1.jpg",
                title: "再或者感叹号！",
                releaseId: "12345",
                releaseName: "姓名"
            }, {
                key: '2',
                id: 2,
                photoNum: 20,
                commentNum: 220,
                likeNum: 10,
                date: "2016-06-14T13:34:09.238Z",
                url: "http://ngs-children.oss-cn-shanghai.aliyuncs.com/data/photo_2.jpg",
                title: "我会飞，不代表我是一只鸟",
                releaseId: 12345,
                releaseName: "姓名"
            }, {
                key: '3',
                id: 3,
                photoNum: 20,
                commentNum: 220,
                likeNum: 10,
                date: "2016-06-12T13:34:09.238Z",
                url: "http://ngs-children.oss-cn-shanghai.aliyuncs.com/data/photo_2.jpg",
                title: "智能家居起航",
                releaseId: 12345,
                releaseName: "姓名"
            }, {
                key: '4',
                id: 4,
                photoNum: 20,
                commentNum: 220,
                likeNum: 10,
                date: "2016-06-02T13:34:09.238Z",
                url: "http://ngs-children.oss-cn-shanghai.aliyuncs.com/data/photo_1.jpg",
                title: "邮箱的秘密",
                releaseId: 12345,
                releaseName: "姓名"
            }, {
                key: '5',
                id: 5,
                photoNum: 20,
                commentNum: 220,
                likeNum: 10,
                date: "2016-06-10T13:34:09.238Z",
                url: "http://ngs-children.oss-cn-shanghai.aliyuncs.com/data/photo_1.jpg",
                title: "并不知道该如何如何",
                releaseId: 12345,
                releaseName: "姓名"
            }, {
                key: '6',
                id: 6,
                photoNum: 20,
                commentNum: 220,
                likeNum: 10,
                date: "2016-07-03T13:34:09.238Z",
                url: "http://ngs-children.oss-cn-shanghai.aliyuncs.com/data/photo_1.jpg",
                title: "还有一些数据",
                releaseId: 12345,
                releaseName: "姓名"
            }, {
                key: '7',
                id: 7,
                photoNum: 20,
                commentNum: 220,
                likeNum: 10,
                date: "2016-08-03T13:34:09.238Z",
                url: "http://ngs-children.oss-cn-shanghai.aliyuncs.com/data/photo_1.jpg",
                title: "百度外卖送给您",
                releaseId: 12345,
                releaseName: "姓名"
            }, {
                key: '8',
                id: 8,
                photoNum: 20,
                commentNum: 220,
                likeNum: 10,
                date: "2016-03-03T13:34:09.238Z",
                url: "http://ngs-children.oss-cn-shanghai.aliyuncs.com/data/photo_1.jpg",
                title: "回忆只是曾经",
                releaseId: 12345,
                releaseName: "姓名"
            }, {
                key: '9',
                id: 9,
                photoNum: 20,
                commentNum: 220,
                likeNum: 10,
                date: "2016-09-03T13:34:09.238Z",
                url: "http://ngs-children.oss-cn-shanghai.aliyuncs.com/data/photo_1.jpg",
                title: "一个椰子的故事",
                releaseId: 12345,
                releaseName: "姓名"
            }, {
                key: '10',
                id: 10,
                photoNum: 20,
                commentNum: 220,
                likeNum: 10,
                date: "2016-01-03T13:34:09.238Z",
                url: "http://ngs-children.oss-cn-shanghai.aliyuncs.com/data/photo_1.jpg",
                title: "水蜜桃般的米",
                releaseId: 12345,
                releaseName: "姓名"
            }, {
                key: '11',
                id: 11,
                photoNum: 20,
                commentNum: 220,
                likeNum: 10,
                date: "2016-01-03T13:34:09.238Z",
                url: "http://ngs-children.oss-cn-shanghai.aliyuncs.com/data/photo_1.jpg",
                title: "王老吉也不错",
                releaseId: 12345,
                releaseName: "姓名"
            }, {
                key: '12',
                id: 12,
                photoNum: 20,
                commentNum: 220,
                likeNum: 10,
                date: "2016-02-03T13:34:09.238Z",
                url: "http://ngs-children.oss-cn-shanghai.aliyuncs.com/data/photo_1.jpg",
                title: "代码君很听话",
                releaseId: 12345,
                releaseName: "姓名"
            }, {
                key: '13',
                id: 13,
                photoNum: 20,
                commentNum: 220,
                likeNum: 10,
                date: "2016-03-03T13:34:09.238Z",
                url: "http://ngs-children.oss-cn-shanghai.aliyuncs.com/data/photo_1.jpg",
                title: "今天天气真好",
                releaseId: 12345,
                releaseName: "姓名"
            }, {
                key: '14',
                id: 14,
                photoNum: 20,
                commentNum: 220,
                likeNum: 10,
                date: "2016-04-03T13:34:09.238Z",
                url: "http://ngs-children.oss-cn-shanghai.aliyuncs.com/data/photo_1.jpg",
                title: "不要重复",
                releaseId: 12345,
                releaseName: "姓名"
            }, {
                key: '15',
                id: 15,
                photoNum: 20,
                commentNum: 220,
                likeNum: 10,
                date: "2016-05-03T13:34:09.238Z",
                url: "http://ngs-children.oss-cn-shanghai.aliyuncs.com/data/photo_1.jpg",
                title: "紫阳花和咖啡",
                releaseId: 12345,
                releaseName: "姓名"
            }, {
                key: '16',
                id: 16,
                photoNum: 20,
                commentNum: 220,
                likeNum: 10,
                date: "2016-06-02T13:34:09.238Z",
                url: "http://ngs-children.oss-cn-shanghai.aliyuncs.com/data/photo_1.jpg",
                title: "搜索标题",
                releaseId: 12345,
                releaseName: "姓名"
            }, {
                key: '17',
                id: 17,
                photoNum: 20,
                commentNum: 220,
                likeNum: 10,
                date: "2016-06-01T13:34:09.238Z",
                url: "http://ngs-children.oss-cn-shanghai.aliyuncs.com/data/photo_2.jpg",
                title: "测试啊",
                releaseId: 12345,
                releaseName: "姓名"
            }
        ]
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)
