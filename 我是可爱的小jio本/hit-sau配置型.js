/*
 * @Author: Daiisuukee（黛苏珂）
 * @Date: 2022-02-15 12:25:55
 * @LastEditTime: 2022-02-16 20:19:56
 * @LastEditors: Please set LastEditors
 * @Description: 本脚本仅供学习交流使用，禁止用于商业用途，产生的一系列法律纠纷由使用者本人承担，作者不承担任何责任
 */


var pw = "114514";// 这里写下你的开机密码，需要纯数字

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
                    click((forcedStop_location.left + forcedStop_location.right) / 2, (forcedStop_location.top + forcedStop_location.bottom) / 2);
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

///////////////////////////////main
if (!device.isScreenOn()) {// 如果屏幕没亮则解锁
    device.wakeUp();
    sleep(500);// 如果你的上滑输入密码界面进不去，请调高数值试试。
    swipe(device.width/2, device.height/8*7,device.width/2,device.height/8,1000);
    sleep(1000);  
    
    for (var i = 0; i <= pw.length; i++) {
        click(pw[i]);
    }
}
var language = "";
toast("本程序仅作为学习交流使用，禁止私自转发、用于商业用途！！！有bug请QQ：1278578896");
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
sleep(300)
while(!click("c.生活服务"));
sleep(1000)
while(!click("师生健康信息填报"));
while(!click("每日上报"));// 避免网卡阻塞
var tempertuare = className("Spinner").findOnce(2);
tempertuare.click();
sleep(1000);
click(580, 1061);

var date = className("EditText").findOnce(6);
log("下面是当前时间：")
var time = new Date().format("yyyy-mm-dd");
log(time);
date.setText(time);

while(!click("提交信息"));
while(!click("确定"));

if (language == "zh-CN") {
    killApp("企业微信");
} else if (language == "en-US") {
    killApp("WeCom");
}
home();

toastLog("打卡已完成");