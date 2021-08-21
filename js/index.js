$(function () {
    //打开页面立即渲染
    load();
    //敲下回车生成todo
    $('.content .add').on("keydown", function (e) {
        if (e.keyCode === 13) {
            if ($(this).val() === "") {
                alert("请输入您的todo。");
            } else if ($(".content .group .title i").text() === '分组') {
                alert("请选择此条todo的分组。");
            } else if (prioIndex == 0) {
                alert("请选择此条todo的优先级。");
            } else {
                var local = getData();
                local.push({ group: $(".content .group .title i").text(), priority: prioIndex, title: $(this).val(), done: false });
                saveData(local);
                load();
                $(".content .group .title i").text("分组");
                $(".priority em").text("").css("color", "");
                flag = 0;
                prioIndex = 0;
                $(this).val("");
            }
        }

    });

    //删除todo
    //事件委托
    delToDo('doing', 'study');
    delToDo('doing', 'work');
    delToDo('doing', 'live');
    delToDo('done', 'study');
    delToDo('done', 'work');
    delToDo('done', 'live');


    //正在进行和已完成例表修改
    $('.doingcontent ul,.donecontent ul').on("click", "input", function () {
        // 获取本地存储
        var data = getData();
        // 修改数据
        var index = $(this).siblings("i").attr("index");
        data[index].done = $(this).prop("checked");
        // 保存回本地存储
        saveData(data);
        // 重新渲染
        load();
    })


    //输入内容时选择分组
    $(".group .title").on("mouseenter", function () {
        $(this).siblings("ul").stop().slideDown(50);
    })
    $(".group").on("mouseleave", function () {
        $(this).children("ul").stop().slideUp(50);
    })
    $(".content .group ul").on("click", "li", function () {
        $(".content .group .title i").text($(this).text());
    })
    //选择皮肤
    var skin = '黑灰';
    $(".logo .group ul").on("click", "li", function () {
        //li的变化
        $(this).css("backgroundColor", "#e6e6fa").siblings().css("backgroundColor", "");
        // 背景的变化
        skin = $(this).text();
        skinChange(skin);
        localStorage.setItem('mytodolistskin', skin);
    })


    //输入内容时选择优先级
    var flag = 0;
    var prioIndex = 0;
    $(".priority em").on({
        mouseenter: function () {
            if (flag == 0) {
                var index = $(this).index();
                for (var i = 0; i < index; i++) {
                    $(".priority em").eq(i).text("").css("color", "#f4ea2a");
                }
            }
        },
        mouseleave: function () {
            if (flag == 0) {
                $(".priority em").text("").css("color", "");
            }
        },
        click: function () {
            flag++;
            if (flag >= 1) {
                $(".priority em").text("").css("color", "");
                var index = $(this).index();
                prioIndex = index;
                for (var i = 0; i < index; i++) {
                    $(".priority em").eq(i).text("").css("color", "#f4ea2a");
                }
            }
        }
    })

    //显示和隐藏子标题
    $('.list .subtitle').on("click", function () {
        var strP = $(this).parent().prop('class');
        var strS = $(this).prop('class');
        if (strP.search('doing') !== -1) {
            if (strS.search("Study") !== -1) {
                $('.doingcontent .study').stop().slideToggle(100);
            } else if (strS.search("Work") !== -1) {
                $('.doingcontent .work').stop().slideToggle(100);
            } else {
                $('.doingcontent .live').stop().slideToggle(100);
            }
        } else {
            if (strS.search("Study") !== -1) {
                $('.donecontent .study').stop().slideToggle(100);
            } else if (strS.search("Work") !== -1) {
                $('.donecontent .work').stop().slideToggle(100);
            } else {
                $('.donecontent .live').stop().slideToggle(100);
            }
        }
    })









    //函数 获得本地存储里面的数据
    function getData() {
        var data = localStorage.getItem("mytodolist");
        if (data !== null) {
            //把字符串格式的数据转换为对象格式
            return JSON.parse(data);
        } else {
            return [];
        }
    }

    //函数 保存数据到本地存储
    function saveData(data) {
        //将对象格式转换成字符串格式
        localStorage.setItem('mytodolist', JSON.stringify(data));
    }

    //函数 加载渲染数据
    function load() {
        //加载皮肤
        skin = localStorage.getItem("mytodolistskin");
        skinChange(skin);

        var data = getData();
        //排列数组
        data.sort(compare("priority"));
        saveData(data);
        var doingCount = 0;
        var doingStudyCount = 0;
        var doingWorkCount = 0;
        var doingLiveCount = 0;
        var doneCount = 0;
        var doneStudyCount = 0;
        var doneWorkCount = 0;
        var doneLiveCount = 0;
        //清空内容
        $('.doing .study').empty();
        $('.doing .work').empty();
        $('.doing .live').empty();
        $('.done .study').empty();
        $('.done .work').empty();
        $('.done .live').empty();
        //遍历数据 逐条渲染
        $.each(data, function (i, ele) {
            //计算星星个数
            var star = "";
            for (var j = 0; j < ele.priority; j++) {
                star += "";
            }
            //确定分组
            var igroup = "";
            switch (ele.group) {
                case "学习": {
                    igroup = "study";
                    if (ele.done) {
                        doneStudyCount++;
                    } else {
                        doingStudyCount++;
                    }
                    break;
                }
                case "工作": {
                    igroup = "work";
                    if (ele.done) {
                        doneWorkCount++;
                    } else {
                        doingWorkCount++;
                    }
                    break;
                }
                case "生活": {
                    igroup = "live";
                    if (ele.done) {
                        doneLiveCount++;
                    } else {
                        doingLiveCount++;
                    }
                    break;
                }
            }
            //渲染todo
            if (ele.done) {
                $('.done .' + igroup + '').prepend('<li><div class="prio">' + star + '</div><em></em><input type="checkbox" checked="checked"><p>' + ele.title + '</p><i index="' + i + '"></i></li>');
                doneCount++;
            } else {
                $('.doing .' + igroup + '').prepend('<li><div class="prio">' + star + '</div><em></em><input type="checkbox"><p>' + ele.title + '</p><i index="' + i + '"></i></li>');
                doingCount++;
            }
        })
        $('.doing .headline span').text(doingCount);
        $('.doing .subtitleStudy').children("p").text(doingStudyCount);
        $('.doing .subtitleWork').children("p").text(doingWorkCount);
        $('.doing .subtitleLive').children("p").text(doingLiveCount);
        $('.done .headline span').text(doneCount);
        $('.done .subtitleStudy').children("p").text(doneStudyCount);
        $('.done .subtitleWork').children("p").text(doneWorkCount);
        $('.done .subtitleLive').children("p").text(doneLiveCount);

        //在子标题的ul没有内容的时候隐藏子标题
        showAndHide('doing', 'Study');
        showAndHide('doing', 'Work');
        showAndHide('doing', 'Live');
        showAndHide('done', 'Study');
        showAndHide('done', 'Work');
        showAndHide('done', 'Live');

    }

    //函数 删除对应列表的todo
    function delToDo(idiv, iul) {
        $('.list .' + idiv + ' .' + iul + '').on("click", "i", function () {
            //获取本地存储
            var data = getData();
            // 修改数据
            var index = $(this).attr("index");
            data.splice(index, 1);
            // 存回本地存储
            saveData(data);
            // 重新渲染
            load();
        })
    }

    //函数 比较两个数
    function compare(attribute) {
        return function (object1, object2) {
            var value1 = object1[attribute];
            var value2 = object2[attribute];
            if (value2 < value1) {
                return 1;
            } else if (value2 > value1) {
                return - 1;
            } else {
                return 0;
            }
        }
    }

    //函数 在子标题的ul没有内容的时候隐藏子标题
    function showAndHide(doingOrdone, vul) {
        //vul第一个字母大写
        if ($('.list .' + doingOrdone + ' .' + vul.toLowerCase() + '').text() === "") {
            $('.list .' + doingOrdone + ' .subtitle' + vul + '').hide();
        } else {
            $('.list .' + doingOrdone + ' .subtitle' + vul + '').show();
        }
    }

    // 函数 皮肤的变化
    function skinChange(skin) {
        if (skin === "黑灰") {
            document.body.style.background = "#cdcdcd";
            $('header').css("backgroundColor", "#323232");
        } else if (skin === "蓝白") {
            document.body.style.background = "url(images/白云图.jpg) #e1e9f6";
            $('header').css("backgroundColor", "#558dd0");
        } else {
            document.body.style.background = "url(images/樱花3.jpg) #e3d8ce";
            $('header').css("backgroundColor", "#f1a8a4");
        }
    }
})