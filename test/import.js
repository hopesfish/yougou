var xlsx = require('node-xlsx');
var base = require("./rest/base");

var schoolId = "d28eefe9-db3b-4db5-a469-424ac5d187d8";

function replaceBlank(val) {
	var val = val || '';
	return val.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '');;
}

function parse() {
	var obj = xlsx.parse('xlsx/wuyi_temp.xlsx'); // parses a file
	
	var classes = {}, mobilesMap = {}, errors = [];

	// 老师数据
	for (var i=0; i<obj.worksheets[1].data.length; i++) {
		if (i==0) { continue; }

		var record = obj.worksheets[1].data[i];
		if (!record) { continue; }

		var className = replaceBlank(record[0].value);

		if (!classes[className]) {
			classes[className] = {name: className, students: [], teachers: []};
		}

		var mobile = replaceBlank(record[3].value);
		if (mobilesMap[mobile]) {
			errors.push(className + ' ' + replaceBlank(record[1].value) + 
				' 教师手机重复:' + mobile + '，可能该老师的孩子在本园，或者管理多个班级');
		} else if (mobile.length != 11) {
			errors.push(className + ' ' + replaceBlank(record[1].value) + 
				' 教师手机号异常');
		} else {
			classes[className].teachers.push({
				name: replaceBlank(record[1].value),
				gender: replaceBlank(record[2].value) === '男' ? 1: 0,
				mobile: mobile,
			});
		}
		mobilesMap[replaceBlank(replaceBlank(record[3].value))] = replaceBlank(record[3].value);
	}

	// 家长及孩子数据
	for (var i=0; i<obj.worksheets[0].data.length; i++) {
		if (i==0) { continue; }

		var record = obj.worksheets[0].data[i];
		
		if (!record) { continue; }

		var className = replaceBlank(record[0].value);

		if (!classes[className]) {
			console.info("error class");
			return;
		}

		var mobile = replaceBlank(record[3].value);
		if (mobilesMap[mobile]) {
			errors.push(className + ' ' + replaceBlank(record[1].value) + 
				' 家长手机重复:' + mobile + '，可能该家长在本园有2个孩子。');
		} else if (mobile.length != 11) {
			errors.push(className + ' ' + replaceBlank(record[1].value) + 
				' 家长手机号异常');
		} else {
			classes[className].students.push({
				name: replaceBlank(record[1].value),
				gender: replaceBlank(record[2].value) === '男' ? 1: 0,
				mobile: replaceBlank(record[3].value),
			});
		}
		mobilesMap[replaceBlank(replaceBlank(record[3].value))] = replaceBlank(record[3].value);
	}



	if (errors.length > 0) {
		console.info(errors.join("\n"));
		//return;
	}

	// 检查每个班的孩子，老师数据都不为空
	for (var className in classes) {
		if (classes[className].students.length == 0 || classes[className].teachers.length == 0) {
			console.info("error class " + className);
			return;
		}
		console.info("import: " + className + " with students: " + classes[className].students.length + " teachers：" + classes[className].teachers.length);
	}

	// 通过REST API导入数据
	for (var className in classes) {

		(function(wexclass) {

			base.create("/api/school/" + schoolId + "/class", 
            {name: wexclass.name, code: "classcode", createdBy: 'system'}, {token: 'basic-valid'})
	        .then(function(classId) {

	        	// 创建老师账号
	            var teachers = wexclass.teachers;
	            //console.info(teachers);
	            for (var i=0; i<teachers.length; i++) {
	            	base.create("/api/school/" + schoolId + "/teacher", 
	                    {name: teachers[i].name, mobile: teachers[i].mobile, isAdmin: 0, gender: teachers[i].gender, createdBy: 'system'}, {token: 'basic-valid'})
	                .then(function(teacherId) {
	                	base.create("/api/school/" + schoolId + "/class/" + classId + "/teacher/" + teacherId, 
		                    {}, {token: 'basic-valid'})
		                .then(function(id) {
		                	
		                }, function(err) {
		                	console.info(err);
		                });
	                }, function(err) {
	                	console.info(err);
	                });
	            }

	        	// 创建孩子及家长账号
	            var students =  wexclass.students;
	            //console.info(students);
	            for (var i=0; i<students.length; i++) {
	            	base.create("/api/school/" + schoolId + "/class/" + classId + "/parent", 
	                    {name: students[i].name, mobile: students[i].mobile, gender: students[i].gender, createdBy: 'system'}, {token: 'basic-valid'})
	                .then(function(id) {
	                }, function(err) {
	                	console.info(err);
	                });
	            }
	            
	        }, function(err) {
	        	console.info(err);
	        });

		})(classes[className]);

	}
}
parse();
