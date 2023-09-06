/* ==============================
 * 작성일 : 2022-07-01
 * 작성자 : 장영석
 * 작성자의 허락없이 무단 도용시 고발 조치 합니다.
 * ============================== */

document.addEventListener('DOMContentLoaded', function() {
	common.init();
	ui.init();
});

const common = {
  header: function () {
    $(window).scroll(function () {
    });
    
    $(document).on('click','.menu-all',function(){
      $('#header').toggleClass('open')
      return false;
    });
  },

  lnb: function () {
    const target = '.hiddenbutton , .left-nav'; 
    const link = target + ' .lnb-link';
    const gnbBtn = target + ' .lnb-sidebar-btn';

    $(document).on('click',link,function(){
      $(this).toggleClass('close').siblings('ul').slideToggle(300);
      return false;
    });
    
    $(document).on('click',gnbBtn,function(){
      $(this).closest('#tkg-wrap').toggleClass('lnb-close');
      return false;
    });
  },
  footer: function () {    
  },
  menuAction : function(){
    const path = location.pathname;
    const pathPop = path.split('/').pop();
    const lnbLink = '.tkg-nav li, .left-nav li';
    
    $(lnbLink).each(function(){  
        const $this = $(this)
        const href = $this.find('a').attr('href').split('/').pop();
        // if(path.indexOf(href) > -1){
        if(pathPop === href){
            $this.addClass('active').closest('.lnb-depth').addClass('active')
            .siblings().find('>a').addClass('close').siblings('ul').hide();
        }
    });
  },
  init: function () {
    common.header();
    common.lnb();
    common.footer();
    //common.menuAction();
  }
};


