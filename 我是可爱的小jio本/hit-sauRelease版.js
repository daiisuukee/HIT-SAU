/*
 * @Author: Daiisuukee（黛苏珂）
 * @Date: 2022-02-15 12:25:55
 * @LastEditTime: 2022-02-17 19:12:02
 * @LastEditors: Please set LastEditors
 * @Description: 本脚本仅供学习交流使用，禁止用于商业用途，产生的一系列法律纠纷由使用者本人承担，作者不承担任何责任
 */
// 下面的变量可以根据你的需求进行调节↓
// 网页刷新参数（网络不好适当调节）
var login_waiting_time = 2000; // 进入填报中心的等待时间，默认2秒，提示登录失败请适当提高值
var fresh_cnt_max = 3;// 默认网页最大刷新次数为3次
var fresh_max_time = 10000;// 默认网页等待时间为10s

// 日期函数
Date.prototype.format = function(formatStr){   
    var str = formatStr;   
    var Week = ['日','一','二','三','四','五','六'];   
    str=str.replace(/yyyy|YYYY/,this.getFullYear());  
    str=str.replace(/MM|mm/,(this.getMonth()+1)>9?(this.getMonth()+1).toString():'0' + (this.getMonth()+1));   
    str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());   
   return str;
}

// 关闭应用
function killApp(name) {
    log("关闭的应用名：");
    log(name);
    forcedStopStr = ["停", "强", "结束", "Force", "stop", "Stop"];
    queryStr = ["确认","确定", "OK", "Ok", "ok"];
    let packageName = app.getPackageName("WeCom");
    var flg = false;

    if (packageName) {
        app.openAppSetting(packageName);
        text(name).waitFor();
        log("应用名寻找未阻塞");
        for (var i = 0; i < forcedStopStr.length; i++) {
            if (textContains(forcedStopStr[i]).exists()) {//找到强制退出按钮
                forcedStop = textContains(forcedStopStr[i]).findOnce();
                if (forcedStop) {
                    forcedStop_location = forcedStop.bounds();
                    sleep(500);
                    log("结束运行按钮的位置")
                    log(forcedStop_location)
                    //click((forcedStop_location.left + forcedStop_location.right) / 2, (forcedStop_location.top + forcedStop_location.bottom) / 2);
                    click(forcedStop_location.centerX(), forcedStop_location.centerY());
                    sleep(500);
                    for (var j = 0; j < queryStr.length; j++) {
                        if (textContains(queryStr[j]).exists()) {// 找到确认键
                            flg = true;
                            text(queryStr[j]).findOnce().click();
                            sleep(800);
                            return;
                        }
                    }
                }
            }
        }
    }
    if (flg) {
        toastLog("没匹配到退出键或确认键");
    }
}

// 刷新网页
var fresh_cnt = 0;
function freashNet() {
    fresh_cnt++;
    if (fresh_cnt > fresh_cnt_max) {
        toastLog("当前网页无法加载，可能是由于网络不佳，请排除问题后重新运行打卡姬");
        toastLog("打卡姬由于网络问题退出( >﹏<。)～");
        engines.myEngine().forceStop();
    }

    var options = id("com.tencent.wework:id/kcn").findOnce();
    click(options.bounds().centerX(), options.bounds().centerY());
    sleep(500);
    var fresh_btn_test = "";
    var fresh_btn = text("Refresh").findOnce();
    if (!fresh_btn.enabled()) {
        fresh_btn = text("刷新").findOnce();
        fresh_btn_test = "刷新"
    } else {
        fresh_btn_test = "Refresh";
    }
    
    if(fresh_btn_test == "Refresh") {
        click("Refresh");
        toastLog("成功刷新网页");
    } else if (fresh_btn_test == "刷新") {
        click("刷新");
        toastLog("成功刷新网页");
    } else {
        toastLog("未找到刷新按钮");
    }
    sleep(500);
    
}
///////////////////////////////main
log("脚本开始运行");

var language = "";
toastLog("本程序仅作为学习交流使用，禁止私自转发、用于商业用途！！！有bug请QQ：1278578896");
toast("本程序仅作为学习交流使用，禁止私自转发、用于商业用途！！！有bug请QQ：1278578896");
if (launchApp("WeCom")) {// 打开企业微信
    language = "en-US";
    log("程序启动成功");
} else if (launchApp("企业微信")) {
    language = "zh-CN";
    log("程序启动成功");
}

while(click("Workspace"));
while(true) {// 顺便判断下系统语言
    if (click("Workspace")) {
        language = "en-US";
        break;
    }
    if (click("工作台")) {
        language = "zh-CN";
        break;
    }
}
log("当前系统语言：")
log (language);
sleep(300);

while(!click("c.生活服务"));
sleep(login_waiting_time);

var d = new Date();
var time_begin = d.getTime();// 网页加载计时，默认超过十秒自动刷新，刷新三次结束脚本
while(true) {
    if (click("师生健康信息填报")) {
        break;
    }
    d = new Date();
    var now = d.getTime() - time_begin;
    if (now > fresh_max_time) {
        freashNet();
        time_begin = d.getTime();
    }
    sleep(300);
}
d = new Date();
time_begin = d.getTime();
while(true) {
    if (click("每日上报")) {
        break;
    }
    d = new Date();
    if (d.getTime() - time_begin > fresh_max_time) {
        freashNet();
        time_begin = d.getTime();
    }
    sleep(300);
}

var date = className("EditText").findOnce(6);
log("下面是当前时间：")
var time = new Date().format("yyyy-mm-dd");
log(time);
date.setText(time);
sleep(500);

var tempertuare = text("体温(早)*").findOnce();
click(tempertuare.bounds().centerX(), tempertuare.bounds().centerY() + 70);
sleep(500);
click(device.width/2, device.height/2 - 100);


while(!click("提交信息"));
while(!click("确定"));

if (language == "zh-CN") {
    killApp("企业微信");
} else if (language == "en-US") {
    killApp("WeCom");
}
home();

toastLog("打卡已完成");