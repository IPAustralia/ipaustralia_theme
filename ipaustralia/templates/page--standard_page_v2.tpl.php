<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KSCK47"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<!-- ClickTale Top part -->
<script type="text/javascript">
var WRInitTime=(new Date()).getTime();
</script>
<!-- ClickTale end of Top part -->

<?php include DRUPAL_ROOT . "/" . path_to_theme() . "/templates/includes/header.inc"; ?>

<div class="main-container <?php if (isset($page_classes)): print implode(' ', $page_classes); endif; ?>">

  <div class="overlay"></div>

  <?php if (isset($messages) && !empty($messages)): ?>
    <div class="messages">
      <div class="container">
        <?php print $messages; ?>
      </div>
    </div>
  <?php endif; ?>

  <div class="masthead-wrapper">
    <div class="container">
    <?php
      $hero_image = isset($page['content']['system_main']['nodes'][$node->nid]['field_masthead_image']) ? $page['content']['system_main']['nodes'][$node->nid]['field_masthead_image'] : null;
      if (isset($title) && !empty($title)):
        if (isset($hero_image) && !empty($hero_image)): ?>
          <div class="col-md-6 col-sm-12">
        <?php else: ?>
          <div class="col-sm-12">
        <?php endif; ?>
        <h1 id="mainHeading"><?php print $title; ?></h1>
        <?php
            $subtitle = isset($page['content']['system_main']['nodes'][$node->nid]['field_subtitle']) ? $page['content']['system_main']['nodes'][$node->nid]['field_subtitle'] : null;
            if (isset($subtitle) && !empty($subtitle)): ?>
              <div class="subtitle"><?php print render($subtitle); ?></div>
        <?php endif; ?>
      </div>
    <?php endif; ?>
    <?php
      if (isset($hero_image) && !empty($hero_image)): ?>
      <div class="col-md-6 col-sm-12">
        <?php print render($hero_image); ?>
      </div>
    <?php endif; ?>
    </div>
  </div>

  <?php print render($page['content_top']); ?>

  <div class="container">

    <?php if (isset($page['sidebar_first']) && !empty($page['sidebar_first'])): ?>
      <aside class="col-sm-3">
        <?php print render($page['sidebar_first']); ?>
      </aside>  <!-- /#sidebar-first -->
    <?php endif; ?>

    <section<?php print $variables['content_column_class']; ?> role="main" aria-labelledby="mainHeading">
      <a id="main-content"></a>

      <?php if (isset($tabs) && !empty($tabs)): ?>
        <?php print render($tabs); ?>
      <?php endif; ?>
      <?php if (isset($page['help']) && !empty($page['help'])): ?>
        <?php print render($page['help']); ?>
      <?php endif; ?>
      <?php if (isset($action_links) && !empty($action_links)): ?>
        <ul class="action-links"><?php print render($action_links); ?></ul>
      <?php endif; ?>

      <?php if (!empty($breadcrumb)): ?>
        <div class="breadcrumbs" role="navigation">
          <div class="container">
             <?php print $breadcrumb; ?>
          </div>
        </div>
      <?php endif; ?>

      <?php
          $page_body = isset($page['content']['system_main']['nodes'][$node->nid]['body']) ? $page['content']['system_main']['nodes'][$node->nid]['body'] : null;
          if (isset($page_body) && !empty($page_body)): ?>
            <?php print render($page_body); ?>
      <?php endif; ?>

    </section>

    <?php if (isset($page['sidebar_second']) && !empty($page['sidebar_second'])): ?>
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
