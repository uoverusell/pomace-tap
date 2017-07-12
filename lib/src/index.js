import { buildDOM } from 'pomace-base';

export default opt => {
  const tap = buildDOM('<div class="pomace-tap">');
  const isMobile = /mobile/i.test(navigator.userAgent);

  tap.$$.html(opt.name);
  tap.$$.addClass(opt.class);

  tap.$$.initState({
    disable: false,
    timeout: false,
    x: null,
    y: null,
    direction: null,
    times: 0,
    confineX: !opt.confineX? 5: opt.confineX,
    confineY: !opt.confineY? 5: opt.confineY,
  });

  const start = function(e){
    if(e.touches){
      this.$$.setState('x',e.touches[0].pageX);
      this.$$.setState('y',e.touches[0].pageY);
    }else{
      this.$$.setState('x',e.clientX);
      this.$$.setState('y',e.clientY);
    }
    if(!this.$$.state.disable){
      this.$$.addClass('pomace-tap-press');
    }
  };

  const move = function(e){
    this.$$.removeClass('pomace-tap-press');
    
    if(typeof opt.move === 'function'){
      opt.move.call(tap,e);
    }
  };

  const end = function(e){
    let x = null;
    let y = null;

    if(e.changedTouches){
      x = e.changedTouches[0].pageX;
      y = e.changedTouches[0].pageY;
    }else{
      x = e.clientX;
      y = e.clientY;
    }

    const touchX = this.$$.state.x;
    const touchY = this.$$.state.yl;
    const spaceX = x - touchX;
    const spaceY = y - touchY;
    const lConfineX = -this.$$.state.confineX;
    const rConfineX = Math.abs(lConfineX);
    const lConfineY = -this.$$.state.confineY;
    const rConfineY = Math.abs(rConfineY);

    this.$$.setState('drection',spaceX > 0? 'left-move':'right-move');

    if(spaceX === 0){
      this.$$.setState('drection','non-move');
    }
    if(spaceX > lConfineX && spaceX < rConfineX){
      if(!this.$$.state.disable){
        this.$$.removeClass('pomace-tap-press');
        opt.tap.call(tap,e);
      }
    }
  };

  tap.$$.on({
    [isMobile? 'touchstart':'mousedown'](e){
      start.call(this,e);
    },
    ['touchmove'](e){
      move.call(this,e);
    },
    [isMobile? 'touchend':'mouseup'](e){
      end.call(this,e);
    }
  });

  tap.$$.extends({
    disable(){
      this.state.disable = true;
      this.addClass('pomace-tap-disable');
    },
    able(){
      this.state.disable = false;
      this.removeClass('pomace-tap-disable');
    },
    trigger(){
      opt.tap.call(tap,e);
    },
    press(e){
      if(!this.state.disable){
        this.addClass('pomace-tap-press');
      }
    },
    unpress(e){
      this.removeClass('pomace-tap-press');
    }
  });

  return tap;
};
