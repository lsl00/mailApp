# mailApp
一个简单的用于发一些简单邮件的app

使用两个CSV文件来进行确定发送的内容和目标:
- 一个CSV文件有两列，一列是id(可以是任意字符串，能唯一标识即可)，一列是对应的邮箱地址
- 另一个CSV文件的第一列是id，其余列是数据

格式化的模板的语法是:第二个CSV文件的第`num`列(从0开始记)的内容会进行替换模板字符串里的`%num%`,若要输入百分号要使用`%%`.

可以用json文件快速导入配置:
```json
{
  "username" : "xxx@xxx.xxx",//你的邮箱账号的用户名
  "password" : "xxx",//邮箱的密码
  "hostname" : "xxx.xxx",//邮箱服务器的地址
  "subject"  : "xxx",//邮件的主题
  "from"     : "xxx",//谁发的邮件
  "template" : "%0% abcd %%\n<ul><li>%1%</li></ul>"//模板
}
```

发送之前需要先进行预览(设计为点击预览时才会从文件里读取信息).

因为需要发送邮件，需要一个后端程序，可以使用python(需要flask依赖)，或者go.

```
go build main.go
./main
```
或者
```
python app.py
````
