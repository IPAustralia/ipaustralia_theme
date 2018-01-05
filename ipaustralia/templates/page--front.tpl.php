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

<div class="main-container">

  <div class="overlay" />

  <?php if (!empty($messages)): ?>
    <div class="messages">
      <div class="container">
        <?php print $messages; ?>
      </div>
    </div>
  <?php endif; ?>

  <div>

    <section role="main" aria-label="Main content">
      <a id="main-content"></a>
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

  </div>
</div>

<?php include DRUPAL_ROOT . "/" . path_to_theme() . "/templates/includes/footer.inc"; ?>

<!-- ClickTale Bottom part -->
<script type='text/javascript'>
document.write(unescape("%3Cscript%20src='"+(document.location.protocol=='https:'? "https://cdnssl.clicktale.net/www/ptc/8dd11315-763a-4246-bb54-dfc6d9cb1206.js":"http://cdn.clicktale.net/www/ptc/8dd11315-763a-4246-bb54-dfc6d9cb1206.js") + "'%20type='text/javascript'%3E%3C/script%3E"));
</script>
<!-- ClickTale end of Bottom part -->
