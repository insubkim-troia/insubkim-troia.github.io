/*** Layout **/
$(function(){

  
  
      $('.header_info .s1 li a em, .header_info .s2 em').imgLiquid({fill:true, horizontalAlign:"center", verticalAlign:"center"});
    $('.header_info .link').click(function(){
          $('.header_info li').removeClass('act');
          $(this).closest('li').addClass('act');
      return false;
      });
    $('.header_info .dep, .header_info').bind('mouseleave',function(){
      $('.header_info li').removeClass('act');
      });
    $('.header_info .link').keydown(function(e){
      var isShift = window.event.shiftKey ? true : false;
      if(isShift && (e.keyCode == 9)){
        $(this).closest('.li').find('.dep li').eq(0).find('a').focus();
      }else{
              $(this).closest('.li').focus();
          }
    });
    $('.header_info .dep li:last-child a').keydown(function(e){
      var isShift = window.event.shiftKey ? true : false;
      if(isShift && (e.keyCode == 9)){
              $(this).closest('li').find('.link').focus();
      }else{
              $(this).closest('li').find('.link').focus();
              $('.header_info li').removeClass('act');
          }
    });
  
    $('.mc_state .count').each(function(){
      $(this).prop('Counter',0).animate({
        Counter: $(this).text()
      }, {
        duration: 1000,
        easing: 'swing',
        step: function (now) {
          $(this).text(Math.ceil(now));
        }
      });
    });
  });
  
  
  
  $.fn.tabNav = function(){
      $.each(this, function(i,v){
          $(v).closest('.tab_nav').find('a').removeClass('on');
          $(v).addClass('on');
          var s = $(v).attr("href");
          $(s).parent().find('.tab_cont').removeClass('on');
          $(s).addClass('on');
      });
  };
  $.fn.btnPop = function(){
      $.each(this, function(i,v){
      var s = $(v).attr("href");
          $(s).popup('show');
      });
  };
  
  $(function(){
      $('.tab_nav a').click(function(){
          $(this).tabNav();
          return false;
      });
  
    $('.pop_btn').click(function(){
          $(this).btnPop();
          return false;
      });
  });
  function pop_close(){
      $('.modal').popup('hide');
  }
  
  
  //190705 異붽�遺�
  $(document).ready(function(){
  
    var header = $('header');
    var wrap = $('#wrap');
    var gnb = $('#gnb');
    var gnb_m = $('.dep_m');
    var gnb_dep = $('#gnb .dep');    
    var gnb_dep_span = $('#gnb .dep span');
    var gnb_dep2 = $('#gnb .dep2');
  
    // 1�곸뒪 �대┃�� gnb �쇱묠
    $('.dep_m').on('click', function(){
  
      if($(this).hasClass('over')===true){
        //alert('ok')
        $('header, #gnb .dep,  #gnb .dep span, #gnb .dep2').removeClass('over');
        $('header').css('height', 50);
        $('.dep_m').removeClass('over');
        $(this).removeClass('over')
        $(this).removeClass('on')
      }
      else{
        $('header, #gnb .dep, #gnb .dep span, #gnb .dep2').addClass('over');
        $('header').css('height', gnb.innerHeight());
        $('.dep_m').removeClass('over')
        $(this).addClass('over')
      }
    })
  
    //�ㅽ겕濡ㅼ떆 gnb硫붾돱 �묓옒
    $(window).scroll(function(){
      $('header, #gnb .dep, #gnb .dep2').removeClass('over');
      $('header').css('height', 50);
      $('.dep_m').removeClass('over')
      $('.dep_m').removeClass('on')
    })
  
  })
  //190705 異붽�遺