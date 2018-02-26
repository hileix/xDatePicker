/**
 * Simple date picker of base jQuery
 * 2018/2/26
 */
(function ($) {
  var xDatePicker = ['<div class="x-calendar">',
      '      <div class="x-calendar-header">',
      '        <span class="x-calendar-pre-y x-btn"><<</span>',
      '        <span class="x-calendar-pre-m x-btn"><</span>',
      '        <span class="x-calendar-cur-ym active"><span class="select-y"></span>年<span class="select-m"></span>月</span>',
      '        <span class="x-calendar-next-m x-btn">></span>',
      '        <span class="x-calendar-next-y x-btn">>></span>',
      '      </div>',
      '      <div class="x-calendar-body">',
      '        <ul class="x-calendar-w">',
      '          <li>日</li>',
      '          <li>一</li>',
      '          <li>二</li>',
      '          <li>三</li>',
      '          <li>四</li>',
      '          <li>五</li>',
      '          <li>六</li>',
      '        </ul>',
      '        <ul class="x-calendar-cur-d">',
      '        </ul>',
      '      </div>',
      '    </div>'].join("");
  $.fn.xDatePicker = function () {
    // 是否是第一次激活日历弹窗
    var first = true;
    // 选择的 年月日对象
    var selectedYMD = getYMD();

    // 当前时间对象
    var curYMD = getYMD();

    return this.each(function () {
      $(this).focus(function () {
        // 日历界面初始化
        xCalendarInit(this);
        // 日历事件绑定
        xCalendarEventBinding(this);
      });
    });
    // 事件绑定
    function xCalendarEventBinding(context) {
      $calendar = $(context).parent().find('.x-calendar');
      $ul = $(context).parent().find('.x-calendar-cur-d');
      $this = $(context);
      // 点击某一天
      $ul.off('click', 'li').on('click', 'li', function () {
        // 点击的为上个月的某天
        if ($(this).hasClass('pre-month-day')) {
          if (selectedYMD.m === 1) {
            selectedYMD.y--;
            selectedYMD.m = 12;
          } else {
            selectedYMD.m--;
          }
        // 点击的为下个月的某天
        } else if ($(this).hasClass('next-month-day')) {
          if (selectedYMD.m === 12) {
            selectedYMD.y++;
            selectedYMD.m = 1;
          } else {
            selectedYMD.m++;
          }
        }
        selectedYMD.d = Number($(this).html());
        $this.val(selectedYMD.y + '-' + selectedYMD.m + '-' + selectedYMD.d)

        $calendar.addClass('x-calendar-hide');
      });
      // 点击上一年
      $calendar.on('click', '.x-calendar-pre-y', function () {
        selectedYMD.y--;
        $calendar.find('.select-y').html(selectedYMD.y);
        createDayList($calendar.find('.x-calendar-cur-d'))
      });
      // 点击下一年
      $calendar.on('click', '.x-calendar-next-y',function () {
        selectedYMD.y++;
        $calendar.find('.select-y').html(selectedYMD.y);
        createDayList($calendar.find('.x-calendar-cur-d'))
      });
      // 点击上一个月
      $calendar.on('click', '.x-calendar-pre-m',function () {
        if (selectedYMD.m === 1) {
          selectedYMD.y--;
          selectedYMD.m = 12;
        } else {
          selectedYMD.m--;
        }
        $calendar.find('.select-y').html(selectedYMD.y);
        $calendar.find('.select-m').html(selectedYMD.m);
        createDayList($calendar.find('.x-calendar-cur-d'))
      });
      // 点击下一个月
      $calendar.on('click', '.x-calendar-next-m', function () {
        if (selectedYMD.m === 12) {
          selectedYMD.y++;
          selectedYMD.m = 1;
        } else {
          selectedYMD.m++;
        }
        $calendar.find('.select-y').html(selectedYMD.y);
        $calendar.find('.select-m').html(selectedYMD.m);
        createDayList($calendar.find('.x-calendar-cur-d'))
      });
    }
    // 日历界面初始化
    function xCalendarInit(context) {
      var $this = $(context);
      var $wrap = $this.parent();
      var curXCalendar = $wrap.find('.x-calendar');
      var $calendar = $(xDatePicker);
      // 如果 input 是第 1 次被 focus（防止生成多个 日历）
      if (first) {
        // 如果 input 的父元素不是定位元素
        if ($wrap.css('position') === 'static') {
          $wrap.css('position', 'relative');
        }
        var left = $this.position().left;
        var top = $this.height();
        $calendar.css({
          left: left,
          top: top + 10
        });
        $calendar.appendTo($wrap)
        first = false;
      } else {
        curXCalendar.removeClass('x-calendar-hide')
      }
      // 关键所在
      createDayList($wrap.find('.x-calendar').find('.x-calendar-cur-d'));
      // 设置标题时间，如 2018年2月
      $wrap.find('.x-calendar').find('.select-y').html(selectedYMD.y);
      $wrap.find('.x-calendar').find('.select-m').html(selectedYMD.m);
      // input 框加上值
      $(context).val(selectedYMD.y + '-' + selectedYMD.m + '-' + selectedYMD.d)
    }
    // 元素的父元素是否是定位元素
    function isLocationEle(context) {
      return $(context).parent().css('position') !== 'static';
    }
    /**
     * 获取当前年月日
     * @return {Object} 返回一个对象，如 { y: 2018, m: 2, d: 26 }
     */
    function getYMD() {
      var dt = new Date();
      return {
        y: dt.getFullYear(),
        m: dt.getMonth() + 1,
        d: dt.getDate()
      }
    }
    /**
     * 获取某天是星期几
     * @param {Object} YMDObj 日期对象，如 { y: 2018, m: 2, d: 26 }
     * @return {Number} 返回一个数字，0 - 6 ，表示 星期日 到 星期六
     */
    function getDayWeek(YMDObj) {
      return (new Date(YMDObj.y + '/' + YMDObj.m + '/' + YMDObj.d)).getDay();
    }
    /**
     * 创建日历中的 "天" 列表
     * @param {Object} $parentNode jQuery 对象
     */
    var example = {
      day: 1,
      isCurMonth: true,
      isCurDay: false
    }
    // 对象的浅克隆
    function clone(obj) {
      var ret = {};
      for (var key in obj) {
        ret[key] = obj[key]
      }
      return ret;
    }
    // 创建日历 “天” 列表
    function createDayList($parentNode) {

      var cloneCurYMD = clone(selectedYMD)
      // 当前显示的月份 1 号是星期几
      cloneCurYMD.d = 1;
      var weekFirst = getDayWeek(cloneCurYMD)
      // 当前显示的月份的 最后一天 是星期几
      cloneCurYMD.d = getMonthDays(cloneCurYMD.y, cloneCurYMD.m);
      var weekLast = getDayWeek(cloneCurYMD);

      var preArr = getPreDayArr(selectedYMD, weekFirst);
      var curArr = getCurDayArr(selectedYMD);
      var nextArr = getNextDayArr(selectedYMD, weekLast);

      var dayArr = preArr.concat(curArr, nextArr);

      var dayString = '';
      for (var i = 0, len = dayArr.length; i < len; i++) {
        if (dayArr[i].isCurMonth && dayArr[i].isCurDay) {
          dayString += '<li class="active cur ' + dayArr[i].classes + '">' + dayArr[i].day + '</li>'
        } else if (dayArr[i].isCurMonth) {
          dayString += '<li class="active ' + dayArr[i].classes + '">' + dayArr[i].day + '</li>'
        } else {
          dayString += '<li class="' + dayArr[i].classes + '">' + dayArr[i].day + '</li>'
        }
      }
      $parentNode.html(dayString)
    }
    // 获取上一个月在本月要显示的 “天” 列表
    function getPreDayArr(selectedYMD, weekFirst) {
      if (weekFirst === 0) {
        return [];
      }
      var y = selectedYMD.y;
      var m = selectedYMD.m;
      // 上一个月的天数
      var preMonthDays;
      var ret = [];
      // 当前选择的月份为 1 月
      if (m === 1) {
        y--;
        m = 12;
        preMonthDays = 31;
      // 当前选择的月份不是 1 月份
      } else {
        m--;
        preMonthDays = getMonthDays(y, m);
      }
      for (var i = 1; i <= weekFirst; i++) {
        var obj = {};
        obj.day = preMonthDays--;
        obj.classes = 'pre-month-day';
        ret.unshift(obj);
      }
      return ret;
    }
    // 获取本月要显示的 “天” 列表
    function getCurDayArr(selectedYMD) {
      var y = selectedYMD.y;
      var m = selectedYMD.m;
      var d = selectedYMD.d;
      var curShowMonthDays = getMonthDays(y, m);

      var ret = [];
      for (var i = 1; i <= curShowMonthDays; i++) {
        var obj = {};
        obj.day = i;
        obj.isCurMonth = true;
        if (i === curYMD.d && m === curYMD.m) {
          obj.isCurDay = true;
        } else {
          obj.isCurDay = false;
        }
        if (i === d) {
          obj.classes = 'cur-month-day selected';
        } else {
          obj.classes = 'cur-month-day';
        }
        ret.push(obj);
      }
      return ret;
    }
    // 获取下一个月要显示的 “天” 列表
    function getNextDayArr(selectedYMD, weekLast) {
      if (weekLast === 6) {
        return [];
      }
      var y = selectedYMD.y;
      var m = selectedYMD.m;

      var nextShowMonthDays;
      var ret = [];
      // 当前显示的月份为 1 月
      if (m === 12) {
        y++;
        m = 1;
        nextShowMonthDays = 31;
      // 当前显示的月份不是 1 月份
      } else {
        m++;
        nextShowMonthDays = getMonthDays(y, m);
      }
      for (var i = 1, len = (6 - weekLast); i <= len; i++) {
        var obj = {};
        obj.day = i;
        obj.classes = 'next-month-day';
        ret.push(obj);
      }
      return ret;
    }
    /**
     * 获取某年某月有多少天
     * @param {Number} y 年 如 2018
     * @param {Number} m 月 如 2
     * @return {Number} 返回天数 如 28
     */
    function getMonthDays(y, m) {
      switch (m) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          return 31;
          break;
        case 2:
          if (isLeap(y)) {
            return 29;
          } else {
            return 28;
          }
          break;
        default:
          return 30;
      }
    }
    // 是否是闰年
    function isLeap(y) {
      return (y % 4 === 0 && y % 100 !== 0) || (y % 100 === 0 && y % 400 === 0)
    }
  }
})(jQuery)
