var myChart,option;
$(function(){    
        require.config({
            paths: {
                'echarts': 'http://echarts.baidu.com/build/dist'
            }
        });
        
        require(
            [
                'echarts',
                'echarts/chart/line',   // 按需加载所需图表，如需动态类型切换功能，别忘了同时加载相应图表
                'echarts/chart/bar'
            ],
            function (ec) {
                myChart = ec.init(document.getElementById('main'));
                option  = {
                   title: {
                        text: '预购',
                        subtext: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: []
                    },
                    toolbox: {
                         show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    
                    xAxis: [
                         {
                                type : 'category',
                                boundaryGap : false,
                                data : [ ]
                                ,
                                axisLabel: {
                                    interval:0,//横轴信息全部显示
                                    rotate: 30,//60度角倾斜显示
                                    formatter:function(val){
//                                        return val.split("").join("\n"); //横轴信息文字竖直显示
                                        return val;
                                    },
                                    textStyle: {
                                        color: '#000',
                                        align: 'center',
                                        fontWeight: 'bold'
                                    }
                                
                                }
                           }
                    ],
                    yAxis: [],
                    series: []
                };
//                myChart = require('echarts').init(document.getElementById('main'));
                myChart.showLoading({
//                    text : '数据获取中',
                    effect: 'whirling'
                });
                getData();
                

                
           });
});
        
//请求json
var fields,
     itemsMap,
     seriesItem,
    yAxis_arr = [],
    thead     = '',
     tbody     = '',
    tbody_tr  = '';
        function getData(){
            $.ajax({
                url      : 'INDEX.json',
                dataType : 'json', 
                async    : false,
                type     : 'get',
                success  : function(json){
//                    console.log(json.data);
                    console.log(option);
                    fields   = json.data.fields;
                    itemsMap = json.data.itemsMap;
                    
                    createEcharts();//动态创建曲线图
                    createTab();//动态创建表格
                    myChart.hideLoading();
                    myChart.setOption(option);
                    
                },
               
                error : function(XMLHttpRequest, textStatus, errorThrown){
                     
                    if(textStatus == 'parsererror'){
                        
                        alert('数据为空或者SQL语句错误！');
                    }
                    
                    console.log(errorThrown);
                }
            });
        }

/*
 * 动态创建曲线图
 */
function createEcharts(){
                    
    //    series                
    for(var i=1; i<fields.length; i++){
        if(i==1){
            itemStyle = {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
            };
        }else{
            itemStyle = {
                    normal: {
                        color: '#70bf41'
                       
                    }
            };
        }
        option.legend.data.push(fields[i]);  //    legend
        seriesItem              = {};
        seriesItem.name      = fields[i];
        seriesItem.type      = 'line';
        seriesItem.smooth    = false;
        seriesItem.yAxisIndex= i-1;
        seriesItem.itemStyle = itemStyle;

        seriesItem.data      = [];
        
        for(var key in itemsMap){
            seriesItem.data.push(itemsMap[key][i]);
        }

//        填充默认显示曲线的数据
        option.series.push(seriesItem);
//        option.series[0].type      = 'line';
//        option.series[1].type      = 'bar';
        // yAxis    
        var yAxis_obj  = {};
        yAxis_obj.type = 'value';
        yAxis_obj.name = fields[i];
        yAxis_obj.show = true;
        yAxis_arr.push(yAxis_obj);
        
    }
        option.yAxis = yAxis_arr;
        console.log(yAxis_arr);
        
}
/*
 * 动态创建表格
 */
function createTab(){
    //动态创建表头
    for(var i=0; i<fields.length; i++){
        
        thead += '<th>'+fields[i]+'</th>';
        $('.table thead').html('<tr>'+thead+'</tr>');

    }
    
    for(var j in itemsMap){
        var tbody_td = '';
        option.xAxis[0].data.push(itemsMap[j][0]); // XAxis
        for(var k=0; k<itemsMap[j].length; k++){
            
              tbody_td += '<td>'+itemsMap[j][k]+'</td>';
            
        }
//        console.log(tbody_td);
        tbody_tr += '<tr>'+tbody_td+'</tr>';
    }    
    $('.table tbody').html(tbody_tr);
        
}