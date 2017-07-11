'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pomaceBase = require('pomace-base');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = function (opt) {
  var _tap$$$$on;

  var tap = (0, _pomaceBase.buildDOM)('<div class="pomace-tap">');
  var isMobile = /mobile/i.test(navigator.userAgent);

  tap.$$.html(opt.name);
  tap.$$.addClass(opt.class);

  tap.$$.initState({
    disable: false,
    timeout: false,
    x: null,
    y: null,
    direction: null,
    times: 0,
    confineX: !opt.confineX ? 5 : opt.confineX,
    confineY: !opt.confineY ? 5 : opt.confineY
  });

  var start = function start(e) {
    if (e.touches) {
      this.$$.setState('x', e.touches[0].pageX);
      this.$$.setState('y', e.touches[0].pageY);
    } else {
      this.$$.setState('x', e.clientX);
      this.$$.setState('y', e.clientY);
    }
    this.$$.addClass('pomace-tap-press');
  };

  var move = function move(e) {
    this.$$.removeClass('pomace-tap-press');
  };

  var end = function end(e) {
    var x = null;
    var y = null;

    if (e.changedTouches) {
      x = e.changedTouches[0].pageX;
      y = e.changedTouches[0].pageY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }

    var touchX = this.$$.state.x;
    var touchY = this.$$.state.yl;
    var spaceX = x - touchX;
    var spaceY = y - touchY;
    var lConfineX = -this.$$.state.confineX;
    var rConfineX = Math.abs(lConfineX);
    var lConfineY = -this.$$.state.confineY;
    var rConfineY = Math.abs(rConfineY);

    this.$$.setState('drection', spaceX > 0 ? 'left-move' : 'right-move');

    if (spaceX === 0) {
      this.$$.setState('drection', 'non-move');
    }
    if (spaceX > lConfineX && spaceX < rConfineX) {
      if (!this.$$.state.disable) {
        opt.tap.call(tap, e);
        this.$$.removeClass('pomace-tap-press');
      }
    }
  };

  tap.$$.on((_tap$$$$on = {}, _defineProperty(_tap$$$$on, isMobile ? 'touchstart' : 'mousedown', function (e) {
    start.call(this, e);
  }), _defineProperty(_tap$$$$on, isMobile ? 'touchmove' : 'mousemove', function (e) {
    move.call(this, e);
  }), _defineProperty(_tap$$$$on, isMobile ? 'touchend' : 'mouseup', function (e) {
    end.call(this, e);
  }), _tap$$$$on));

  tap.$$.extends({
    disable: function disable() {
      this.state.disable = false;
    },
    trigger: function trigger() {
      opt.tap.call(tap);
    }
  });

  return tap;
};