var myChart,option;
			
			//echarts路径配置
			require.config({
	            paths: {
	                'echarts': 'http://echarts.baidu.com/build/dist'
	            }
	        });
			
			
			$(function(){
				$('.layui-layer-title').html('ooo');//iframe层-禁滚动条
				
				// 使用
		        require(
		            [
		                'echarts',
		                'echarts/chart/line',   //按需加载所需图表
		                'echarts/chart/bar'
		            ],
		            function (ec) {
		                // 基于准备好的dom，初始化echarts图表
		                myChart = ec.init(document.getElementById('version')); 
		                myChart.showLoading({
			                text : '数据获取中...'/* ,
			                effect: 'whirling' */
			            });
		                window.setTimeout(function () {
		                	initData("");	
		    			},100);	
		            }
		        );
			});
			var xAxis=[],
			    yAxis=[],
			    seriesAndroid=[],
			    seriesIOS=[],
			    seriesUnkonwn=[];
				xAxisVersion=[];
			
			
			
			/* 初始化曲线图和表格 */
			function initData(){
				
				$.ajax({
			        type    : "get",
			        url     : "bar.json",
			        data    : "",
			        dataType:'json',
			        success : function(json){
			            console.log(json);	
			            
                        /* 初始化表格 */
                        var tabData = json.tabData;
                        if(tabData){
                            
                            var tabStr = '';
                            for(var i=0;i<tabData.length;i++){
                                tabStr+='<tr>'
                                    +'<td style="text-align:left">'+tabData[i].game_name+'</td>'
                                    +'<td>'+tabData[i].curr_version+'</td>'
                                    +'<td>'+tabData[i].white_version+'</td>'
                                    +'<td>'+tabData[i].ioscurr_version+'</td>'
                                    +'<td>'+tabData[i].ioswhite_version+'</td>'
                                    +'</tr>';
                            }
                            $('.versionTab tbody').html(tabStr);//填充表格
                        }

                        /* 初始化曲线图 */
		            	var verlist = json.verlist,
		            		selected={};

			            xAxis=[];
			            seriesAndroid=[];
			            seriesIOS=[];
			            seriesUnkonwn=[];
			            xAxisVersion=[];
			            if(verlist==null||verlist==''||verlist==undefined){
			            	xAxis=[];
			            	seriesIOS=[];
			            	seriesAndroid=[];
			            	seriesUnkonwn=[]; 
			            }else{
			            	//填充曲线
					           for(var i=0;i<json.verlist.length;i++){
					        	   xAxis.push(json.verlist[i].login_time+"\n\n\n\n"+"（"+json.verlist[i].client_ver+"）");
					        	   xAxisVersion.push(json.verlist[i].client_ver);//所有版本号
					        	  if(json.verlist[i].device_type==1){  
					        		   //安卓
					        		   seriesAndroid.push(json.verlist[i].devices);
					        		   
					        	  }else if(json.verlist[i].device_type==2){
					        		   //ios
					        		   seriesIOS.push(json.verlist[i].devices);
					        		   
					        	  }else if(json.verlist[i].device_type==0){
					        		   //未知
					        		   seriesUnkonwn.push(json.verlist[i].devices);
					        		   
					        	  }  
					           }
			            }

			            if(seriesAndroid.length==0){
	        			   selected.Android=false;
	        		    } 
			              
	        		    if(seriesUnkonwn.length==0){
	        			   selected.未知=false;
	        		    }
				        //option.xAxis[0].data=xAxis;
				        //option.series[0].data=seriesdata0;
				          
				        initECharts(selected,xAxis.reverse(),seriesAndroid.reverse(),seriesUnkonwn.reverse());

				        
			        }
			    });
			}
			
				
			
			//数据放入图表显示		
			function initECharts(selected,aData,bData,dData){
				
				if(myChart){
					myChart.clear();
				}
				
				 option = {
		                    tooltip: {
		                        show: true
		                    },
		                    calculable : true,
		                    legend: {
		                    	selected: selected,
		                        data:['Android','未知']
		                    }/*,
		                     grid:{
		                    	y:30,
		                        y2:160
		                    } */
		                   /*  ,
		               	  	//数据区域缩放
		               	    dataZoom: {
						        show: true,
						        start : 0,
						        handleColor:"rgba(46,138,224,0.5)"
						    } */
		                    ,
		                    xAxis : [
								{	
									name:'时间',
		                        	nameTextStyle:{
		                        		fontSize:16,
		                        		color:"#333",
		                        		fontFamily:'微软雅黑'
		                        	},
								    type : 'category',
								    //boundaryGap : false,
								    data : aData
								}
		                    ],
		                    yAxis : [
		                        {   name:'设备数',
		                        	nameTextStyle:{
		                        		fontSize:16,
		                        		color:"#333",
		                        		fontFamily:'微软雅黑'
		                        	},
		                            type : 'value',
		                        }
		                    ],
		                    noDataLoadingOption: {
		                        text: '暂无数据',
		                        effect: 'bubble',
		                        effectOption: {
		                            effect: {
		                                n:0 //气泡个数0
		                            }
		                        }
		 					},
		                    series : [
		                        {
		                            "name":"Android",
		                            "type":"bar",
		                            "data":bData,
		                          //配置样式
		                            itemStyle: {   
		                                //通常情况下：
		                                normal:{  
		                // 每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组 
		                                    color: function (params){
		                                    	
		                                    	return barColor()[params.dataIndex];
		                                    	 
		                                    	
		                                    }
		                                }
		                            } 
		                        },
		                        
		                        {
		                            "name":"未知",
		                            "type":"bar",
		                            "data":dData,
		                          //配置样式
		                            itemStyle: {   
		                                //通常情况下：
		                                normal:{  
		                // 每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组 
		                                    color: function (params){
		                                    	return barColor()[params.dataIndex];
		                                    	
		                                    }
		                                }
		                            }
		                        } 
		                    ]
		                };
				 
				 myChart.hideLoading();
				 myChart.setOption(option,true); 
				 
				
			}
			
			
				Array.prototype.unique = function(){
					 var res = [];
					 var json = {};
					 for(var i = 0; i < this.length; i++){
					  if(!json[this[i]]){
					   res.push(this[i]);
					   json[this[i]] = 1;
					  }
					 }
					 return res;
					}
				
				function barColor(){
					var colorList = [
									  '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
									  '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
									  '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0',
		                              '#FFB7DD','#660077','#FFCCCC','#FFC8B4','#550088',
		                              '#FFFFBB','#FFAA33','#99FFFF','#CC00CC','#FF77FF',
		                              '#CC00CC','#C63300','#F4E001','#9955FF','#66FF66',
		                              '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
									  '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
									  '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0',
		                              '#FFB7DD','#660077','#FFCCCC','#FFC8B4','#550088',
		                              '#FFFFBB','#FFAA33','#99FFFF','#CC00CC','#FF77FF',
		                              '#CC00CC','#C63300','#F4E001','#9955FF','#66FF66'
		                             
		                             
		                          ];
					 //console.log(params);
	               	 console.log(xAxisVersion.reverse());
	               	 var version_arr = xAxisVersion.reverse();
	               	 var unique_arr = xAxisVersion.unique();
	               	 var color_arr=[];
	               	 console.log(unique_arr);
	               	 var cur=-1;
	               	
	               	
	               	 for(var i=0;i<version_arr.length;i++){
	               		 cur=-1;
	               		 for(var j=0;j<unique_arr.length;j++){
	               			 if(version_arr[i]===unique_arr[j]){
	                   			 //console.log(version_arr[i],unique_arr[j]);
	                   			 //console.log(i,j);
	                   			 cur = j;
	                   			 break;
	                   			
	                   		 }
	               		  } 
	               		  
	               		 if(cur>=0){
	               			 color_arr.push(colorList[cur]); 
	               			 //console.log('==='+colorList[cur]);
	               		 }else{
	               			 color_arr[i]="#f00";
	               		 }
	               	 }
	               	 
	               	 color_arr=color_arr.reverse();
	               	 return color_arr;
				}