<?php
  $theme_path = drupal_get_path('theme', 'ipaustralia');
  //drupal_add_js($theme_path . '/readspeaker/ReadSpeaker.js?pids=embhl');
?>
  <script src="/<?php print $theme_path;?>/readspeaker/ReadSpeaker.js?pids=embhl" type="text/javascript"></script>
      <!-- begin readspeaker implementation -->
      <div id="readspeaker_button1" class="rs_skip rsbtn rs_preserve">
        <a rel="nofollow" class="rsbtn_play" accesskey="L" title="Listen to this page using ReadSpeaker" href="https://app-as.readspeaker.com/cgi-bin/rsent?customerid=6064&amp;lang=en_au&amp;readid=block-system-main&amp;url=<?php print urlencode("https://".$_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"]);?>">
              <span class="rsbtn_left rsimg rspart"><span class="rsbtn_text"><span>Listen to this page</span></span></span>
              <span class="rsbtn_right rsimg rsplay rspart"></span>
          </a>
      </div>
      <!-- end readspeaker implementation -->