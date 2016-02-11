angular.module("formio.question",["formio","nvd3"]).directive("formioQuestion",function(){var t='<div class="formio-question-form"></div><button ng-if="previewResults" class="btn btn-success btn-sm" ng-click="showAnalytics()">Results</button><button class="btn btn-primary btn-sm pull-right" ng-click="save()">Submit</button>';return{restrict:"E",replace:!0,template:'<div><i ng-show="!questionLoaded" id="formio-loading" style="font-size: 2em;" class="glyphicon glyphicon-refresh glyphicon-spin"></i><div ng-repeat="alert in formioAlerts" class="alert alert-{{ alert.type }}" role="alert">{{ alert.message }}</div><div class="formio-question">'+t+"</div></div>",scope:{src:"=",question:"=",form:"=?",submissions:"=?",submission:"=?",previewResults:"=?",updateAnswer:"=?",chart:"=?",chartAdvanced:"=?",chartDataCustomizer:"=?",waitForPromise:"=?"},compile:function(t,e){return{pre:function(t,e,n,s){t.questionElement=angular.element(".formio-question",e)},post:function(t,e,n,s){t.questionLoaded=!1,n.submission=n.submission||{data:{}},n.previewResults=n.previewResults||!1,n.updateAnswer=n.updateAnswer||!1,n.chart=n.chart||"table"}}},controller:["$scope","$compile","$element","Formio","FormioScope","$http","FormioUtils","$q","$timeout",function(e,n,s,o,i,a,r,u,c){e.page={};var l=["table","pie"],d=function(){return'<div class="row"><div class="col-md-12"><h3>Results</h3><table class="table table-hover table-condensed"><thead><tr><th>Answer</th><th>Count</th></tr></thead><tbody><tr ng-repeat="answer in data track by $index"><td>{{answer.label}}</td><td>{{answer.value}}</td></tr></tbody></table></div></div>'},m=function(){return-1!==["table"].indexOf(e.chart)?_(e.data).map(function(t,e){return{label:e,value:t}}).value():-1!==["pie"].indexOf(e.chart)?_(e.data).map(function(t,e){return{key:e,y:t}}).value():void 0},h=function(){return e.chartAdvanced&&_.get(e.chartAdvanced,"chart.type")&&e.chartDataCustomizer?(e._data=e.chartDataCustomizer(e.data),'<nvd3 options="chartAdvanced" data="_data"></nvd3>'):(e.chart=e.chart.toString().toLowerCase(),e.data=m(),-1===l.indexOf(e.chart)&&console.error("Unknown type given: "+e.chart),"table"===e.chart?d():"pie"===e.chart?(e.options=e.chartAdvanced||{chart:{type:"pieChart",height:500,x:function(t){return t.key},y:function(t){return t.y},showLabels:!0,duration:500,labelThreshold:.01,labelSunbeamLayout:!0,legend:{margin:{top:5,right:35,bottom:5,left:0}}}},'<nvd3 options="options" data="data"></nvd3>'):void 0)};e.showAnalytics=function(){var t=function(){e.data={},_(e.submissions).map("data."+e.question).value().forEach(function(t){t&&(e.data[t]=e.data[t]+1||1)})},s=function(){e.questionElement.html(n('<h3 class="fio-question-output">Answered: <span class="fio-question-answer">{{submission.data[question] || "N/A"}}</span></h3><br>'+h()+'<button ng-if="updateAnswer" class="btn btn-success btn-sm" ng-click="resetQuestion()">Question</button>')(e))};e.submissions?(t(),s()):!e.submissions&&e.src&&a.get(e.src+"/submission?limit=4294967295").then(function(n){e.submissions=n.data,t(),s()})["catch"](function(t){console.error(t)})},e.showQuestion=function(){e.questionLoaded=!0,e.formioAlerts=[],e.updateAnswer||e.showAnalytics(),e.page.components=[r.getComponent(e.form.components,e.question)];var t=angular.element(document.createElement("formio"));angular.element(document.getElementsByClassName("formio-question-form")).html(n(t.attr({form:"page",submission:"submission"}))(e))},e.resetQuestion=function(){e.questionElement.html(n(t)(e)),e.showQuestion()},e.save=function(){var t=_.has(e.submission,"_id")?"put":"post",n="post"===t?e.src+"/submission":e.src+"/submission/"+e.submission._id;a[t](n,e.submission).then(function(){e.showAnalytics()})["catch"](function(t){console.error(t)})};var f=[];e.waitForPromise&&f.unshift(e.waitForPromise),u.all(f).then(function(){return e.$watch("chart",function(t,n){t!==n&&e.showAnalytics()}),c(function(){e.form?e.showQuestion():e.src&&a.get(e.src).then(function(t){t=t.data,e.form=t,e.showQuestion()})["catch"](function(t){console.error(t)})})})}]}});