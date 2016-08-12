import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import _ from 'underscore'
import {push} from 'redux-router'
import {login} from '../actions/user'
import styles from './LoginContainer.less'
import { Card ,Button, Form, Input,message } from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;


function noop() {
  return false;
}

let MyComponent = React.createClass({
  // 登录事件
  handleSubmit(e) {
    e.preventDefault();
    // 向后台发送登陆请求
		this.props.login(document.getElementById("userName").value, document.getElementById("userPwd").value);
    // 提示
		message.info('正在进行验证');
  },
	componentWillReceiveProps(nextProps){

	    // 根据登录返回后的状态给出响应
		if (nextProps.user.get('loginState') !== this.props.user.get('loginState')) {
			switch (nextProps.user.get('loginState')) {
				case 1:
          if(window.location.hash.indexOf("login")>-1){
            this.props.push("/contentManage/tuso/my");
          }
					message.success('登录成功');
					break;
				case 2:
					message.error('登录失败，账号不存在');
					break;
				case 3:
					message.error('登录失败，密码错误');
					break;
				case 4:
					message.error('登录失败，网络连接出错');
					break;
				default:
					break;
			}
		}
	},
  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    // 用户名验证
    const nameProps = getFieldProps('name', {
      rules: [
        { required: true, min: 1, message: '请填写用户名' }
      ],
    });
    // 密码验证
		const passwdProps = getFieldProps('passwd', {
      rules: [
        { required: true, whitespace: true, message: '请填写密码' }
      ],
    });
    // 布局方式
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    return (
			<div className={styles.root}>
				<div className="inner">
					<Card title="TUSO后台管理系统｜登录">
						 <Form horizontal form={this.props.form}>
							 <FormItem {...formItemLayout} label="用户名" hasFeedback>
								 <Input  {...nameProps} id="userName"/>
							 </FormItem>
							 <FormItem {...formItemLayout} label="密码" hasFeedback >
								 <Input {...passwdProps} type="password" id="userPwd" />
							 </FormItem>
							 <FormItem wrapperCol={{ span: 12, offset: 7 }}>
								<Button type="primary" onClick={this.handleSubmit} >确定</Button>
							 </FormItem>
						 </Form>
					 </Card>
				</div>
			</div>
    );
  },
});


function mapStateToProps(state) {
	return {
		user: state.getIn(["user"])
	}
}

function mapDispatchToProps(dispatch) {
	return {
		push: bindActionCreators(push, dispatch),
		login: bindActionCreators(login, dispatch),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(MyComponent))
