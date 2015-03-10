//Step 1. 取消下面的注释开启simple插件，注意需要先进行插件安装 npm install -g fis-postpackager-simple
// fis.config.set('modules.postpackager', 'simple');

//通过pack设置干预自动合并结果，将公用资源合并成一个文件，更加利于页面间的共用

//Step 2. 取消下面的注释开启pack人工干预
// fis.config.set('pack', {
//     'pkg/lib.js': [
//         '/lib/mod.js',
//         '/modules/underscore/**.js',
//         '/modules/backbone/**.js',
//         '/modules/jquery/**.js',
//         '/modules/vendor/**.js',
//         '/modules/common/**.js'
//     ]
// });

//Step 3. 取消下面的注释可以开启simple对零散资源的自动合并
// fis.config.set('settings.postpackager.simple.autoCombine', true);


//Step 4. 取消下面的注释开启图片合并功能
// fis.config.set('roadmap.path', [{
//     reg: '**.css',
//     useSprite: true
// }]);
// fis.config.set('settings.spriter.csssprites.margin', 20);
fis.config.set('project.exclude', /^\/node_modules\//i);

fis.config.merge({
    project: {
      charset : 'utf-8',
      fileType : {
        text : 'styl'
      }
    },
    modules: {
        parser: {
            styl: 'stylus'
        },
        preprocessor: {
            tpl: 'extlang'
        },
        postprocessor: {
            //tpl: 'require-async',
            //js: 'jswrapper, require-async'
        }
    },
    roadmap : {
      ext : {
        styl : 'css'
      }
    }
});

var roadmap = [
    {
        reg : '**.styl',
        release : '/public$&',
        url : '$&'
    },
    {
        reg : '**.css',
        release : '/public$&',
        url : '$&'
    },
    {
        reg : '**.png',
        release : '/public$&',
        url : '$&'
    },
    {
        reg : '**.jpg',
        release : '/public$&',
        url : '$&'
    },
    {
        //所有lib目录下的js文件仅仅md5
        reg : '/public/lib/**.js',
        release : '/public$&',
        useMap: true,
        useCompile: false,
        useHash: true,
        useOptimizer: true,
        isMod: false,
        url : '$&'
    },
    {
        //所有module目录下的文件需要资源定位
        reg : '/public/modules/**.js',
        release : '/public$&',
        useMap: true,
        useCompile: true,
        useHash: true,
        useOptimizer: true,
        isMod: false,
        url : '$&'
    },
    {
        // 模板文件
        reg : /^\/views\/*/i,
        useMap: false
    },
    {
        // express入口
        reg: 'app.js',
        useMap: false,
        useCompile: false,
        useHash: false,
        useOptimizer: true,
        isMod: false,
        useDomain: false
    },
    {
        // 不需要fis处理的文件
        reg : /^(\/views\/*|\/routes\/*|\/conf\/*|\/bin\/*|\/services\/*|package.json|process.json)/i,
        useMap: true,
        useCompile: false,
        useHash: false,
        useOptimizer: true,
        isMod: false,
        useDomain: false
    },
];

fis.config.set('roadmap.path', roadmap);

fis.config.merge({
    deploy : {
        // 本地部署
        local : {
            // 发布到当前项目的上一级的deploy目录
            to : '../yougou-finddiff',
            // node_modules自行拷贝
            exclude : /\/node_modules\//i
        },
        // 线上部署
        online : {
            // 发布到当前项目的上一级的deploy目录
            to : '/var/www/html/yougou-finddiff',
            // node_modules自行拷贝
            exclude : /\/node_modules\//i,
            replace : {
                from : '/public',
                to : '/activity/finddiff'
            }
        }
    }
});