const wcs = require("../index");
const config = require('./config');

let bucket = '<YOUR BUCKET>';
let key = '<YOUR KEY>';
let putPolicy = {
    scope: bucket+':'+key,
    deadline: '1598916800000',
    overwrite: 1,
};

let client = new wcs.wcsClient(config);
var callback = function(err, data, res) {
    console.log('callback');
    if (err) {
        console.log(err);
    }
    else {
        console.log(res.statusCode);
        console.log(data);
        // console.log(res.statusCode == 200 ? wcs.utils.urlSafeBase64Decode(data) : data);
    }
}

// 分片上传进度回调
var progressCallback = function(readLength, fileSize) {
    console.log(readLength + '/' + fileSize + ' finished');
}

// 普通上传
let filePath = __dirname+'/test';
client.uploadByPath(filePath, putPolicy, null, callback);

// 分片上传
let filePath = __dirname+'/test10M';

// 若不指定recordFile则不会启用断点续传功能
let recordFile = __dirname+'/resume.record';
let extraParams = {
    deadline:3,                         // 定义过期时间，单位天
    mimeType: 'application/text',       // 自定义文件mimeType类型
    progressCallback: progressCallback, // 分片上传进度回调
    params: {'x:myVar': 'myvar'},       // 自定义变量
}
client.resumeUploadByPath(filePath, putPolicy, extraParams, callback);