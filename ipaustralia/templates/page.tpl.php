<!-- <script src="https://www.ipaustralia.gov.au/sites/g/files/net856/themes/site/ipaustralia/readspeaker/ReadSpeaker.js?pids=embhl" type="text/javascript"></script> -->
<!-- ClickTale Top part -->
<script type="text/javascript">
var WRInitTime=(new Date()).getTime();
</script>
<!-- ClickTale end of Top part -->

<?php include DRUPAL_ROOT . "/" . path_to_theme() . "/templates/includes/header.inc"; ?>

<div class="main-container <?php if (isset($page_classes)): print implode(' ', $page_classes); endif; ?>">

  <div class="overlay" />

  <?php if (!empty($breadcrumb)): ?>
    <div class="breadcrumbs">
      <div class="container">
         <?php print $breadcrumb; ?>
         
      </div>
    </div>
  <?php endif; ?>

  <?php if (!empty($messages)): ?>
    <div class="messages">
      <div class="container">
        <?php print $messages; ?>
      </div>
    </div>
  <?php endif; ?>

  <div class="title">
    <div class="container">
      <?php print render($title_prefix); ?>
      <?php if (!empty($title)): ?>
      <h1 class="page-header"><?php print $title; ?></h1>
      <?php endif; ?>
      <?php print render($title_suffix); ?>
    </div>
  </div>

  <?php print render($page['content_top']); ?>

  <div class="container">

    <?php if (!empty($page['sidebar_first'])): ?>
      <aside class="col-sm-3" role="complementary">
        <?php print render($page['sidebar_first']); ?>
      </aside>  <!-- /#sidebar-first -->
    <?php endif; ?>

    <section<?php print $content_column_class; ?>> 
      <a id="main-content"></a>
      <!-- begin readspeaker implementation -->
<!--       <div id="readspeaker_button1" class="rs_skip rsbtn rs_preserve">
        <a rel="nofollow" class="rsbtn_play" accesskey="L" title="Listen to this page using ReadSpeaker" href="https://app-as.readspeaker.com/cgi-bin/rsent?customerid=6064&amp;lang=en_au&amp;readid=block-system-main&amp;url=<?php print urlencode("https://".$_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"]);?>">
              <span class="rsbtn_left rsimg rspart"><span class="rsbtn_text"><span>Listen to this page</span></span></span>
              <span class="rsbtn_right rsimg rsplay rspart"></span>
          </a>
      </div> -->
      <!-- end readspeaker implementation -->
      <?php if (!empty($tabs)): ?>
        <?php print render($tabs); ?>
      <?php endif; ?>
      <?php if (!empty($page['help'])): ?>
        <?php print render($page['help']); ?>
      <?php endif; ?>
      <?php if (!empty($action_links)): ?>
        <ul class="action-links"><?php print render($action_links); ?></ul>
      <?php endif; ?>

      <?php print render($page['content']); ?>
    </section>

    <?php if (!empty($page['sidebar_second'])): ?>
      <aside class="col-sm-3" role="complementary">
        <?php print render($page['sidebar_second']); ?>
      </aside>  <!-- /#sidebar-second -->
    <?php endif; ?>

  </div>

  <?php print render($page['content_bottom']); ?>

</div>

<?php include DRUPAL_ROOT . "/" . path_to_theme() . "/templates/includes/footer.inc"; ?>

<!-- ClickTale Bottom part -->
<script type='text/javascript'>
document.write(unescape("%3Cscript%20src='"+(document.location.protocol=='https:'? "https://cdnssl.clicktale.net/www/ptc/8dd11315-763a-4246-bb54-dfc6d9cb1206.js":"http://cdn.clicktale.net/www/ptc/8dd11315-763a-4246-bb54-dfc6d9cb1206.js") + "'%20type='text/javascript'%3E%3C/script%3E"));
</script>
<!-- ClickTale end of Bottom part -->
