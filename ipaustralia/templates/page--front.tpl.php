<?php include DRUPAL_ROOT . "/" . path_to_theme() . "/templates/includes/header.inc"; ?>

<div class="main-container <?php print $container_class; ?>">

  <div class="row">

    <section<?php print $content_column_class; ?>>
      <a id="main-content"></a>
      <?php print $messages; ?>
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
