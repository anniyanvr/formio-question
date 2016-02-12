angular.module("formio.question",["formio","nvd3"]).directive("formioQuestion",function(){var t='<div class="formio-question-form"></div><button ng-if="previewResults && (view === \'question\')" class="btn btn-success btn-sm" ng-click="showAnalytics()">Results</button><button ng-if="updateAnswer && (view === \'analytics\')" class="btn btn-success btn-sm" ng-click="resetQuestion()">Question</button><button class="btn btn-primary btn-sm pull-right" ng-click="save()" ng-disabled="disabledInput">Submit</button>';return{restrict:"E",replace:!0,template:'<div><i ng-show="!questionLoaded" id="formio-loading" style="font-size: 2em;" class="glyphicon glyphicon-refresh glyphicon-spin"></i><div ng-repeat="alert in formioAlerts" class="alert alert-{{ alert.type }}" role="alert">{{ alert.message }}</div><div class="formio-question">'+t+"</div></div>",scope:{src:"=",question:"=",form:"=",submissions:"=",submission:"=",previewResults:"=",updateAnswer:"=",chart:"=",chartAdvanced:"=",chartDataCustomizer:"=",waitForPromise:"=",disabledInput:"="},link:function(t,e,n,s,o){t.questionLoaded=!1,t.questionElement=angular.element(".formio-question",e),t.questionElementForm=angular.element(".formio-question-form",e)},controller:["$scope","$compile","$element","Formio","FormioScope","$http","FormioUtils","$q","$timeout",function(e,n,s,o,i,a,r,u,c){var l=["table","pie"];e.views={question:"question",analytics:"analytics"},e.view=e.views.question;var d=function(){return'<div class="row"><div class="col-md-12"><h3>Results</h3><table class="table table-hover table-condensed"><thead><tr><th>Answer</th><th>Count</th></tr></thead><tbody><tr ng-repeat="answer in data track by $index"><td>{{answer.label}}</td><td>{{answer.value}}</td></tr></tbody></table></div></div>'},m=function(t){return-1!==["table"].indexOf(t)?_(e.data).map(function(t,e){return{label:e,value:t}}).value():-1!==["pie"].indexOf(t)?_(e.data).map(function(t,e){return{key:e,y:t}}).value():void 0},h=function(){if(e.chartAdvanced&&_.get(e.chartAdvanced,"chart.type")&&e.chartDataCustomizer)return e.data=e.chartDataCustomizer(e.data),'<nvd3 options="chartAdvanced" data="data"></nvd3>';var t=(e.chart||"table").toString().toLowerCase();return e.data=m(t),-1===l.indexOf(t)&&console.error("Unknown type given: "+t),"table"===t?d():"pie"===t?(e.options=e.chartAdvanced||{chart:{type:"pieChart",height:500,x:function(t){return t.key},y:function(t){return t.y},showLabels:!0,duration:500,labelThreshold:.01,labelSunbeamLayout:!0,legend:{margin:{top:5,right:35,bottom:5,left:0}}}},'<nvd3 options="options" data="data"></nvd3>'):void 0};e.showAnalytics=function(){e.view=e.views.analytics;var t=function(t){e.data={},_(t).map("data."+e.question).value().forEach(function(t){t&&(e.data[t]=e.data[t]+1||1)})},s=function(){e.questionElementForm.html(n('<h3 class="fio-question-output">Answered: <span class="fio-question-answer">{{submission.data[question] || "N/A"}}</span></h3><br>'+h())(e))};e.useSubmissionCache&&e.submissions?(t(e.submissions),s()):e.src&&(e.useSubmissionCache=!0,a.get(e.src+"/submission?limit=4294967295").then(function(e){t(e.data),s()})["catch"](function(t){console.error(t)}))},e.showQuestion=function(){if(e.view=e.views.question,e.questionLoaded=!0,e.formioAlerts=[],_.get(e,"submission.data."+e.question)&&!e.updateAnswer)return e.showAnalytics();var t=angular.element(document.createElement("formio"));angular.element(e.questionElementForm).html(n(t.attr({form:"page",submission:"submission"}))(e))},e.resetQuestion=function(){e.questionElementForm.html(n(t)(e)),e.showQuestion()},e.save=function(){var t=_.has(e.submission,"_id")?"put":"post",n="post"===t?e.src+"/submission":e.src+"/submission/"+e.submission._id;a[t](n,e.submission).then(function(){e.useSubmissionCache=!1,e.showAnalytics()})["catch"](function(t){console.error(t)})};var f=[];e.waitForPromise&&f.unshift(e.waitForPromise),e.$watch("chart",function(t,n){t!==n&&e.showAnalytics()}),u.all(f).then(function(){return c(function(){return e.form?e.form:e.src?a.get(e.src).then(function(t){return t.data})["catch"](function(t){console.error(t)}):void 0})}).then(function(t){e.page={components:[r.getComponent(t.components,e.question)]},e.showQuestion()})}]}});