const ui = {
  resize: {
    winResize: function () {
      $(window).resize(function () {
        ui.mobileCheck.init();
      });
    },
    init: function () {
      ui.resize.winResize();
    }
  },
  mobileCheck: {
    check: function () {
      const $agent = navigator.userAgent;
      const isAndroid = $agent.match(/Android/i) != null ? 'android' : null;
      const isBlackBerry = $agent.match(/BlackBerry/i) != null ? 'blackBerry' : null;
      const isIOS = $agent.match(/iPhone|iPad|iPod|iOS/i) != null ? 'ios' : null;
      const isIPhone = $agent.match(/iPhone/i) != null ? 'iphone' : null;
      const isIPad = $agent.match(/iPad/i) != null ? 'ipad' : null;
      const isOpera = $agent.match(/Opera Mini/i) != null ? 'opera' : null;
      const isWindows = $agent.match(/IEMobile/i) != null ? 'windows' : null;
      const isNaverApp = $agent.indexOf('NAVER(inapp') !== -1 ? 'naverApp' : null;
      const isDaumApp = $agent.match(/DaumApps/i) != null ? 'daumApp' : null;
      const isKakaoTalk = $agent.match(/KAKAOTALK/i) != null ? 'kakaoTalk' : null;
      const isAny = isAndroid || isIOS || isBlackBerry || isOpera || isWindows;

      if (isAny) {
        $('html').addClass('mobile');
        if (ui.mobileCheck.text) {
          $('html').removeClass(ui.mobileCheck.text.join(' '));
        }
        ui.mobileCheck.text = null;
        ui.mobileCheck.text = [isAndroid, isBlackBerry, isIOS, isIPhone, isIPad, isOpera, isWindows, isNaverApp, isDaumApp, isKakaoTalk];
        $('html').addClass(ui.mobileCheck.text.join(' '));
      } else {
        $('html').removeClass('mobile');
        if (ui.mobileCheck.text) {
          $('html').removeClass(ui.mobileCheck.text.join(' '));
        }
      }
    },
    init: function () {
      ui.mobileCheck.check();
    }
  },
  include: {
    load: function () {
      const includes = document.querySelectorAll('[data-include]');
      includes.forEach(el => {
        const src = el.getAttribute('data-include');
        fetch(src)
          .then(response => response.text())
          .then(data => {
            el.innerHTML = data;
            el.removeAttribute('data-include');
            if (el.getAttribute('id') === 'headerWrap') {
              if (document.querySelector('#container').getAttribute('data-title')) {
                const title = document.querySelector('#container').getAttribute('data-title');
                const headTitle = document.title;
                if (title && title !== '') {
                  document.title = `${title} | ${headTitle}`;
                }
              }
            }
            // 탭 활성화
            const tabAction = el.getAttribute('data-tab-action');
            if (tabAction === '0' || tabAction) {
              let idx = 0;
              if (window.localStorage.tabIndex) {
                idx = window.localStorage.tabIndex;
              } else {
                idx = window.localStorage.setItem('tabIndex', tabAction);
              }
              const tabBox = el.querySelector('[data-tab-box]');
              const tabChildren = tabBox.children;
              tabChildren[idx].classList.add('on');
              ui.tabWrap.setting();
              setTimeout(() => {
                window.localStorage.setItem('tabIndex', tabAction);
                el.querySelector('.tab-line').classList.remove('off');
                idx = tabAction;
                const winW = window.outerWidth;
                const target = el.querySelector('[data-tab-box]').children[idx];
                const scrollLeft = target.offsetLeft;
                const scrollWidth = target.offsetWidth;
                for (let i = 0; i < tabChildren.length; i++) {
                  if (i !== idx) {
                    tabChildren[i].classList.remove('on');
                  } else {
                    tabChildren[idx].classList.add('on');
                  }
                }
                if (winW < scrollLeft + scrollWidth) {
                  el.querySelector('.tab-list').scrollLeft = scrollLeft - winW + scrollWidth + 20;
                }
                ui.tabWrap.setting();
              }, 100);
            }
            if(el.classList.contains('left-nav')){
              common.menuAction();
            }
          });
      });
    },
    init: function () {
      //ui.include.load();
      $(window).load(function () {
        ui.include.load();
      });
    }
  },
  otherClick: function () {
    /* 다른거 클릭했을때 자동 닫힘 */
    $('body').click(function (e) {
      if (!$(e.originalEvent.target).closest('.tooltip-wrap').length && !$(e.originalEvent.target).closest('.layer-pop-wrap').length) {
        $('.tooltip-pop').fadeOut('fast');
        $('.popup-dim').fadeOut('fast', function () {
          $(this).remove();
        });
        $('body').removeClass('scrollLock');
      }
      if (!$(e.originalEvent.target).closest('.select-box').length) {
        $('.select-box').removeClass('focus')
                        .find('.select-tit').removeClass('on')
                        .siblings('.select-view').removeClass('active');
      }
    });
  },
  tabWrap: {
    setting: function () {
      $('[data-tab-tit]').each(function () {
        let target = $(this).find('.on').attr('href');
        if (!target) {
          target = $(this).find('.on').data('href');
        }
        if (target.charAt(0) == '#' || (target.charAt(0) == '.' && target.length > 1)) {
          if (!$(target).parent('.swiper-wrapper').length) $(target).css('display', 'block').siblings().css('display', 'none');
        }
      });
      $('[data-tab-style]').each(function () {
        tabStyle(this);
      });
      $(window).resize(function () {
        $('[data-tab-style]').each(function () {
          tabStyle(this);
        });
      });

      function tabStyle(t) {
        if (!$(t).find('.tab-line').length) {
          if (!$(t).hasClass('swiper-tab')) {
            $(t).addClass('line-type').append('<span class="tab-line"></span>');
          } else {
            $(t).addClass('line-type').find('.swiper-wrapper').append('<span class="tab-line"></span>');
          }
          $(t).find('.tab-line').addClass('off');
        }
        const left = $(t).find('.on').position().left;
        const width = $(t).find('.on').outerWidth();
        const sclL = $(t).scrollLeft();
        const margin = parseFloat($(t).css('margin-left'));
        $(t)
          .find('.tab-line')
          .css({ left: left + sclL + margin, width: width });
      }
    },
    click: function () {
      $(document).on('click', '.accodion-box .tit-box', function () {
        if(!$(this).closest('.accodion-box').hasClass('disabled')){
          $(this).closest('.accodion-box').toggleClass('on')
          $(this).next('.accodion-view').slideToggle();
        }
        return false;
      });

      $(document).on('click', '[data-tab-tit] a', function (e) {
        //e.preventDefault();
        const name = $(this).prop('tagName');
        let href = '';
        if (name == 'A') href = $(this).attr('href');
        if (name == 'BUTTON') href = $(this).data('href');

        if (href.slice(0, 1) == '#' || href.slice(0, 1) == '.') {
          if ($(href).closest('.tab-cont-wrap').data('tab-cont') == 'swiper') {
            $(href).closest('.tab-cont-wrap')[0].swiper.slideTo($(href).index());
          } else {
            $(href).show().siblings().hide();
          }
          if ($(this).parent().hasClass('tab')) {
            $(this).addClass('on').parent().siblings().find('> a').removeClass('on');
          } else {
            $(this).addClass('on').siblings().removeClass('on');
          }

          if ($(this).closest('.tab-list').data('tab-style') == 'type2') {
            const left = $(this).position().left;
            const width = $(this).outerWidth();
            const sclL = $(this).closest('.tab-list').scrollLeft();
            const margin = parseFloat($(this).css('margin-left'));

            $(this)
              //.siblings('.tab-line')
              .removeClass('off')
              .css({ left: left + sclL + margin, width: width });
          }
          return false;
        }
      });
    },
    swiper: function () {
      if ($('[data-tab-cont=swiper]').length) {
        $('[data-tab-cont=swiper]').each(function () {
          const swiper = new Swiper(this, {
            autoHeight: true
          });
          swiper.on('slideChange', function (target) {
            $(target.el).prev('.tab-list').find('a').eq(target.realIndex).addClass('on').siblings().removeClass('on');
          });
        });
      }

      if ($('.swiperTab').length) {
        $('.swiperTab').each(function () {
          const $this = $(this);
          const initIdx = $this.find('.swiper-slide.on').index() - 1;
          const swiper = new Swiper(this, {
            slidesPerView: 'auto',
            initialSlide: initIdx,
            on: {
              init: function (e) {
                snapCheck(e);
              }
            }
          });
          swiper.on('slideChange', function (e) {
            snapCheck(e);
          });

          $this.find('.swiper-button-prev').on('click', function () {
            swiper.slidePrev();
            return false;
          });
          $this.find('.swiper-button-next').on('click', function () {
            swiper.slideNext();
            return false;
          });

          function snapCheck(e) {
            if (e.snapIndex == 0) {
              $this.addClass('first');
            } else {
              $this.removeClass('first');
            }
            if (e.snapIndex == e.snapGrid.length - 1) {
              $this.addClass('last');
            } else {
              $this.removeClass('last');
            }
          }
        });
      }
    },
    init: function () {
      ui.tabWrap.setting();
      ui.tabWrap.click();
      ui.tabWrap.swiper();
    }
  },
  formBox: {
    input: function () {
      $('input')
        .on('focusin', function () {
          if (!$(this).attr('readonly')) {
            $(this).closest('.input-box').addClass('focus');

            if ($(this).val()) {
              inputBtn($(this), true);
            } else {
              inputBtn($(this), false);
            }

            const winW = $(window).outerWidth();
            if (winW <= 767 && $(this).attr('placeholder')) {
              $('<div class="placeholder-tip"></div>').appendTo($(this).closest('.input-box')).text($(this).attr('placeholder'));
            }
          }
        })
        .on('focusout', function () {
          if (!$(this).attr('readonly')) {
            $(this).closest('.input-box').removeClass('focus');
            inputBtn($(this), false);

            const winW = $(window).outerWidth();
            if (winW <= 767 && $(this).attr('placeholder')) {
              $(this).closest('.input-box').find('.placeholder-tip').remove();
            }
          }
        })
        .on('keyup', function () {
          if (!$(this).attr('readonly')) {
            if ($(this).val()) {
              inputBtn($(this), true);
            } else {
              inputBtn($(this), false);
            }
          }
        });

      $(document)
        .on('keydown', 'input.inp-number', function (e) {
          const code = e.keyCode;
          const minusChk = $(this).data('minus');
          if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || code == 8 || code == 46 || code == 37 || code == 39 || code == 36) {
          } else {
            return false;
          }
        })
        .on('keyup', 'input.inp-number', function (e) {
          if ($(this).val() !== '' && $(this).val() !== '-') {
            const value = Number($(this).val().replaceAll(/-|,/g, ''));
            const formatValue = value.toLocaleString('ko-KR');
            const minusChk = $(this).data('minus') ? '-' : '';
            $(this).val(minusChk + formatValue);
          } else {
            $(this).val('');
          }
          return false;
        })
        .on('paste', 'input.inp-number', function (e) {
          return false;
        });

      $(document).on('click', '.input-box .btn-close', function () {
        $(this).siblings('input').val('');
        return false;
      });

      function inputBtn(target, check) {
        if (check) {
          if (target.closest('.input-box').find('.btn-close').length === 0) {
            if (target.closest('.input-box').hasClass('right')) {
              target.closest('.input-box').find('input').before('<button class="btn-close">삭제</button>');
            } else {
              target.closest('.input-box').find('input').after('<button class="btn-close">삭제</button>');
            }
          }
        } else {
          setTimeout(function () {
            target.siblings('.btn-close').remove();
          }, 300);
        }
      }

      /* 비밀번호 */
      $(document).on('click', '.btn-pwd-show', function () {
        if ($(this).siblings('input').attr('type') == 'password') {
          $(this).siblings('input').attr('type', 'text').closest('.input-box').addClass('show');
        } else {
          $(this).siblings('input').attr('type', 'password').closest('.input-box').removeClass('show');
        }
        return false;
      });

      /* 달력 */
      $('.datepicker :input').datepicker({
        dateFormat: 'yy-mm-dd'
      });

      $('.datepicker i').click(function () {
        $(this).siblings(':input').datepicker('show');
      });

      $('.file-box :file').change(function () {
        $(this).siblings(':text').val($(this).val());
      });

      /* max-length */
      $('.input-box.max-check').each(function () {
        const target = $(this),
          maxlength = target.find('input').attr('maxlength'),
          number = target.find('.number'),
          idx = 0;
        number.find('.num').text(idx).siblings('.max').text(maxlength);
        target
          .find('input')
          .on('keydown keyup', function () {
            number.find('.num').text($(this).val().substr(0, maxlength).length);
          })
          .on('copy cut paste', function (e) {
            const text = e.clipboardData.getData('text/plain');
            number.find('.num').text(text.length);
          });
      });
    },
    selectInit: function () {
      const target = $('.select-box:not(.JS)');
      target.each(function () {
        const $this = $(this);
        const select = $(this).find('select');
        const option = select.find('option');
        const disabledCheck = select.is(':disabled');
        let selected = select.find('option:selected');

        let html = '<div class="select">';
        html += '<a href="#" class="select-tit">' + selected.text() + '</a>';
        html += '<div class="select-view"><div class="cont-box"></div>';
        html += '</div>';
        html += '</div>';

        $this.addClass('JS');
        select.hide();
        $this.append(html);
        option.each(function (e) {
          let optionH = '<a href="#">' + option[e].text + '</a>';
          $this.find('.select-view .cont-box').append(optionH);
        });
        if (disabledCheck) {
          $this.addClass('disabled');
        }
      });
    },
    select: function () {
      $(document).on('click', '.select .select-tit', function () {
        if (!$(this).closest('.select-box').hasClass('disabled')) {
          $('.select-tit').not($(this)).removeClass('on').siblings('.select-view').removeClass('active');
          $(this).toggleClass('on').siblings('.select-view').toggleClass('active');
          $(this).closest('.select-box').toggleClass('focus');
        }
        return false;
      });
      $(document).on('click', '.select .select-view a', function () {
        const idx = $(this).index();
        const text = $(this).text();
        $(this).addClass('on').siblings().removeClass('on').closest('.select-view').removeClass('active');
        $(this).closest('.select').find('.select-tit').text(text).removeClass('on');
        $(this).closest('.select-box').removeClass('focus')
                                      .find('option').eq(idx).prop('selected', true);
        $(this).closest('.select-box').find('select').change();
        return false;
      });

      $(document).on('click', '.select .select-view', function (e) {
        if ($(e.originalEvent.target).hasClass('select-view')) {
          $(this).removeClass('active').siblings().removeClass('on');
        }
      });

      $(document).on('click', '.select-cont-box > a', function () {
        $('.select-cont-box > a').not($(this)).siblings('.view').slideUp().closest('.select-cont-box').removeClass('on');
        $(this).siblings('.view').slideToggle().closest('.select-cont-box').toggleClass('on');
        return false;
      });
      $(document).on('click', '.select-cont-box .view a', function () {
        const html = $(this).html();
        $(this).closest('.view').siblings('a').html(html);
        $(this).addClass('on').siblings().removeClass('on');
        $(this).closest('.view').slideUp('fast').closest('.select-cont-box').removeClass('on');
        return false;
      });
    },
    textarea: function () {
      const target = $('.formBox').find('.textarea');
      target.each(function () {
        const $this = $(this);
        $this
          .find('textarea')
          .on('focusin', function () {
            $(this).closest('.textarea').addClass('focus');
          })
          .on('focusout', function () {
            $(this).closest('.textarea').removeClass('focus');
          });
        if ($this.hasClass('auto')) {
          $this.prepend('<p class="hiddenText"></p>');
          $this.find('textarea').on('keyup keydown keypress', function (e) {
            const val = $(this).val().replace(/\n/g, '<br />&nbsp;');

            $this.find('.hiddenText').html(val);
          });
        }
      });
    },
    agreeWrap: function () {
      $('[data-check-all]').each(function () {
        const target = $(this);
        const connet = target.data('check-all');
        target.find('input').on('change', function () {
          if ($(this).data('no-chg')) return;
          $('[data-check-child=' + connet + ']')
            .find('input')
            .prop('checked', $(this).is(':checked') ? true : false)
            .change();
        });
      });

      $('[data-check-child]').each(function () {
        const target = $(this);
        const parent = $('[data-check-all=' + target.data('check-child') + ']');
        const connet = $('[data-check-child=' + target.data('check-child') + ']');
        const max = connet.length;
        target.find('input').on('change', function () {
          if ($(this).is(':checked')) {
            parent.find('input').prop('checked', max == connet.find('input:checked').length ? true : false);
          } else {
            parent.find('input').prop('checked', false);
          }

          if (parent.data('check-child')) {
            parent.find('input').data('no-chg', true).change().removeData('no-chg');
          }
        });
      });
    },
    init: function () {
      ui.formBox.input();
      ui.formBox.selectInit();
      ui.formBox.select();
      ui.formBox.textarea();
      ui.formBox.agreeWrap();
    }
  },
  FM: {
    error: function (target, massege) {
      $(target).closest('.form-box').removeClass('error success')
      .find('.error-text,.success-text').remove();

      $(target).closest('.form-box').addClass('error');
      $('<div class="error-text"></div>').appendTo($(target).closest('.form-box')).text(massege);
    },
    success: function (target, massege) {
      $(target).closest('.form-box').removeClass('error success')
      .find('.error-text,.success-text').remove();

      $(target).closest('.form-box').addClass('success');
      $('<div class="success-text"></div>').appendTo($(target).closest('.form-box')).text(massege);
    }
  },
  tostpop: {
    setting: function () {
      if (!$('.tost-wrap').length) {
        let tostWrap = '<div class="tost-wrap"></div>';
        $('body').append(tostWrap);
      }
    },
    open: function (massege, delay) {
      let delayTime;
      delay ? (delayTime = delay) : (delayTime = 2000);

      ui.tostpop.setting();

      let text = '';

      text += '<div class="tost-box">' + massege;
      text += '</div>';

      const target = $(text).appendTo('.tost-wrap');
      setTimeout(function () {
        target.slideDown();

        // 삭제
        setTimeout(function () {
          target.slideUp(function () {
            target.remove();
          });
        }, delayTime);
      }, 20);
    }
  },
  layerPopup: {
    click: function () {
      $(document).on('click', '.pop-open', function () {
        const $this = $(this);
        let href = $this.attr('href');
        let style = '';

        $(href).removeClass('moping-pop');

        if ($this.data('pop-style') != 'morphing') {
          if ($this.data('pop-style')) {
            style = $this.data('pop-style');
          }
          if (!href) {
            href = $this.data('href');
          }
          ui.layerPopup.open(href, $this, style);
        } else {
          const btnW = $this.outerWidth();
          const btnH = $this.outerHeight();
          let size = Math.min(btnW, btnH);

          $this.css({ '--size-w': 0.1 * btnW + 'rem', '--size-h': 0.1 * btnH + 'rem', '--size-w-h': 0.1 * size + 'rem' }).addClass('morphing');
          setTimeout(function () {
            $this.addClass('action');
            ui.layerPopup.morphing(href, $this, size);
          }, 20);
        }
        return false;
      });
    },
    open: function (target, el, style) {
      const cont = $(target).find('.layer-pop-cont');
      /* 팝업 스타일 정의 */
      $(target).removeClass('bottom full').addClass(style);

      setTimeout(function () {
        $(target).addClass('on');
      }, 150);

      setTimeout(function () {
        cont.focus();
      }, 30);
      $('body').addClass('scrollLock');

      cont
        .find('.btn-pop-close')
        .last()
        .on('keydown', function (e) {
          var code = e.which;
          if (code == 9) {
            $(this).closest('.layer-pop-cont').focus();
          }
        });
      ui.layerPopup.close(target, el);

      $('#container').attr('aria-hidden', 'true');
      $(target).attr('aria-hidden', 'false');
    },
    close: function (target, reTarget) {
      $(target).off('click');
      $(target).find('.btn-pop-close').off('click');

      $(target)
        .find('.btn-pop-close')
        .on('click', function () {
          ui.layerPopup.actionClose(target, reTarget);
          return false;
        });
      $(target).on('click', function (e) {
        if ($(e.originalEvent.target).data('dim-close') === undefined) {
          if ($(e.originalEvent.target).hasClass('layer-pop-wrap')) {
            ui.layerPopup.actionClose(target, reTarget);
          }
        }
      });
    },
    actionClose: function (target, reTarget) {
      let btnTarget = reTarget ? reTarget : '';
      $(target).removeClass('on').removeClass('show');
      $('body').removeClass('scrollLock');

      if (reTarget) {
        btnTarget.focus();
        btnTarget.removeClass('morphing action');
      }

      /* */
      $('#container').removeAttr('aria-hidden');
      $(target).removeAttr('aria-hidden');
    },
    morphing: function (target, el, size) {
      morphingSetting();
      $(window)
        .resize(function () {
          morphingSetting();
        })
        .scroll(function () {
          morphingSetting();
        });

      $(target).removeClass('moping-pop show full');
      ui.layerPopup.open(target, el, 'moping-pop full');
      setTimeout(function () {
        $(target).addClass('show');
      }, 400);

      function morphingSetting() {
        const scrollTop = $(window).scrollTop();
        const scrollLeft = $(window).scrollLeft();
        const top = $(el).offset().top - scrollTop;
        const left = $(el).offset().left - scrollLeft;
        $(target)
          .removeAttr('style')
          .css({ '--pos-top': top + size / 2 + 'px', '--pos-left': left + size / 2 + 4 + 'px', '--width': size / 2 + 'px' });
      }
    },
    init: function () {
      ui.layerPopup.click();
    }
  },
  alert: function (options) {
    let settings = $.extend(
      {
        target: '#alert',
        noIcon: false,
        buttons: 1,
        buttonText: ['확인'],
        buttonClose: 1,
        text: 'alert내용입니다 <br /> html 태그로 넣어주시면 됩니다.',
        textAlign: 'center',
        dimClose: false,
        submit: function () {
          console.log('전송버튼호출');
        },
        close: function () {
          console.log('닫기버튼호출');
        }
      },
      options
    );

    const _this = settings.target;

    layerPopOpen(_this);

    function layerPopOpen(target) {
      layerPopAppend(target);
      $('body').addClass('scrollLock');

      setTimeout(function () {
        $(target).addClass('on');
      }, 10);

      setTimeout(function () {
        $(target).find('.layer-pop-cont').focus();
      }, 30);

      $(target)
        .find('.btn-pop-close')
        .last()
        .on('keydown', function (e) {
          const code = e.which;
          if (code == 9) {
            $(this).closest('.layer-pop-cont').focus();
          }
        });

      $(target).find('.btn-submit').on('click', settings.submit);
      $(target).find('.btn-pop-close').on('click', settings.close);

      layerPopClose(target);

      /* */
      $('#container').attr('aria-hidden', 'true');
      $(target).attr('aria-hidden', 'false');
    }

    function layerPopClose(target) {
      $(target)
        .find('.btn-submit')
        .on('click', function () {
          close($(this));
          return false;
        });
      $(target)
        .find('.btn-pop-close')
        .on('click', function () {
          close($(this));
          return false;
        });

      if (settings.dimClose) {
        $(document).on('click', target, function (e) {
          if ($(e.originalEvent.target).hasClass('layer-pop-wrap')) {
            $(target).find('.btn-pop-close:last').trigger('click');
            $(document).off('click', target);
            close($(this));
          }
        });
      }

      function close(t) {
        const $this = t;
        $this.closest('.layer-pop-wrap').removeClass('on');
        $('body').removeClass('scrollLock');

        $(target).find('.btn-submit').off('click');
        $(target).find('.btn-pop-close').off('click');

        setTimeout(function () {
          $(target).remove();
        }, 300);

        /* */
        $('#container').removeAttr('aria-hidden');
        $this.closest('.layer-pop-wrap').removeAttr('aria-hidden');
      }
    }

    function layerPopAppend(target) {
      $('body').append(layerPopHtml(target));
      $(target).find('.text-box').css('text-align', settings.textAlign);
      $(target)
        .find('.btn-pop-group button')
        .eq(settings.buttonClose - 1)
        .addClass('btn-pop-close')
        .siblings()
        .addClass('btn-submit');
    }

    function layerPopHtml(target) {
      let $layout = '<div id="' + target.replace('#', '') + '" class="layer-pop-wrap alert-pop">';
      $layout += '<div class="bg"></div>';
      $layout += '<div class="layer-pop-cont" tabindex="0">';
      $layout += '<div class="cont-box">';
      $layout += '<div class="text-box">' + settings.text + '</div>';
      $layout += '<div class="btn-pop-group">';
      if (settings.buttons == 1) {
        $layout += '<button class="button small btn-pop-close">' + settings.buttonText + '</button>';
      } else {
        $layout += '<button class="button line small btn-pop-close">' + settings.buttonText[0] + '</button><button class="button small btn-submit">' + settings.buttonText[1] + '</button>';
      }
      $layout += '</div></div></div></div>';
      return $layout;
    }
  },
  popup: function (options) {
    let settings = $.extend(
      {
        target: '#popup',
        full: false,
        title: '타이틀 영역들어갑니다',
        text: 'alert내용입니다 <br /> html 태그로 넣어주시면 됩니다.',
        load: null,
        remove: false,
        submit: function () {
          console.log('전송버튼호출');
        },
        close: function () {
          console.log('닫기버튼호출');
        }
      },
      options
    );

    const _this = settings.target;

    layerPopOpen(_this);

    function layerPopOpen(target) {
      layerPopAppend(target);
      $('body').addClass('scrollLock');

      setTimeout(function () {
        $(target).addClass('on');
      }, 10);

      setTimeout(function () {
        $(target).find('.layer-pop-cont').focus();
      }, 30);

      $(target)
        .find('.btn-pop-close')
        .last()
        .on('keydown', function (e) {
          const code = e.which;
          if (code == 9) {
            $(this).closest('.layer-pop-cont').focus();
          }
        });

      $(target).find('.btn-submit').on('click', settings.submit);
      $(target).find('.btn-pop-close').on('click', settings.close);

      layerPopClose(target);

      /* */
      $('#container').attr('aria-hidden', 'true');
      $(target).attr('aria-hidden', 'false');
    }

    function layerPopClose(target) {
      $(target)
        .find('.btn-submit')
        .on('click', function () {
          close($(this));
          return false;
        });
      $(target)
        .find('.btn-pop-close')
        .on('click', function () {
          close($(this));
          return false;
        });

      if (settings.dimClose) {
        $(document).on('click', target, function (e) {
          if ($(e.originalEvent.target).hasClass('layer-pop-wrap')) {
            $(target).find('.btn-pop-close:last').trigger('click');
            $(document).off('click', target);
            close($(this));
          }
        });
      }

      function close(t) {
        const $this = t;
        $this.closest('.layer-pop-wrap').removeClass('on');
        $('body').removeClass('scrollLock');

        $(target).find('.btn-submit').off('click');
        $(target).find('.btn-pop-close').off('click');

        setTimeout(function () {
          $(target).remove();
        }, 300);

        /* */
        $('#container').removeAttr('aria-hidden');
        $this.closest('.layer-pop-wrap').removeAttr('aria-hidden');
      }
    }

    function layerPopAppend(target) {
      $('body').append(layerPopHtml(target));
      if (settings.load) {
        $(target).find('.text-box').load(settings.load);
      }
      $(target).find('.text-box').css('text-align', settings.textAlign);
      $(target)
        .find('.btn-pop-group button')
        .eq(settings.buttonClose - 1)
        .addClass('btn-pop-close')
        .siblings()
        .addClass('btn-submit');
      if (settings.full) {
        $(target).addClass('full');
      }
    }

    function layerPopHtml(target) {
      let $layout = '<div id="' + target.replace('#', '') + '" class="layer-pop-wrap bottomPop">';
      $layout += '<div class="bg"></div>';
      $layout += '<div class="layer-pop-cont" tabindex="0">';
      $layout += '<div class="cont-box">';
      $layout += '<p class="title">' + settings.title + '</p>';
      if (settings.load) {
        $layout += '<div class="text-box"></div>';
      } else {
        $layout += '<div class="text-box">' + settings.text + '</div>';
      }
      $layout += '</div><a href="#" class="btn-close btn-pop-close">팝업닫기</a>';
      $layout += '</div></div>';
      return $layout;
    }
  },
  button: {
    scrollFixed: function () {
      $('.scrollFixed').each(function () {
        const target = $(this);
        const height = target.outerHeight();
        const clone = target.children().clone();
        target.wrapInner('<div>').css('height', height).find('> div').addClass('fixed');

        scrollCheck();
        $(window).on('load', function () {
          scrollCheck();
        });
        setTimeout(function () {
          scrollCheck();
        }, 50);

        $(window).on('scroll', function () {
          scrollCheck();
        });

        function scrollCheck() {
          const winT = $(window).scrollTop();
          const winH = $(window).outerHeight();
          const winL = $(window).scrollLeft();
          const scrollT = target.offset().top;
          if (winT + winH > scrollT + height) {
            target.find(' > .fixed').removeClass('fixed');
            target.find(' > div .reserve-fixed-box').css('transform', 'translateX(0)');
          } else {
            target.find(' > *').addClass('fixed');
            target.find(' > div .reserve-fixed-box').css('transform', 'translateX(' + -winL + 'px)');
          }
        }
      });
    },
    tooltip: function () {
      $(document).on('click', '.tooltip', function (e) {
        const space = 20;
        let tipW = 600;
        if ($(this).data('width')) {
          tipW = $(this).data('width');
        }

        const secW = $('.section').outerWidth() - space * 2;
        let addM = 0;
        if (($(this).parent().position().left + 10 - space) / secW > 0.5) {
          addM = 20;
        }
        let tipLeft = -Math.round((($(this).parent().position().left + 10 - space) / secW) * tipW) + addM;

        if(tipLeft > -($('.tkg-content').position().left + parseInt($('.tkg-content').css('padding-left')))){
          tipLeft = 0;
        }

        if ($(this).siblings('.tooltip-pop').hasClass('popup')) {
          if (!$('.popup-dim').length) {
            $('body').append('<div class="popup-dim"></div>').addClass('scrollLock');
          }
        }

        $('.tooltip-pop').not($(this).siblings('.tooltip-pop')).fadeOut('fast');
        $(this)
          .siblings('.tooltip-pop')
          .css({ width: tipW, left: tipLeft, '--tip-left': tipW - tipLeft - tipW + 7 + 'px' });
        $(this).siblings('.tooltip-pop').fadeToggle('fast');
        return false;
      });
      $(document).on('click', '.tooltip-pop .btn-close', function () {
        $(this).closest('.tooltip-pop').fadeOut('fast');
        $('.popup-dim').fadeOut('fast', function () {
          $(this).remove();
        });
        $('body').removeClass('scrollLock');
        return false;
      });
    },
    init: function () {
      ui.button.scrollFixed();
      ui.button.tooltip();
    }
  },
  loading: {
    open: function (set) {
      let settings = $.extend(
        {
          target: $('body'),
          text: ''
        },
        set
      );

      if (settings.target.prop('tagName') == 'BODY') {
        $('body').addClass('scrollLock');
      }

      settings.target.append(layerPopHtml());
      setTimeout(function () {
        settings.target.find('.loading-wrap').addClass('on');
      }, 10);

      function layerPopHtml() {
        let $layout = '<div id="ladingPop" class="layer-pop-wrap loading-wrap">';
        $layout += '<div class="bg"></div>';
        $layout += '<div class="loading-box">';
        $layout += '<div class="loading"><i></i><i></i><i></i><i></i></div>';
        if (settings.text) {
          $layout += '<div class="text">' + settings.text + '</div>';
        }
        $layout += '</div></div>';
        return $layout;
      }
    },
    close: function (set) {
      let settings = $.extend(
        {
          target: $('body')
        },
        set
      );
      if (settings.target.prop('tagName') == 'BODY') {
        $('body').removeClass('scrollLock');
      }

      settings.target.find('.loading-wrap').removeClass('on');
      setTimeout(function () {
        settings.target.find('.loading-wrap').remove();
      }, 300);
    }
  },
  tree : function(){
    const target = '.tree-wrap';
    const open = target + ' .tree-action'
    $(document).on('click',open,function(){
      $(this).toggleClass('on').closest('li').find('> ul').slideToggle()
      return false;
    });
  },

  searchtree : function(){
    const target = '.search-tree-wrap';
    const open = target + ' .tree-action'
    $(document).on('click',open,function(){
      $(this).toggleClass('on').closest('li').find('> ul').slideToggle()
      return false;
    });
  },

  init: function () {
    ui.include.init();
    ui.resize.init();
    ui.otherClick();
    ui.formBox.init();
    ui.tabWrap.init();
    ui.mobileCheck.init();
    ui.button.init();
    ui.layerPopup.init();
    ui.tree();
    ui.searchtree();
  }

};

  // 전체 splitter를 정의.
  jQuery(function($) {
    $('#tkg-container').split({orientation:'vertical', position:'310px', limit:10});
    $('#tkg-splitter').split({orientation:'horizontal', limit:10});
  });




