var endpoint = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&format=json&exsentences=1&exlimit=max&exintro=&explaintext=&exsectionformat=plain&generator=search&gsrnamespace=0&callback=?&gsrsearch=';

$(document).ready(function() {
  
  $('.search').focus();
 
  /*****************************************************************************
      Search Box 'Return Key' Event Listener
   *****************************************************************************/   
  $('.search').keyup(function(event) {
    if(event.keyCode == 13) {
      searchWiki($('.search').val());
    }
  });
  
  /*****************************************************************************
      Autocomplete listener - functionality derived from devbridge jQuery Plugin
        license: MIT License
        ﻿Copyright 2012 DevBridge and other contributors
        https://github.com/devbridge/jQuery-Autocomplete
   *****************************************************************************/   
  $('#autocomplete').autocomplete({
    lookup: function(query, done) {
      $.ajax({
        url: endpoint + encodeURIComponent(query),
        dataType: 'json',
        type: 'GET',
        headers: { 'Api-User-Agent': 'Wiki Viewer | roorucker10@gmail.com' },
      }).done(function(json) {
          var pagelist = Object.keys(json.query.pages);
          var result = pagelist.map(function(key) { return json.query.pages[key].title; });

          result.sort(function(a,b) { 
            return a.toLowerCase().localeCompare(b.toLowerCase()); 
          });

          var titles = {
            suggestions: result.map(function(res) {
              return {value: res};
            })
          }

          done(titles)						  
        });
    }, onSelect: function(suggestion) {
      searchWiki(suggestion.value);
    }
  });
  
  /*****************************************************************************
      searchWiki makes ajax call to wiki API, using query = text entry
      or a selected autocomplete suggestion. The top ten results are then populated
      into a results list.
   *****************************************************************************/ 
  function searchWiki(query) {
    $.ajax({
      url: endpoint + encodeURIComponent(query),
        dataType: 'json',
        type: 'GET',
        headers: { 'Api-User-Agent': 'Wiki Viewer | roorucker10@gmail.com' },
    }).done(function(json) {
      $('.resultList').html('');
      $('.container').addClass('slide-up');
      $('.autocomplete-suggestions').hide();
      var pagelist = Object.keys(json.query.pages);
      var result = pagelist.map(function(key) { return json.query.pages[key];});
      result.sort(function(a,b) {return a.index - b.index;});
      
      result.forEach(function(listItem) {
        var list = '<div class="resultContainer"><a target="_blank" href="http://en.wikipedia.org?curid='+listItem.pageid+'">';
				list += '<h3 class="articleTitle">' + listItem.title + '</h3>';
				list += '<p class="articleExtract">' + listItem.extract + '</p></a></div>';
				$('.resultList').append(list);
      })
      
      $('.searchResults').show();
    })
  }
  
}) //end document.ready