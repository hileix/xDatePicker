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
  $.fn.xDatePicker = function (options) {
    // 配置
    var settings = $.extend({
      format: '-',
      placement: 'bottom-start'
    }, options);
    // 是否是第一次激活日历弹窗
    var first = true;
    // 当前选择的 年月日对象
    var selectedYMD = getYMD();
    // 当前显示的 年月日对象
    var curShowYMD = clone(selectedYMD);
    // 当前时间对象
    var curYMD = clone(selectedYMD);

    this.each(function () {
      $(this).focus(function () {
        // 日历界面初始化
        xCalendarInit(this);
        // 防止重复绑定事件
        if (first) {
          // 日历事件绑定
          xCalendarEventBinding(this);
        }
        first = false;
        if ($('.x-calendar-mask').length === 0) {
          $('<div class="x-calendar-mask"></div>').appendTo($('body'));
        } else {
          $('.x-calendar-mask').removeClass('x-calendar-mask-hide');
        }
      });
      // 只会给第一个input元素绑定日期选择器
      return false;
    });
    // 事件绑定
    function xCalendarEventBinding(context) {
      var $calendar = $(context).parent().find('.x-calendar');
      var $ul = $(context).parent().find('.x-calendar-cur-d');
      var $input = $(context);
      // 点击某一天
      $ul.on('click', 'li', function () {
        // 点击的为上个月的某天
        if ($(this).hasClass('pre-month-day')) {
          if (curShowYMD.m === 1) {
            curShowYMD.y--;
            curShowYMD.m = 12;
          } else {
            curShowYMD.m--;
          }
        // 点击的为下个月的某天
        } else if ($(this).hasClass('next-month-day')) {
          if (curShowYMD.m === 12) {
            curShowYMD.y++;
            curShowYMD.m = 1;
          } else {
            curShowYMD.m++;
          }
        }
        curShowYMD.d = Number($(this).html());
        if (settings.format === '年月日') {
          $input.val(curShowYMD.y + '年' + fill0(curShowYMD.m) + '月' + fill0(curShowYMD.d) + '日');
        } else {
          $input.val(curShowYMD.y + settings.format + fill0(curShowYMD.m) + settings.format + fill0(curShowYMD.d));
        }
        $calendar.addClass('x-calendar-hide');
        $('.x-calendar-mask').addClass('x-calendar-mask-hide');
        selectedYMD = clone(curShowYMD);
      });
      // 点击上一年
      $calendar.on('click', '.x-calendar-pre-y', function () {
        curShowYMD.y--;
        $calendar.find('.select-y').html(curShowYMD.y);
        createDayList($calendar.find('.x-calendar-cur-d'), 'switch')
      });
      // 点击下一年
      $calendar.on('click', '.x-calendar-next-y',function () {
        curShowYMD.y++;
        $calendar.find('.select-y').html(curShowYMD.y);
        createDayList($calendar.find('.x-calendar-cur-d'), 'switch')
      });
      // 点击上一个月
      $calendar.on('click', '.x-calendar-pre-m',function () {
        if (curShowYMD.m === 1) {
          curShowYMD.y--;
          curShowYMD.m = 12;
        } else {
          curShowYMD.m--;
        }
        $calendar.find('.select-y').html(curShowYMD.y);
        $calendar.find('.select-m').html(fill0(curShowYMD.m));
        createDayList($calendar.find('.x-calendar-cur-d'), 'switch')
      });
      // 点击下一个月
      $calendar.on('click', '.x-calendar-next-m', function () {
        if (curShowYMD.m === 12) {
          curShowYMD.y++;
          curShowYMD.m = 1;
        } else {
          curShowYMD.m++;
        }
        $calendar.find('.select-y').html(curShowYMD.y);
        $calendar.find('.select-m').html(fill0(curShowYMD.m));
        createDayList($calendar.find('.x-calendar-cur-d'), 'switch')
      });
      $(document).on('click', '.x-calendar-mask', function () {
        $('.x-calendar').addClass('x-calendar-hide');
        $('.x-calendar-mask').addClass('x-calendar-mask-hide');
      })
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
        $calendar.appendTo($wrap)
        // 关键所在
        createDayList($wrap.find('.x-calendar').find('.x-calendar-cur-d'), 'focus');
        // 给日期选择器定位
        locationDatePicker($calendar, $this, settings.placement);
      } else {
        // 关键所在
        createDayList($wrap.find('.x-calendar').find('.x-calendar-cur-d'), 'focus');
        curXCalendar.removeClass('x-calendar-hide')
      }
      // 设置标题时间，如 2018年2月
      $wrap.find('.x-calendar').find('.select-y').html(selectedYMD.y);
      $wrap.find('.x-calendar').find('.select-m').html(fill0(selectedYMD.m));
      // input 框加上值
      if (!$(context).val()) {
        if (settings.format === '年月日') {
          $(context).val(selectedYMD.y + '年' + fill0(selectedYMD.m) + '月' + fill0(selectedYMD.d) + '日');
        } else {
          $(context).val(selectedYMD.y + settings.format + fill0(selectedYMD.m) + settings.format + fill0(selectedYMD.d));
        }
      }
    }
    /**
     * 给日期选择器定位
     * @param {Object} $DatePicker jQuery对象的日期选择器
     * @param {Object} $input jQuery对象的输入框
     * @param {String} placement 日期选择的位置，可选值：'bottom/bottom-start/bottom-end/top/top-start/top-end'
     */
    function locationDatePicker ($DatePicker, $input, placement) {
      var left, top;
      if (placement === 'bottom') {
        left = $input.get(0).offsetLeft - ($DatePicker.outerWidth() - $input.outerWidth())/2;
        top = $input.get(0).offsetTop + $input.outerHeight() + 6;
      } else if (placement === 'bottom-start') {
        left = $input.get(0).offsetLeft;
        top = $input.get(0).offsetTop + $input.outerHeight() + 6;
      } else if (placement === 'bottom-end') {
        left = $input.get(0).offsetLeft - ($DatePicker.outerWidth() - $input.outerWidth());
        top = $input.get(0).offsetTop + $input.outerHeight() + 6;
      } else if (placement === 'top') {
        left = $input.get(0).offsetLeft - ($DatePicker.outerWidth() - $input.outerWidth())/2;
        top = $input.get(0).offsetTop - $DatePicker.outerHeight() - 6;
      } else if (placement === 'top-start') {
        left = $input.get(0).offsetLeft;
        top = $input.get(0).offsetTop - $DatePicker.outerHeight() - 6;
      } else if (placement === 'top-end') {
        left = $input.get(0).offsetLeft - ($DatePicker.outerWidth() - $input.outerWidth());
        top = $input.get(0).offsetTop - $DatePicker.outerHeight() - 6;
      }
      $DatePicker.css({ left: left, top: top });
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
    // 对象的浅克隆
    function clone(obj) {
      var ret = {};
      for (var key in obj) {
        ret[key] = obj[key]
      }
      return ret;
    }
    /**
     * 创建渲染 日期列表
     * @param {Object}  日期的包裹元素
     * @param {String} mode 创建日期的模式，有两种模式：'focus' 和 'switch'
     */
    function createDayList ($parentNode) {

      var cloneCurYMD = clone(curShowYMD)
      // 当前显示的月份 1 号是星期几
      cloneCurYMD.d = 1;
      var weekFirst = getDayWeek(cloneCurYMD)
      // 当前显示的月份的 最后一天 是星期几
      cloneCurYMD.d = getMonthDays(cloneCurYMD.y, cloneCurYMD.m);
      var weekLast = getDayWeek(cloneCurYMD);

      var preArr = getPreDayArr(curShowYMD, weekFirst);
      var curArr = getCurDayArr(curShowYMD);
      var nextArr = getNextDayArr(curShowYMD, weekLast, preArr.length + curArr.length);

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
    function getPreDayArr (curShowYMD, weekFirst) {
      var y = curShowYMD.y;
      var m = curShowYMD.m;
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
      var len = weekFirst === 0 ? 7 : weekFirst;
      for (var i = 1; i <= len; i++) {
        var obj = {};
        obj.day = preMonthDays--;
        obj.classes = 'pre-month-day';
        ret.unshift(obj);
      }
      return ret;
    }
    // 获取本月要显示的 “天” 列表
    function getCurDayArr (curShowYMD) {
      var y = curShowYMD.y;
      var m = curShowYMD.m;
      var d = curShowYMD.d;
      var curShowMonthDays = getMonthDays(y, m);

      var ret = [];
      for (var i = 1; i <= curShowMonthDays; i++) {
        var obj = {};
        obj.day = i;
        obj.isCurMonth = true;
        obj.classes = ['cur-month-day']
        // 如果选择的年月 和 面板的年月 相等
        if (m === selectedYMD.m && y === selectedYMD.y) {
          if (i === selectedYMD.d) {
            obj.classes.push('selected');
            obj.isCurDay = true;
          } else {
            obj.isCurDay = false;
          }
        }
        if (y === curYMD.y && m === curYMD.m && i === curYMD.d ) {
          obj.classes.push('cur');
        }
        obj.classes = obj.classes.join(' ');
        ret.push(obj);
      }
      return ret;
    }
    // 获取下一个月要显示的 “天” 列表
    function getNextDayArr(curShowYMD, weekLast, count) {
      var y = curShowYMD.y;
      var m = curShowYMD.m;

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
      if (count + ret.length === 35) {
        for (var i = 1; i < 8; i++) {
          var obj = {};
          obj.day = i;
          obj.classes = 'next-month-day';
          ret.push(obj);
        }
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
      return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0)
    }
    // 给小于 10 的数左边填充 0
    function fill0(num) {
      return  num < 10 ? '0' + num : num;
    }
  }
})(jQuery)
