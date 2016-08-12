from qiniu import Auth, put_file, etag, urlsafe_base64_encode
from subprocess import call
import qiniu.config
import glob, os

q = Auth('X0W-1LWpcdD0eOQr0MUwOz1hQvuAPYxR9XAzbzHf', '9AsdeMKGYlvBHduCZX-NTOyAXz9TLvNrC62yjcIp')
bucket_name = 'athena'

for file in glob.glob("./dist/*.*"):
	key = "admin-1/" + file.split("/")[-1]
	token = q.upload_token(bucket_name, key, 3600)
	ret, info = put_file(token, key, file)
	assert ret['key'] == key
	assert ret['hash'] == etag(file)

for file in glob.glob("./dist/iconfont/*"):
	key = "admin-1/iconfont/" + file.split("/")[-1]
	token = q.upload_token(bucket_name, key, 3600)
	ret, info = put_file(token, key, file)
	assert ret['key'] == key
	assert ret['hash'] == etag(file)