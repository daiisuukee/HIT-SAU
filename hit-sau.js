/*
 * @Author: Daiisuukee（黛苏珂）
 * @Date: 2022-02-15 12:25:55
 * @LastEditTime: 2022-02-16 16:06:20
 * @LastEditors: Please set LastEditors
 * @Description: 本脚本仅供学习交流使用，禁止用于商业用途，产生的一系列法律纠纷由使用者本人承担，作者不承担任何责任
 */
Date.prototype.format = function(formatStr){   
    var str = formatStr;   
    var Week = ['日','一','二','三','四','五','六'];   
    str=str.replace(/yyyy|YYYY/,this.getFullYear());  
    str=str.replace(/MM|mm/,(this.getMonth()+1)>9?(this.getMonth()+1).toString():'0' + (this.getMonth()+1));   
    str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());   
   return str;
}

var pw = "114514";// 这里写下你的开机密码，需要纯数字
if (!device.isScreenOn()) {// 如果屏幕没亮则解锁
    device.wakeUp();
    sleep(500);
    swipe(device.width/2, device.height/8*7,device.width/2,device.height/8,1000);
    sleep(1000);  
    
    for (var i = 0; i <= pw.length; i++) {
        click(pw[i]);
    }
}

launchApp("WeCom")// 打开企业微信
while(!click("Workspace"));
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
home();

toast("打卡已完成");