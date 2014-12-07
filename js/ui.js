'use strict';

/** Define UI specific stuff.
 */
var UI = (function () {
  /** Resize the scrollable containers and make sure they are resized whenever
   * the window is resized.
   * Also introduce FastClick for faster clicking on mobile.
   */
  $(function() {
    FastClick.attach(document.body);    
    
    var offset = 150;
    var resize = function() {
      var h = $(window).height();
      $('.scrollable').height(h - offset + 'px');

      if ($(window).width() < 992) {
        if ($('#researchContent').parent().attr('id') == 'researchLarge') {
          $('#researchContent').detach().appendTo('#research');
        }
        if ($('#hrContent').parent().attr('id') == 'hrLarge') {
          $('#hrContent').detach().appendTo('#hr');
        }
        if ($('#upgradesContent').parent().attr('id') == 'upgradesLarge') {
          $('#upgradesContent').detach().appendTo('#upgrades');
        }
      } else {
        if ($('#researchContent').parent().attr('id') != 'researchLarge') {
          $('#researchContent').detach().appendTo('#researchLarge');
        }
        if ($('#hrContent').parent().attr('id') != 'hrLarge') {
          $('#hrContent').detach().appendTo('#hrLarge');
        }
        if ($('#upgradesContent').parent().attr('id') != 'upgradesLarge') {
          $('#upgradesContent').detach().appendTo('#upgradesLarge');
        }
      }

      if ($(window).width() < 992) {
        if (detector.width != 300) {
          detector.init(300);
        }
      } else {
        if (detector.width != 400) {
          detector.init(400);
        }
      }
    }
    
    $(window).resize(resize);
    resize();
  });

  /** Show a bootstrap modal with dynamic content. */
  var showModal = function(title, text, level) {
    var $modal = $('#infoBox');
    $modal.find('#infoBoxLabel').html(title);
    $modal.find('.modal-body').html(text);
    $modal.modal({show: true});
  };

  /** Display only the elements with data-min-level above a certain
   * threshold.
   */
  var showLevels = function(level) {
    $('#infoBox').find('[data-min-level]').each(function() {
      if (level >= $(this).data('min-level')) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  };

  var showUpdateValue = function(ident, num) {
    if (num != 0) {
      var formatted = Helpers.formatNumberPostfix(num);
      var insert;
      if (num > 0) {
        insert = $("<div></div>")
                  .attr("class", "update-plus")
                  .html("+" + formatted);
      } else {
        insert = $("<div></div>")
                  .attr("class", "update-minus")
                  .html(formatted);
      }
      showUpdate(ident, insert);
    }
  }

  var showUpdate = function(ident, insert) {
    var elem = $(ident);
    elem.append(insert);
    insert.animate({
      "bottom":"+=30px",
      "opacity": 0
    }, { duration: 500, complete: function() {
      $(this).remove();
    }});
  }

  var showAchievement = function(obj) {
    var alert = '<div class="alert alert-success alert-dismissible" role="alert">';
    alert += '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
    alert += '<span class="fa ' + obj.icon + ' alert-glyph"></span> <span class="alert-text">' + obj.description + '</span>';
    alert += '</div>';

    alert = $(alert);

    $('#achievements-container').prepend(alert);
    var remove = function(a)
    {
      return function()
      {
        a.slideUp(300, function() { a.remove(); });
      };
    };

    window.setTimeout(remove(alert), 2000);
  }

  var validateVersion = function(version) {
    if (version != Helpers.version) {
      var alert = '<div id="outofdate" class="alert alert-info alert-dismissible" role="alert">';
      alert += '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
      alert += '<span class="glyphicon glyphicon-info-sign alert-glyph"></span> <span class="alert-text">Your saved state is out of date. <a href="#"><strong>Restart</strong></a> to use latest version of the game.</span>';
      alert += '</div>';
      alert = $(alert);
      alert.find('a').click(function ()
      {
        if (window.confirm('Do you really want to restart the game? All progress will be lost.')) {
          ObjectStorage.clear();
          window.location.reload(true);
        }
      })

      $('#messages-container').append(alert);
    }
  }

  if (typeof $.cookie('cookielaw') === 'undefined') {
    var alert = '<div id="cookielaw" class="alert alert-info" role="alert">';
    alert += '<button type="button" class="btn btn-primary">OK</button>';
    alert += '<span class="glyphicon glyphicon-info-sign alert-glyph"></span> <span class="alert-text">Particle Clicker uses local storage to store your current progress.</span>';
    alert += '</div>';
    alert = $(alert);
    alert.find('button').click(function ()
    {
      $.cookie('cookielaw', 'informed', { expires: 365 });
      $('#cookielaw').slideUp(300, function() { $('#cookielaw').remove(); });
    })

    $('#messages-container').append(alert);
  }

  return {
    showAchievement: showAchievement,
    showModal: showModal,
    showLevels: showLevels,
    showUpdateValue: showUpdateValue,
    validateVersion: validateVersion
  }
})();


// I don't know what this is for, so I leave it here for the moment...
(function() {
    var hidden = "hidden";

    // Standards:
    if (hidden in document)
        document.addEventListener("visibilitychange", onchange);
    else if ((hidden = "mozHidden") in document)
        document.addEventListener("mozvisibilitychange", onchange);
    else if ((hidden = "webkitHidden") in document)
        document.addEventListener("webkitvisibilitychange", onchange);
    else if ((hidden = "msHidden") in document)
        document.addEventListener("msvisibilitychange", onchange);
    // IE 9 and lower:
    else if ('onfocusin' in document)
        document.onfocusin = document.onfocusout = onchange;
    // All others:
    else
        window.onpageshow = window.onpagehide 
            = window.onfocus = window.onblur = onchange;

    function onchange (evt) {
        var v = 'visible', h = 'hidden',
            evtMap = { 
                focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h 
            };

        evt = evt || window.event;
        if (evt.type in evtMap)
            detector.visible = evtMap[evt.type] == 'visible';
        else        
            detector.visible = !this[hidden];
    }
})();
